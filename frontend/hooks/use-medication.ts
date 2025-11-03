import { AssignMedicationDto, DispenseRecordDto, getAllMedications, prescribePatient, recordDispensing } from "@/services/medication.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";




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
        },
        onError: (error: any) => {

            console.error('Prescribing Patient Failed:', error);
        },
    });
}


export const useRecordDispensing = () => {
     const queryClient = useQueryClient();
   

    return useMutation({
        mutationFn: (dispenseRecord: DispenseRecordDto) => recordDispensing(dispenseRecord),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
        },
        onError: (error: any) => {

            console.error('Recording Dispense Failed:', error);
        },
    });
}