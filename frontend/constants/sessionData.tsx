export interface ISessionAttendance {
  id: string;
  sessionId: string;
  sessionName: string;
  sessionType: 'one-on-one' | 'group' | 'consultation';
  patientName: string;
  patientId: string;
  programName: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'attended' | 'missed' | 'canceled' | 'scheduled';
  attendanceMarkedBy?: string;
  attendanceMarkedAt?: string;
  reason?: string;
  notes?: string;
}

export const dummyAttendance: ISessionAttendance[] = [
  {
    id: '1',
    sessionId: 'S001',
    sessionName: 'Weekly Check-in',
    sessionType: 'one-on-one',
    patientName: 'John Doe',
    patientId: 'P001',
    programName: 'Mental Health Support',
    scheduledDate: '2025-11-02',
    scheduledTime: '09:00 AM',
    status: 'scheduled'
  },
  {
    id: '2',
    sessionId: 'S002',
    sessionName: 'Group Therapy',
    sessionType: 'group',
    patientName: 'Jane Smith',
    patientId: 'P002',
    programName: 'Mental Health Support',
    scheduledDate: '2025-11-02',
    scheduledTime: '10:30 AM',
    status: 'scheduled'
  },
  {
    id: '3',
    sessionId: 'S003',
    sessionName: 'Blood Sugar Check',
    sessionType: 'consultation',
    patientName: 'Michael Brown',
    patientId: 'P003',
    programName: 'Diabetes Management',
    scheduledDate: '2025-11-01',
    scheduledTime: '02:00 PM',
    status: 'attended',
    attendanceMarkedBy: 'Dr. Sarah Wilson',
    attendanceMarkedAt: '2025-11-01 02:15 PM',
    notes: 'Patient responded well. Blood sugar levels stable.'
  },
  {
    id: '4',
    sessionId: 'S004',
    sessionName: 'Weekly Counseling',
    sessionType: 'one-on-one',
    patientName: 'Sarah Johnson',
    patientId: 'P004',
    programName: 'Mental Health Support',
    scheduledDate: '2025-10-30',
    scheduledTime: '11:00 AM',
    status: 'missed',
    attendanceMarkedBy: 'Dr. John Davis',
    attendanceMarkedAt: '2025-10-30 11:30 AM',
    reason: 'Patient did not show up. No prior notification.'
  },
  {
    id: '5',
    sessionId: 'S005',
    sessionName: 'Nutrition Consultation',
    sessionType: 'consultation',
    patientName: 'David Wilson',
    patientId: 'P005',
    programName: 'Diabetes Management',
    scheduledDate: '2025-10-28',
    scheduledTime: '03:00 PM',
    status: 'canceled',
    attendanceMarkedBy: 'Dr. Emily Brown',
    attendanceMarkedAt: '2025-10-28 10:00 AM',
    reason: 'Patient requested to reschedule due to work emergency.',
    notes: 'Rescheduled to next week'
  },
  {
    id: '6',
    sessionId: 'S006',
    sessionName: 'Group Discussion',
    sessionType: 'group',
    patientName: 'John Doe',
    patientId: 'P001',
    programName: 'Mental Health Support',
    scheduledDate: '2025-11-03',
    scheduledTime: '01:00 PM',
    status: 'scheduled'
  },
  {
    id: '7',
    sessionId: 'S007',
    sessionName: 'Initial Assessment',
    sessionType: 'one-on-one',
    patientName: 'Jane Smith',
    patientId: 'P002',
    programName: 'Diabetes Management',
    scheduledDate: '2025-10-29',
    scheduledTime: '09:30 AM',
    status: 'attended',
    attendanceMarkedBy: 'Dr. Sarah Wilson',
    attendanceMarkedAt: '2025-10-29 10:00 AM',
    notes: 'First session completed successfully. Patient engaged and cooperative.'
  }
];