import { createProgram, creatBulkProgramSession, createProgramSession, getAllPrograms, getProgramSessions, getUpcomingPrograms, getAllSessions } from "@/services/program.service";
import { CreateProgramDto, CreateSessionDto } from "@/types";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { notification } from "antd";

import { useRouter } from "next/navigation";


export const usePrograms = () => {
    return useQuery({
        queryKey: ["programs"],
        queryFn: getAllPrograms,
        staleTime: 1000 * 60,
    });
};

export const useProgramSessions = (programId: string | null) => {
    return useQuery({
        queryKey: ['sessions', programId],
        queryFn: () => getProgramSessions(programId!),
        enabled: !!programId,
        staleTime: 5 * 60 * 1000,
    });
}



export const useCreateProgram = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (program: CreateProgramDto) => createProgram(program),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs'] });
            notification.success({
                message: 'Program created successfully',
                placement: 'topRight',
            });
        },
        onError: (error: any) => {
            console.error('Program creation error:', error);
            notification.error({
                message: 'Failed to create program',
                description: error?.response?.data?.message || error?.message || 'Please try again.',
                placement: 'topRight',
            });
        },
    });
};

export const useCreateProgramSession = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (session: CreateSessionDto) => createProgramSession(session),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            notification.success({
                message: 'Session created successfully',
                placement: 'topRight',
            });
        },
        onError: (error: any) => {
            console.error('Program creation error:', error);
            notification.error({
                message: 'Failed to create session',
                description: error?.response?.data?.message || error?.message || 'Please try again.',
                placement: 'topRight',
            });
        },
    });
}

export const useCreateBulkProgramSessions = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (sessions: CreateSessionDto[]) => creatBulkProgramSession(sessions),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            notification.success({
                message: 'Sessions created successfully',
                placement: 'topRight',
            });
        },
        onError: (error: any) => {
            console.error('Program creation error:', error);
            notification.error({
                message: 'Failed to create sessions',
                description: error?.response?.data?.message || error?.message || 'Please try again.',
                placement: 'topRight',
            });
        },
    });
}

export const useUpcomingPrograms = () => {
    return useQuery({
        queryKey: ["upcoming-programs"],
        queryFn: getUpcomingPrograms,
        staleTime: 1000 * 60,
    });
};

export const useAllSessions = () => {
    return useQuery({
        queryKey: ["all-sessions"],
        queryFn: getAllSessions,
        staleTime: 5 * 60 * 1000,
    });
}