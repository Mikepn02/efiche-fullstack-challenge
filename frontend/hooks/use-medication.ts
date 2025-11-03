import { AssignMedicationDto, DispenseRecordDto, getAllMedications, prescribePatient, recordDispensing } from "@/services/medication.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";




export const useMedications = () => {
    return useQuery({
        queryKey: ["medications"],
        queryFn: getAllMedications,
        staleTime: 1000 * 60,
    });
};



export const usePrescribePatient = () => {
    const queryClient = useQueryClient();
   

    return useMutation({
        mutationFn: (prescription:AssignMedicationDto ) => prescribePatient(prescription),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
            notification.success({
                message: 'Medication prescribed successfully',
                placement: 'topRight',
            });
        },
        onError: (error: any) => {
            console.error('Prescribing Patient Failed:', error);
            notification.error({
                message: 'Failed to prescribe medication',
                description: error?.response?.data?.message || error?.message || 'Please try again.',
                placement: 'topRight',
            });
        },
    });
}


export const useRecordDispensing = () => {
     const queryClient = useQueryClient();
   

    return useMutation({
        mutationFn: (dispenseRecord: DispenseRecordDto) => recordDispensing(dispenseRecord),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
            notification.success({
                message: 'Medication dispensed successfully',
                placement: 'topRight',
            });
        },
        onError: (error: any) => {
            console.error('Recording Dispense Failed:', error);
            notification.error({
                message: 'Failed to record dispensation',
                description: error?.response?.data?.message || error?.message || 'Please try again.',
                placement: 'topRight',
            });
        },
    });
}