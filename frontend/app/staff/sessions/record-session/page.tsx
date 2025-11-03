'use client'
import { renderStepContent } from '@/components/shared/Steps'
import { useSessionRecord } from '@/hooks/use-session-record'
import { CalendarOutlined, CheckCircleOutlined, MedicineBoxOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Space, Spin, Steps } from 'antd'
import { createMedicationColumns } from './medicationColumns'

const MultiStepSessionFlow = () => {
  const {
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
    patients,
    sessions,
    availableMedications,
    availableForDispensing,
    isLoading,
    handleNext,
    handlePrescribeMedication,
    handleAddMedication,
    handleSubmit,
    isPrescribing,
    isRecordingSession,
    isRecordingDispense
  } = useSessionRecord()

  const medicationColumns = createMedicationColumns(selectedMedications, setSelectedMedications)

  const steps = [
    { title: 'Select Patient', icon: <UserOutlined />, description: 'Choose patient for session' },
    { title: 'Record Session', icon: <CalendarOutlined />, description: 'Mark attendance & notes' },
    { title: 'Prescribe Medication', icon: <MedicineBoxOutlined />, description: 'Prescribe medications to patient' },
    { title: 'Dispense Medication', icon: <MedicineBoxOutlined />, description: 'Dispense prescribed medications' },
    { title: 'Review & Submit', icon: <CheckCircleOutlined />, description: 'Confirm all details' }
  ]

  return (
    <div className="px-2 sm:px-4 md:px-6 lg:px-10 py-4 md:py-6">
      <Card className="w-full">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Patient Session & Medication Dispensation</h1>
        <p className="text-sm sm:text-base text-gray-500 mb-4 md:mb-6">Complete patient session and dispense medications in multiple steps</p>
        <div className="mb-4 md:mb-8 overflow-x-auto">
          <Steps 
            current={currentStep} 
            items={steps} 
            responsive={true}
            className="mb-8"
          />
        </div>
        
        <div className="mb-4 md:mb-6 min-h-[300px] sm:min-h-[400px]">
          {isLoading ? (
            <Spin tip="Loading..." size="large" className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]" />
          ) : (
            <div className="w-full overflow-x-auto">
              {renderStepContent({
                currentStep,
                selectedPatient,
                setSelectedPatient,
                patients,
                selectedSession,
                setSelectedSession,
                sessions,
                attendanceStatus,
                setAttendanceStatus,
                attendanceReason,
                setAttendanceReason,
                sessionNotes,
                setSessionNotes,
                prescribeMedicationId,
                setPrescribeMedicationId,
                prescribeDosage,
                setPrescribeDosage,
                prescribeFrequency,
                setPrescribeFrequency,
                handlePrescribeMedication,
                prescribedMedications,
                selectedMedicationId,
                setSelectedMedicationId,
                availableMedications,
                availableForDispensing,
                medicationQuantity,
                setMedicationQuantity,
                medicationNotes,
                setMedicationNotes,
                handleAddMedication,
                selectedMedications,
                medicationColumns,
                dispensationNotes,
                setDispensationNotes,
                isPrescribing
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Button 
            size="large" 
            disabled={currentStep === 0 || isLoading} 
            onClick={() => setCurrentStep(currentStep - 1)}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Previous
          </Button>
          <div className="flex gap-3 w-full sm:w-auto order-1 sm:order-2">
            {currentStep < steps.length - 1 && (
              <Button 
                type="primary" 
                size="large" 
                onClick={handleNext} 
                disabled={isLoading}
                className="flex-1 sm:flex-initial"
              >
                Next
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button 
                type="primary" 
                size="large" 
                icon={<CheckCircleOutlined />} 
                onClick={handleSubmit}
                loading={isRecordingSession || isRecordingDispense || isPrescribing}
                disabled={isLoading}
                className="flex-1 sm:flex-initial"
              >
                Submit Session
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default MultiStepSessionFlow