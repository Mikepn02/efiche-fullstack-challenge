import React from 'react'
import Step0SelectPatient from './Step0SelectPatient'
import Step1RecordAttendance from './Step1RecordAttendance'
import Step2PrescribeMedication from './Step2PrescribeMedication'
import Step3DispenseMedication from './Step3DispenseMedication'
import Step4Review from './Step4Review'
import { SessionStepContentProps } from './types'

export const renderStepContent = (props: SessionStepContentProps) => {
  const {
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
    prescribedMedications = [],
    selectedMedicationId,
    setSelectedMedicationId,
    availableMedications,
    availableForDispensing = [],
    medicationQuantity,
    setMedicationQuantity,
    medicationNotes,
    setMedicationNotes,
    handleAddMedication,
    selectedMedications,
    medicationColumns,
    dispensationNotes,
    setDispensationNotes,
    isPrescribing = false
  } = props

  switch (currentStep) {
    case 0:
      return (
        <Step0SelectPatient
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          patients={patients}
        />
      )

    case 1:
      return (
        <Step1RecordAttendance
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
          sessions={sessions}
          attendanceStatus={attendanceStatus}
          setAttendanceStatus={setAttendanceStatus}
          attendanceReason={attendanceReason}
          setAttendanceReason={setAttendanceReason}
          sessionNotes={sessionNotes}
          setSessionNotes={setSessionNotes}
        />
      )

    case 2:
      return (
        <Step2PrescribeMedication
          prescribeMedicationId={prescribeMedicationId}
          setPrescribeMedicationId={setPrescribeMedicationId}
          prescribeDosage={prescribeDosage}
          setPrescribeDosage={setPrescribeDosage}
          prescribeFrequency={prescribeFrequency}
          setPrescribeFrequency={setPrescribeFrequency}
          handlePrescribeMedication={handlePrescribeMedication}
          prescribedMedications={prescribedMedications}
          availableMedications={availableMedications}
          isPrescribing={isPrescribing}
        />
      )

    case 3:
      return (
        <Step3DispenseMedication
          selectedMedicationId={selectedMedicationId}
          setSelectedMedicationId={setSelectedMedicationId}
          availableForDispensing={availableForDispensing}
          medicationQuantity={medicationQuantity}
          setMedicationQuantity={setMedicationQuantity}
          medicationNotes={medicationNotes}
          setMedicationNotes={setMedicationNotes}
          handleAddMedication={handleAddMedication}
          selectedMedications={selectedMedications}
          medicationColumns={medicationColumns}
          dispensationNotes={dispensationNotes}
          setDispensationNotes={setDispensationNotes}
        />
      )

    case 4:
      return (
        <Step4Review
          selectedPatient={selectedPatient}
          selectedSession={selectedSession}
          attendanceStatus={attendanceStatus}
          attendanceReason={attendanceReason}
          sessionNotes={sessionNotes}
          prescribedMedications={prescribedMedications}
          selectedMedications={selectedMedications}
          medicationColumns={medicationColumns}
          dispensationNotes={dispensationNotes}
        />
      )

    default:
      return null
  }
}

export { default as InfoCard } from './InfoCard'
export * from './types'

