import { useQuery } from "@tanstack/react-query";
import UserService from "./service";
import { User } from "../../../interfaces/User";

export const useGetUsersQuery = (searchText?: string) => {
    return useQuery<User[], Error>({
        queryKey: ['getUsers', searchText],
        queryFn: () => UserService.get(searchText)
    });
};