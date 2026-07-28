import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, handleApiError } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import type { LoginInput, RegisterInput } from '@ajc/shared';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tier: 'free' | 'pro' | 'premium';
  profileImageUrl?: string;
  isEmailVerified: boolean;
  provider: string;
  createdAt: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Login mutation
export function useLogin() {
  const { setUser, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const { data } = await api.post<AuthResponse>('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    },
    onError: (error) => {
      throw handleApiError(error);
    },
  });
}

// Register mutation
export function useRegister() {
  const { setUser, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: RegisterInput) => {
      const { data } = await api.post<AuthResponse>('/auth/register', credentials);
      return data;
    },
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    },
    onError: (error) => {
      throw handleApiError(error);
    },
  });
}

// Logout mutation
export function useLogout() {
  const { logout, refreshToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout', { refreshToken });
    },
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
}

// Get current user
export function useCurrentUser() {
  const { accessToken, setUser } = useAuthStore();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; user: User }>('/auth/me');
      setUser(data.user);
      return data.user;
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Forgot password
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await api.post('/auth/forgot-password', { email });
      return data;
    },
  });
}
