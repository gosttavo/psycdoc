import { useQuery } from "@tanstack/react-query";
import TenantService from "./service";
import { Tenant } from "../../../interfaces/Tenant";

export const useGetTenantQuery = (searchText?: string) => {
    return useQuery<Tenant[], Error>({
        queryKey: ['getTenants', searchText],
        queryFn: () => TenantService.get(searchText)
    });
};