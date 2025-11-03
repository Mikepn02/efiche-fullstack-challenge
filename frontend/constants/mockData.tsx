import { IEnrollment, IPatient } from '@/types';

export const dummyPrograms = [
  {
    id: 'prog_1',
    name: 'Diabetes Care Program',
    description: 'A 12-week program focused on diabetes management and lifestyle changes.',
    startDate: '2025-01-05',
    endDate: '2025-03-28',
    session: 'ACTIVE',
    enrolledCount: 124,
  },
  {
    id: 'prog_2',
    name: 'Cardiac Rehab',
    description: 'Post-operative rehabilitation for cardiac patients.',
    startDate: '2025-02-10',
    endDate: '2025-05-10',
    session: 'UPCOMING',
    enrolledCount: 48,
  },
  {
    id: 'prog_3',
    name: 'Mental Health Support',
    description: 'Group-based therapy and resources for mental wellbeing.',
    startDate: '2024-11-01',
    endDate: '2025-02-28',
    session: 'COMPLETED',
    enrolledCount: 200,
  },
];

export const dummyPatients: IPatient[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-05-12',
    gender: 'Male',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1985-08-23',
    gender: 'Female',
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    dateOfBirth: '2000-11-02',
    gender: 'Male',
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Davis',
    dateOfBirth: '1995-03-15',
    gender: 'Female',
  },
  {
    id: '5',
    firstName: 'William',
    lastName: 'Brown',
    dateOfBirth: '1988-07-29',
    gender: 'Male',
  },
  {
    id: '6',
    firstName: 'Olivia',
    lastName: 'Wilson',
    dateOfBirth: '1992-12-10',
    gender: 'Female',
  },
  {
    id: '7',
    firstName: 'James',
    lastName: 'Taylor',
    dateOfBirth: '1978-02-05',
    gender: 'Male',
  },
  {
    id: '8',
    firstName: 'Sophia',
    lastName: 'Anderson',
    dateOfBirth: '2001-09-17',
    gender: 'Female',
  },
  {
    id: '9',
    firstName: 'David',
    lastName: 'Thomas',
    dateOfBirth: '1983-06-21',
    gender: 'Male',
  },
  {
    id: '10',
    firstName: 'Ava',
    lastName: 'Martinez',
    dateOfBirth: '1997-01-30',
    gender: 'Female',
  },
];

export const dummyEnrollments: IEnrollment[] = [
  {
    id: '1',
    patientName: 'John Doe',
    programName: 'Health Awareness',
    enrolledAt: '2025-10-02',
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    programName: 'Nutrition Program',
    enrolledAt: '2025-09-05',
  },
  {
    id: '3',
    patientName: 'Michael Johnson',
    programName: 'Exercise Workshop',
    enrolledAt: '2025-10-10',
  },
  {
    id: '4',
    patientName: 'Emily Davis',
    programName: 'Health Awareness',
    enrolledAt: '2025-10-12',
  },
  {
    id: '5',
    patientName: 'William Brown',
    programName: 'Nutrition Program',
    enrolledAt: '2025-09-15',
  },
  {
    id: '6',
    patientName: 'Olivia Wilson',
    programName: 'Exercise Workshop',
    enrolledAt: '2025-11-01',
  },
  {
    id: '7',
    patientName: 'James Taylor',
    programName: 'Health Awareness',
    enrolledAt: '2025-10-05',
  },
  {
    id: '8',
    patientName: 'Sophia Anderson',
    programName: 'Nutrition Program',
    enrolledAt: '2025-09-20',
  },
  {
    id: '9',
    patientName: 'David Thomas',
    programName: 'Exercise Workshop',
    enrolledAt: '2025-10-18',
  },
  {
    id: '10',
    patientName: 'Ava Martinez',
    programName: 'Health Awareness',
    enrolledAt: '2025-10-25',
  },
];

