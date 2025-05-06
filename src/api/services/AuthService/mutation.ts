import { useMutation } from '@tanstack/react-query';
import AuthService from './service';
import { AuthLoginBody } from '../../../interfaces/Auth';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: AuthLoginBody) => AuthService.login(data),
    onSuccess: (data) => { return data; },
    onError: (error: Error) => { return error; },
  });
};