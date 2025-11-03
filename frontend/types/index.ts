import { Dayjs } from "dayjs";


export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
}



export interface IProgram {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    session: string;
}

export interface IPatient {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
}


export interface IEnrollment {
    id: string;
    patientId: string;
    programId: string;
    enrolledById: string;
    enrolledAt?: string;
    createdAt?: string;
    patient: {
        id: string;
        firstName: string;
        lastName: string;
        gender: string;
        dateOfBirth: string;
        assignedToId?: string;
    };
    program: {
        id: string;
        name: string;
        description: string;
        startDate: string;
        endDate: string;
        status: string;
    };
    enrolledBy: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    stats: {
        totalSessions: number;
        attendedSessions: number;
        attendanceRate: number;
    };
}

export enum ProgramStatus {
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export enum SessionType {
  ONE_ON_ONE = 'ONE_ON_ONE',
  GROUP = 'GROUP',
  CONSULTATION = 'CONSULTATION',
}

export enum SessionFrequency {
  ONCE = 'ONCE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export interface ProgramFormValues {
  name: string;
  description: string;
  startDate: Dayjs;
  endDate: Dayjs;
  status: ProgramStatus;
}

export interface SessionFormValues {
  title: string;
  description: string;
  date: Dayjs;
  frequency: SessionFrequency;
  sessionType: SessionType;
}

export interface Session extends Omit<SessionFormValues, 'date'> {
  id: string;
  date: Dayjs;
}

export interface CreateProgramDto {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ProgramStatus;
}

export interface CreateSessionDto {
  programId: string;
  title: string;
  description: string;
  date: string;
  frequency: SessionFrequency;
  sessionType: SessionType;
}

export interface CreateProgramModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface IAttendanceTable {
  id: string ;
  patientName: string;
  programName: string;
  attendedAt: string;
  sessionStatus: string;
  cancelReason: string;
  schelduredDate: string;
  sessionType: string,
  attendanceMarkedBy:string
}

export interface IAttendanceResponse {
  id: string | number;
  patientName: string;
  programName: string | null;
  attendedAt: string | Date;
  sessionStatus: string;
  cancelReason?: string | null;
  schelduredDate: string | Date;
  sessionType: string;
  attendanceMarkedBy: string;
}
