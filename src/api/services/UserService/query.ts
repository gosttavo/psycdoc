import { useQuery } from "@tanstack/react-query";
import UserService from "./service";
import { User } from "../../../interfaces/User";

export const useGetUsersQuery = (searchText?: string) => {
    return useQuery<User[], Error>({
        queryKey: ['getUsers', searchText],
        queryFn: () => UserService.get(searchText)
    });
};

export const useOpenUserQuery = (id: number) => {
    return useQuery<User, Error>({
        queryKey: ['openUser', id],
        queryFn: () => UserService.open(id)
    });
};