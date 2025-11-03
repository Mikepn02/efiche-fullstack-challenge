import axios from '@/lib/axios.config';

const BASE_URL = '/api/v1/enrollments'


export interface EnrollPatientDto{
    patientId: string,
    programId: string;
}

export const enrollPatient = async(data: EnrollPatientDto) => {
    const response = await axios.post(`${BASE_URL}/`,data );
    return response.data.data;
}


export const getEnrolledPatientsInProgram = async(programId: string) => {
    const response = await axios.get(`${BASE_URL}/${programId}`);
    return response.data;
}

export const getAllEnrollments = async(userId: string) => {
    const response = await axios.get(`${BASE_URL}/`, {
        params: { userId }
    });
    return response.data.data;
}