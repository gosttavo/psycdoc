import { useMutation } from '@tanstack/react-query';
import AuthService from './service';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => { return data; },
    onError: (error: Error) => { return error; },
  });
};