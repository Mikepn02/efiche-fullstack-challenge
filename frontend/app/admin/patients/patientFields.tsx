import { IPatient } from '@/types'

interface IPatientWithAssignment extends IPatient {
  assignedToId?: string
}

export const createPatientFields = (userOptions: { label: string; value: any }[]) => {
  const genderOptions = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
  ]

  return [
    {
      name: "firstName" as keyof IPatientWithAssignment,
      label: "First Name",
      placeholder: "Enter First Name",
      rules: [{ required: true, message: "First Name is required" }],
    },
    {
      name: "lastName" as keyof IPatientWithAssignment,
      label: "Last Name",
      placeholder: "Enter Last Name",
      rules: [{ required: true, message: "Last Name is required" }],
    },
    {
      name: "dateOfBirth" as keyof IPatientWithAssignment,
      label: "Date Of Birth",
      inputType: "date" as const,
      placeholder: "Select Date Of Birth",
      rules: [{ required: true, message: "Date of birth is required" }],
    },
    {
      name: 'gender' as keyof IPatientWithAssignment,
      label: "Gender",
      inputType: "select" as const,
      placeholder: "Select Gender",
      options: genderOptions,
      rules: [{ required: true, message: "Gender is required" }],
    },
    {
      name: 'assignedToId' as keyof IPatientWithAssignment,
      label: "Assigned To",
      inputType: "select" as const,
      placeholder: "Select Doctor",
      options: userOptions,
      rules: [{ required: true, message: "Assigned doctor is required" }],
    }
  ]
}

