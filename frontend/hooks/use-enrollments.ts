import { enrollPatient, EnrollPatientDto, getAllEnrollments } from "@/services/enrollment.service";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { useUserStore } from "@/store/user-store";

export const useEnrollments = () => {
    const { user } = useUserStore();
    return useQuery({
        queryKey: ["enrollments", user?.id],
        queryFn: () => getAllEnrollments(user?.id || ''),
        enabled: !!user?.id,
        staleTime: 1000 * 60,
    });
};

export const useEnrollPatient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (enroll: EnrollPatientDto) => enrollPatient(enroll),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enrollments']});
        },
        onError: (error: any) => {
            console.error("Failed to enroll patient: ", error);
        }
    })
}