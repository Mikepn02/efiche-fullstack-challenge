import axios from '@/lib/axios.config';

const BASE_URL = '/api/v1/patient'

enum Gender {
    MALE,
    FEMALE
}

export interface createPatientDto {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender?: Gender;
    assignedToId: string
}

export const getAllPatients = async () => {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data.data;
}

export const getPatientsAssignedTo = async(assignedToId: string) => {
    const response = await axios.get(`${BASE_URL}/assigned-to/${assignedToId}`);
    return response.data.data;
}

export const createPatient = async (data: createPatientDto) => {
    const response = await axios.post(`${BASE_URL}/`, data);
    return response.data.data;
}

