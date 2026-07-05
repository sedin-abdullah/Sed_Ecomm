import { useMutation } from '@tanstack/react-query';
import * as authService from '@/services/auth';
import { useAuthStore } from '@/store/authStore';

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (v: { email: string; password: string }) => authService.login(v.email, v.password),
    onSuccess: (data) => setSession(data.user, data.accessToken),
  });
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (v: { name: string; email: string; password: string }) =>
      authService.register(v.name, v.email, v.password),
    onSuccess: (data) => setSession(data.user, data.accessToken),
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: (email: string) => authService.forgotPassword(email) });
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (user) => setUser(user),
  });
}
