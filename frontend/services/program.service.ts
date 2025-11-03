import axios from '@/lib/axios.config';
import { CreateProgramDto, CreateSessionDto } from '@/types';

const BASE_URL='/api/v1'



export const getAllPrograms = async() => {
    const response = await axios.get(`${BASE_URL}/program`)
    return response.data.data;
}

export const getUpcomingPrograms = async() => {
    const response = await axios.get(`${BASE_URL}/program/upcoming`)
    return response.data.data;
}

export const getProgramSessions = async(programId: string) => {
    const response = await axios.get(`${BASE_URL}/sessions/program/${programId}`)
    return response.data.data;
}

export const createProgram = async(program: CreateProgramDto) => {

    const response = await axios.post(`${BASE_URL}/program`,program)
    return response.data.data;
}


export const createProgramSession = async(session: CreateSessionDto) => {
    const response = await axios.post(`${BASE_URL}/sessions/program`,session)
    return response.data.data;
}

export const creatBulkProgramSession = async(session: CreateSessionDto[]) => {
    const response = await axios.post(`${BASE_URL}/sessions/program/bulk`,session)
    return response.data.data;
}

export const getAllSessions = async() => {
    const response = await axios.get(`${BASE_URL}/sessions`)
    return response.data.data;
}