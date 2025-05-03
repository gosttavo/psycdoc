import { useLoginMutation, userGetLoggedUserMutation } from "../api/services/AuthService/mutation";

export const useLogin = () => useLoginMutation();
export const useGetLoggedUser = () => userGetLoggedUserMutation();