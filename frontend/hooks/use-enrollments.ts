import { enrollPatient, EnrollPatientDto, getAllEnrollments } from "@/services/enrollment.service";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { notification } from "antd";
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
            notification.success({
                message: 'Patient enrolled successfully',
                placement: 'topRight',
            });
        },
        onError: (error: any) => {
            console.error("Failed to enroll patient: ", error);
            notification.error({
                message: 'Failed to enroll patient',
                description: error?.response?.data?.message || error?.message || 'Please try again.',
                placement: 'topRight',
            });
        }
    })
}