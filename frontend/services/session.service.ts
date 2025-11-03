import axios from '@/lib/axios.config';


const BASE_URL = '/api/v1/sessions'


export enum SessionStatus {
    ATTENDED = 'ATTENDED',
    MISSED = 'MISSED',
    CANCELED = 'CANCELED',
}

export interface SessionAttendanceDto{
    patientId: string;
    sessionId: string;
    status: SessionStatus;
}


export const recordSessionAttendance = async(data: SessionAttendanceDto) => {
    const response = await axios.post(`${BASE_URL}/patient`, data);
    return response.data.data;
}

export const getSessionAttendances = async() => {
    const response = await axios.get(`${BASE_URL}/patient`);
    return response.data.data;
}


export const cancelSession = async(sessionId: string,reason: string) => {
    const response = await axios.patch(`${BASE_URL}/cancel/${sessionId}`, reason);
    return response.data.data;
}