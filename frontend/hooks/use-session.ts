import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getSessionAttendances, recordSessionAttendance, SessionAttendanceDto } from "@/services/session.service"
import { notification } from "antd";




export const useSessionAttendances = () => {
    return useQuery({
        queryKey: ["sessions"],
        queryFn: getSessionAttendances,
        staleTime: 1000 * 60,
    })
}


export const useRecordPatientSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (attendance: SessionAttendanceDto) => recordSessionAttendance(attendance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs'] });
            notification.success({
                message: 'Attendance recorded successfully',
                placement: 'topRight',
            });
        },
        onError: (error: any) => {
            console.error("Record Attendance Failed: ", error?.message)
            notification.error({
                message: 'Failed to record attendance',
                description: error?.response?.data?.message || error?.message || 'Please try again.',
                placement: 'topRight',
            });
        }
    })
}