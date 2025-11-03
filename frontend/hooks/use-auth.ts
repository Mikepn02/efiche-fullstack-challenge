"use client";
import { getAllUsers, login, registerUser, logout } from '@/services/auth.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notification } from 'antd';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user-store';
import { setToken, clearToken, setRefreshToken } from '@/lib/token';

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const data = await login(email, password);
      return data;
    },
onSuccess: async (data) => {
  const accessToken = data?.accessToken;
  const refreshToken = data?.refreshToken;
  const user = data?.user;

  if (!accessToken || !user) {
    notification.error({
      message: 'Login failed',
      description: 'No token or user data received.',
    });
    return;
  }

  await setToken(accessToken, true);
  if (refreshToken) await setRefreshToken(refreshToken, true);

  setUser(user);


  await queryClient.invalidateQueries({ queryKey: ['user'] });

  notification.success({
    message: 'Login Successful',
    placement: 'topRight',
  });


  setTimeout(() => {
    const path =
      user.role === 'ADMIN'
        ? '/admin'
        : user.role === 'STAFF'
        ? '/staff'
        : '/guests';
    router.replace(path);
  }, 300);
},

    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message;
      console.error('Login error:', msg);
      notification.error({
        message: 'Login Failed',
        description: msg || 'Please try again.',
        placement: 'topRight',
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
            await logout();
        },
        onError: (error: any) => {
            console.error("Logout error:", error?.response?.data?.message || error?.message);
            // proceed to local cleanup even if server failed
            clearUser();
            clearToken();
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
            clearToken();
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