"use client"
import { getAllUsers, login, registerUser, logout } from '@/services/auth.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notification } from 'antd';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user-store';

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { setUser } = useUserStore();

    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            login(email, password),
        onSuccess: (data) => {
         
            setUser(data.user);            
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
            notification.error({
                message: "Login failed",
                description: error?.response?.data?.message || error?.message || 'Please try again.',
                placement: "topRight",
            });
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
            notification.error({
                message: "Failed to create user",
                description: error?.response?.data?.message || error?.message || 'Please try again.',
                placement: "topRight",
            });
        },
    });
}


export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { clearUser } = useUserStore();

    return useMutation({
        mutationFn: async () => {
            await logout(); // backend clears HttpOnly cookie
        },
        onError: (error: any) => {
            console.error("Logout error:", error?.response?.data?.message || error?.message);
            // proceed to local cleanup even if server failed
            clearUser();
            queryClient.clear();
            router.push("/auth/sign-in");
            notification.error({
                message: "Logout failed on server",
                description: error?.response?.data?.message || error?.message,
                placement: "topRight",
            });
        },
        onSuccess: () => {
            clearUser();
            queryClient.clear();
            router.push("/auth/sign-in");
            notification.success({
                message: "Logout Successful",
                placement: "topRight",
            });
        }
    });
};


export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: getAllUsers,
        staleTime: 1000 * 60,
    });
};