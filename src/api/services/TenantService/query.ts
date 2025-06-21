import { useQuery } from "@tanstack/react-query";
import TenantService from "./service";
import { Tenant } from "../../../interfaces/Tenant";

export const useOpenTenantQuery = (id: number) => {
    return useQuery<Tenant, Error>({
        queryKey: ['openTenant', id],
        queryFn: () => TenantService.open(id)
    });
};