"use client";
import axios from "axios";
import { env } from "next-runtime-env";

const API_URL = env("NEXT_PUBLIC_API_URL");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.response.use(
  res => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await api.post("/api/v1/auth/refresh");
        return api(original);
      } catch {
        window.location.href = "/auth/sign-in";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
