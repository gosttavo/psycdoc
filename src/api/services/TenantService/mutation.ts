import { useMutation } from "@tanstack/react-query";
import { Tenant } from "../../../interfaces/Tenant";
import TenantService from "../TenantService/service";

export const useUpdateTenantMutation = () => {
    return useMutation({
        mutationFn: ({ id, tenant }: { id: number; tenant: Tenant }) => TenantService.put(id, tenant),
            onSuccess: (data) => { return data; },
            onError: (error) => { return error; }
    });
};