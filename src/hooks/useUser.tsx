import { useCreateUserMutation, useDeleteUserMutation, useUpdateUserMutation } from "../api/services/UserService/mutation";
import { useGetUsersQuery, useOpenUserQuery } from "../api/services/UserService/query";

export const useGetUsers = (searchText?: string) => useGetUsersQuery(searchText);
export const useOpenUser = (id: number) => useOpenUserQuery(id);
export const useCreateUser = () => useCreateUserMutation();
export const useUpdateUser = () => useUpdateUserMutation();
export const useDeleteUser = () => useDeleteUserMutation();