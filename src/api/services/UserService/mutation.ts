import { useMutation } from "@tanstack/react-query";
import { User } from "../../../interfaces/User";
import UserService from "../UserService/service";

export const useCreateUserMutation = () => {
    return useMutation({
    mutationFn: (user: User) => UserService.post(user),
      onSuccess: (data) => { return data; },
      onError: (error) => { return error; }
    });
  };

  export const useUpdateUserMutation = () => {
    return useMutation({
      mutationFn: ({ id, user }: { id: number; user: User }) => UserService.put(id, user),
        onSuccess: (data) => { return data; },
        onError: (error) => { return error; }
    });
  };

  export const useDeleteUserMutation = () => {
    return useMutation({
      mutationFn: (id: number) => UserService.delete(id),
        onSuccess: (data) => { return data; },
        onError: (error) => { return error; }
    });
};