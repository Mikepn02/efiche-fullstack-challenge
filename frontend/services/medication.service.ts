
import axios from '@/lib/axios.config';

const BASE_URL = '/api/v1/medications'

export enum MedicationFrequency {
    DAILY,
    WEEKLY,
    MONTHLY
}

export interface AssignMedicationDto {
    patientId: string;
    medicationId: string;
    dosage: string;
    frequency: MedicationFrequency | 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

export interface DispenseRecordDto {
    patientId: string;
    assignmentId: string
}


export const getAllMedications = async () => {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data.data;
}

export const prescribePatient = async (data: AssignMedicationDto) => {
    const response = await axios.post(`${BASE_URL}/patient/prescribe`, data)
    return response.data.data
}


export const recordDispensing = async (data: DispenseRecordDto) => {
    const response = await axios.post(`${BASE_URL}/patient/dispense`, data)
    return response.data.data
}

export const getAllDispensingRecord = async () => {
    const response = await axios.get(`${BASE_URL}/dispense/history`);
    return response.data.data;
}