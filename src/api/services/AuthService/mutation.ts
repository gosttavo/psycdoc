import { useMutation } from '@tanstack/react-query';
import AuthService from './service';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      console.log('Login bem-sucedido', data);
    },
    onError: (error: any) => {
      console.error('Erro no login:', error.response?.data?.error || error.message);
    },
  });
};

export const userGetLoggedUserMutation = () => {
  return useMutation({
    mutationFn: AuthService.getUser,
    onSuccess: (data) => {
      console.log('Usuário:', data);
    },
    onError: (error: any) => {
      console.error('Erro ao recuperar usuário:', error.response?.data?.error || error.message);
    },
  });
};