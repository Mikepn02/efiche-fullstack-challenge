import { useState, useMemo } from 'react'
import { message, Modal } from 'antd'
import { usePatientsAssignedTo } from './use-patient'
import { usePrograms } from './use-program'
import { useProgramSessions } from './use-program'
import { useMedications } from './use-medication'
import { useRecordPatientSession } from './use-session'
import { useRecordDispensing, usePrescribePatient } from './use-medication'
import { useUserStore } from '@/store/user-store'
import { IPatient, SessionType } from '@/types'
import { SessionAttendanceDto, SessionStatus } from '@/services/session.service'
import { AssignMedicationDto, MedicationFrequency } from '@/services/medication.service'
import dayjs from 'dayjs'

interface Patient { id: string; name: string; programId: string; programName: string }
interface Session { sessionId: string; sessionName: string; sessionType: string; scheduledDate: string; scheduledTime: string }
interface Medication { id: string; name: string; dose: string; frequency: string; canDispenseToday: boolean; assignmentId?: string }
interface PrescribedMedication { medicationId: string; name: string; dosage: string; frequency: MedicationFrequency; assignmentId: string }
interface SelectedMedication { medicationId: string; name: string; dose: string; frequency: string; quantity: number; notes: string; assignmentId?: string }

export const useSessionRecord = () => {
  const { user } = useUserStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [attendanceStatus, setAttendanceStatus] = useState<string>('')
  const [attendanceReason, setAttendanceReason] = useState<string>('')
  const [sessionNotes, setSessionNotes] = useState<string>('')
  const [prescribedMedications, setPrescribedMedications] = useState<PrescribedMedication[]>([])
  const [prescribeMedicationId, setPrescribeMedicationId] = useState<string>('')
  const [prescribeDosage, setPrescribeDosage] = useState<string>('')
  const [prescribeFrequency, setPrescribeFrequency] = useState<MedicationFrequency>(MedicationFrequency.DAILY)
  const [selectedMedications, setSelectedMedications] = useState<SelectedMedication[]>([])
  const [dispensationNotes, setDispensationNotes] = useState<string>('')
  const [selectedMedicationId, setSelectedMedicationId] = useState<string>('')
  const [medicationQuantity, setMedicationQuantity] = useState<number>(1)
  const [medicationNotes, setMedicationNotes] = useState<string>('')

  const { data: patientsData, isLoading: isLoadingPatients } = usePatientsAssignedTo(user?.id)
  const { data: programsData } = usePrograms()
  const { data: medicationsData, isLoading: isLoadingMedications } = useMedications()
  const { mutate: recordSession, isPending: isRecordingSession } = useRecordPatientSession()
  const { mutate: recordDispense, isPending: isRecordingDispense } = useRecordDispensing()
  const { mutate: prescribeMedication, isPending: isPrescribing } = usePrescribePatient()

  const patients: Patient[] = useMemo(() => {
    if (!patientsData || !programsData) return []
    return (patientsData as IPatient[]).map((p: IPatient) => {
      const program = programsData?.find((pg: any) => pg.name) || null
      return {
        id: p.id,
        name: `${p.firstName} ${p.lastName}`,
        programId: program?.id || '',
        programName: program?.name || 'No Program'
      }
    })
  }, [patientsData, programsData])

  const { data: programSessionsData, isLoading: isLoadingSessions } = useProgramSessions(
    selectedPatient?.programId || null
  )

  const sessions: Session[] = useMemo(() => {
    if (!programSessionsData) return []
    return (programSessionsData as any[]).map((s: any) => ({
      sessionId: s.id,
      sessionName: s.title || s.name || 'Session',
      sessionType: s.sessionType || SessionType.ONE_ON_ONE,
      scheduledDate: dayjs(s.date).format('YYYY-MM-DD'),
      scheduledTime: dayjs(s.date).format('hh:mm A')
    }))
  }, [programSessionsData])

  const availableMedications: Medication[] = useMemo(() => {
    if (!medicationsData) return []
    return (medicationsData as any[]).map((m: any) => ({
      id: m.id,
      name: m.name || m.medicationName,
      dose: m.dosage || m.dose || 'N/A',
      frequency: m.frequency || 'N/A',
      canDispenseToday: true,
      assignmentId: m.assignmentId
    }))
  }, [medicationsData])

  const availableForDispensing = useMemo(() => {
    return prescribedMedications.map(p => ({
      id: p.medicationId,
      name: p.name,
      dose: p.dosage,
      frequency: MedicationFrequency[p.frequency],
      canDispenseToday: true,
      assignmentId: p.assignmentId
    }))
  }, [prescribedMedications])

  const handlePrescribeMedication = () => {
    if (!selectedPatient) return message.error('Please select a patient first')
    if (!prescribeMedicationId) return message.error('Please select a medication')
    if (!prescribeDosage) return message.error('Please enter dosage')

    const medication = availableMedications.find(m => m.id === prescribeMedicationId)
    if (!medication) return message.error('Medication not found')

    if (prescribedMedications.some(p => p.medicationId === prescribeMedicationId)) {
      return message.warning('This medication is already prescribed')
    }

    const frequencyString = MedicationFrequency[prescribeFrequency] as 'DAILY' | 'WEEKLY' | 'MONTHLY'

    const prescriptionData: AssignMedicationDto = {
      patientId: selectedPatient.id,
      medicationId: prescribeMedicationId,
      dosage: prescribeDosage,
      frequency: frequencyString as any
    }

    prescribeMedication(prescriptionData, {
      onSuccess: (response: any) => {
        const assignmentId = response?.assignmentId || response?.id || response
        setPrescribedMedications([...prescribedMedications, {
          medicationId: prescribeMedicationId,
          name: medication.name,
          dosage: prescribeDosage,
          frequency: prescribeFrequency,
          assignmentId: String(assignmentId)
        }])
        setPrescribeMedicationId('')
        setPrescribeDosage('')
        setPrescribeFrequency(MedicationFrequency.DAILY)
        message.success('Medication prescribed successfully')
      },
      onError: (error: any) => {
        console.error('Prescription error:', error)
        message.error('Failed to prescribe medication. Please try again.')
      }
    })
  }

  const handleAddMedication = () => {
    if (!selectedMedicationId) return message.error('Please select a prescribed medication')
    
    const prescribedMed = prescribedMedications.find(p => p.medicationId === selectedMedicationId)
    if (!prescribedMed) {
      return message.error('This medication must be prescribed first. Please go back to the Prescribe step.')
    }

    if (selectedMedications.some(m => m.assignmentId === prescribedMed.assignmentId)) {
      return message.warning('This medication is already added for dispensation')
    }
    
    setSelectedMedications([...selectedMedications, {
      medicationId: prescribedMed.medicationId,
      name: prescribedMed.name,
      dose: prescribedMed.dosage,
      frequency: MedicationFrequency[prescribedMed.frequency],
      quantity: medicationQuantity,
      notes: medicationNotes,
      assignmentId: prescribedMed.assignmentId
    }])
    setSelectedMedicationId('')
    setMedicationQuantity(1)
    setMedicationNotes('')
    message.success('Medication added for dispensation')
  }

  const handleNext = () => {
    if (currentStep === 0 && !selectedPatient) return message.error('Please select a patient')
    if (currentStep === 1 && (!selectedSession || !attendanceStatus)) return message.error('Please select session and mark attendance')
    if (currentStep === 1 && (attendanceStatus === 'missed' || attendanceStatus === 'canceled') && !attendanceReason) {
      return message.error('Please provide a reason')
    }
    if (currentStep === 2 && prescribedMedications.length === 0) {
      return message.warning('No medications prescribed. You can skip this step or prescribe at least one medication.')
    }
    setCurrentStep(currentStep + 1)
  }

  const handleSubmit = () => {
    if (!selectedPatient || !selectedSession) {
      return message.error('Missing required information')
    }

    Modal.confirm({
      title: 'Confirm Submission',
      content: 'Submit this session and medication dispensation?',
      onOk: async () => {
        try {
          const sessionStatusMap: Record<string, SessionStatus> = {
            'attended': SessionStatus.ATTENDED,
            'missed': SessionStatus.MISSED,
            'canceled': SessionStatus.CANCELED
          }

          const attendanceData: SessionAttendanceDto = {
            patientId: selectedPatient.id,
            sessionId: selectedSession.sessionId,
            status: sessionStatusMap[attendanceStatus] || SessionStatus.ATTENDED
          }

          recordSession(attendanceData, {
            onSuccess: async () => {
              if (selectedMedications.length > 0) {
                const dispensePromises = selectedMedications
                  .filter(med => med.assignmentId)
                  .map(med => {
                    return new Promise((resolve, reject) => {
                      recordDispense({
                        patientId: selectedPatient.id,
                        assignmentId: med.assignmentId!
                      }, {
                        onSuccess: () => resolve(null),
                        onError: (error) => reject(error)
                      })
                    })
                  })

                try {
                  await Promise.all(dispensePromises)
                  message.success('Session and medication dispensation recorded successfully!')
                  setTimeout(() => {
                    setCurrentStep(0)
                    setSelectedPatient(null)
                    setSelectedSession(null)
                    setAttendanceStatus('')
                    setAttendanceReason('')
                    setSessionNotes('')
                    setPrescribedMedications([])
                    setSelectedMedications([])
                    setDispensationNotes('')
                  }, 1500)
                } catch (error) {
                  message.error('Session recorded but some medications failed to dispense')
                }
              } else {
                message.success('Session recorded successfully!')
                setTimeout(() => {
                  setCurrentStep(0)
                  setSelectedPatient(null)
                  setSelectedSession(null)
                  setAttendanceStatus('')
                  setAttendanceReason('')
                  setSessionNotes('')
                  setPrescribedMedications([])
                  setSelectedMedications([])
                  setDispensationNotes('')
                }, 1500)
              }
            },
            onError: (error: any) => {
              console.error('Failed to record session:', error)
              message.error('Failed to record session. Please try again.')
            }
          })
        } catch (error) {
          console.error('Submission error:', error)
          message.error('An error occurred during submission')
        }
      }
    })
  }

  const resetForm = () => {
    setCurrentStep(0)
    setSelectedPatient(null)
    setSelectedSession(null)
    setAttendanceStatus('')
    setAttendanceReason('')
    setSessionNotes('')
    setPrescribedMedications([])
    setSelectedMedications([])
    setDispensationNotes('')
  }

  const isLoading = isLoadingPatients || isLoadingMedications

  return {
    // State
    currentStep,
    setCurrentStep,
    selectedPatient,
    setSelectedPatient,
    selectedSession,
    setSelectedSession,
    attendanceStatus,
    setAttendanceStatus,
    attendanceReason,
    setAttendanceReason,
    sessionNotes,
    setSessionNotes,
    prescribedMedications,
    prescribeMedicationId,
    setPrescribeMedicationId,
    prescribeDosage,
    setPrescribeDosage,
    prescribeFrequency,
    setPrescribeFrequency,
    selectedMedications,
    setSelectedMedications,
    dispensationNotes,
    setDispensationNotes,
    selectedMedicationId,
    setSelectedMedicationId,
    medicationQuantity,
    setMedicationQuantity,
    medicationNotes,
    setMedicationNotes,
    // Data
    patients,
    sessions,
    availableMedications,
    availableForDispensing,
    isLoading,
    isLoadingSessions,
    // Handlers
    handleNext,
    handlePrescribeMedication,
    handleAddMedication,
    handleSubmit,
    isPrescribing,
    isRecordingSession,
    isRecordingDispense
  }
}

