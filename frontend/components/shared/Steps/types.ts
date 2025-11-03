import { MedicationFrequency } from '@/services/medication.service'

export interface Patient {
  id: string
  name: string
  programId: string
  programName: string
}

export interface Session {
  sessionId: string
  sessionName: string
  sessionType: string
  scheduledDate: string
  scheduledTime: string
}

export interface Medication {
  id: string
  name: string
  dose: string
  frequency: string
  canDispenseToday: boolean
}

export interface PrescribedMedication {
  medicationId: string
  name: string
  dosage: string
  frequency: MedicationFrequency
  assignmentId: string
}

export interface SelectedMedication {
  medicationId: string
  name: string
  dose: string
  frequency: string
  quantity: number
  notes: string
  assignmentId?: string
}

export interface SessionStepContentProps {
  currentStep: number
  selectedPatient: Patient | null
  setSelectedPatient: (patient: Patient | null) => void
  patients: Patient[]
  selectedSession: Session | null
  setSelectedSession: (session: Session | null) => void
  sessions: Session[]
  attendanceStatus: string
  setAttendanceStatus: (status: string) => void
  attendanceReason: string
  setAttendanceReason: (reason: string) => void
  sessionNotes: string
  setSessionNotes: (notes: string) => void
  // Prescribe medication props
  prescribeMedicationId?: string
  setPrescribeMedicationId?: (id: string) => void
  prescribeDosage?: string
  setPrescribeDosage?: (dosage: string) => void
  prescribeFrequency?: MedicationFrequency
  setPrescribeFrequency?: (frequency: MedicationFrequency) => void
  handlePrescribeMedication?: () => void
  prescribedMedications?: PrescribedMedication[]
  // Dispense medication props
  selectedMedicationId: string
  setSelectedMedicationId: (id: string) => void
  availableMedications: Medication[]
  availableForDispensing?: Medication[]
  medicationQuantity: number
  setMedicationQuantity: (quantity: number) => void
  medicationNotes: string
  setMedicationNotes: (notes: string) => void
  handleAddMedication: () => void
  selectedMedications: SelectedMedication[]
  medicationColumns: any[]
  dispensationNotes: string
  setDispensationNotes: (notes: string) => void
  isPrescribing?: boolean
}

