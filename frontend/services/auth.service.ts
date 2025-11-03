
import axios from '@/lib/axios.config';

const BASE_URL = '/api/v1/auth'

export const login = async (email: string, password: string) => {

    const response = await axios.post(`${BASE_URL}/login`, { email, password })
    return response.data.data;
}


export const registerUser = async (name: string, email: string, password: string) => {
    const response = await axios.post(`${BASE_URL}/staff/create`, { name, email, password });
    return response.data.data
}

export const getAllUsers = async () => {
    const response = await axios.get(`/api/v1/users`);
    return response.data.data
}

export const logout = async () => {
    const response = await axios.post(`${BASE_URL}/logout`);
    return response.data;
}