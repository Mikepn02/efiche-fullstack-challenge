"use client"
import { getAllUsers, login, registerUser } from '@/services/auth.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notification } from 'antd';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user-store';

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { setUser, setToken } = useUserStore();

    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            login(email, password),
        onSuccess: (data) => {
            document.cookie = `token=${data.token}; path=/; max-age=86400`;
            document.cookie = `role=${data.role}; path=/; max-age=86400`;
            
            // Set user in Zustand store
            setUser(data.user);
            setToken(data.token);
            
            queryClient.invalidateQueries({ queryKey: ['user'] });
            notification.success({
                message: "Login Successful",
                placement: "topRight",
            });
            const role = data.user.role;
            if (role === 'ADMIN') {
                router.push('/admin');
            } else if(role === "STAFF") {
                router.push('/staff');
            } else{
                router.push('/guests')
            }
        },
        onError: (error: any) => {
            console.error('Login error', error.response?.data?.message || error.message);
        },
    });
};


export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ name, email, password }: { name: string, email: string; password: string }) =>
            registerUser(name, email, password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"]});
            notification.success({
                message: "User created Successfully!",
                placement: "topRight",
            });
        },
        onError: (error: any) => {
            console.error('Login error', error.response?.data?.message || error.message);
        },
    });
}


export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { clearUser } = useUserStore();

    return useMutation({
        mutationFn: () => {
            // Clear cookies immediately
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            
            // Clear user from Zustand store immediately
            clearUser();
            
            // Clear queries without waiting
            queryClient.clear();
            
            // Navigate immediately
            router.push("/auth/sign-in");
            
            // Show notification after navigation starts
            setTimeout(() => {
                notification.success({
                    message: "Logout Successful",
                    placement: "topRight",
                });
            }, 100);
            
            return Promise.resolve();
        },
        onError: (error: any) => {
            console.error("Logout error:", error?.response?.data?.message || error?.message);
            // Still clear and redirect on error
            clearUser();
            queryClient.clear();
            router.push("/auth/sign-in");
        },
    });
};


export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: getAllUsers,
        staleTime: 1000 * 60,
    });
};