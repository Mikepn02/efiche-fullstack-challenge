import { createPatient, createPatientDto, getAllPatients, getPatientsAssignedTo } from "@/services/patients.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";


export const usePatients = () => {
    return useQuery({
        queryKey: ["patients"],
        queryFn: getAllPatients,
        staleTime: 1000 * 60,
    });
};

export const usePatientsAssignedTo = (assignedToId?: string) => {
  return useQuery({
    queryKey: ['patients', assignedToId],
    queryFn: () =>
      assignedToId ? getPatientsAssignedTo(assignedToId) : Promise.resolve([]),
    enabled: !!assignedToId, // only fetch if ID exists
    staleTime: 1000 * 60,
  });
};

export const useCreateProgram = () => {
    const queryClient = useQueryClient();


    return useMutation({
        mutationFn: (patient: createPatientDto) => createPatient(patient),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            notification.success({
                message: 'Patient created successfully',
                placement: 'topRight',
            });
        },
        onError: (error: any) => {
            console.error('Patient creation error:', error);
            notification.error({
                message: 'Failed to create patient',
                description: error?.response?.data?.message || error?.message || 'Please try again.',
                placement: 'topRight',
            });
        },
    });
};

