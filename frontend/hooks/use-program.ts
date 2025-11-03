import { createProgram, creatBulkProgramSession, createProgramSession, getAllPrograms, getProgramSessions, getUpcomingPrograms, getAllSessions } from "@/services/program.service";
import { CreateProgramDto, CreateSessionDto } from "@/types";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { App } from "antd";

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
        },
        onError: (error: any) => {

            console.error('Program creation error:', error);
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
        },
        onError: (error: any) => {
           
            console.error('Program creation error:', error);
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
        },
        onError: (error: any) => {

            console.error('Program creation error:', error);
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