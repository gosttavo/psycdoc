import { useUpdateTenantMutation } from "../api/services/TenantService/mutation";
import { useOpenTenantQuery } from "../api/services/TenantService/query";


export const useOpenTenant = (id: number) => useOpenTenantQuery(id);
export const useUpdateTenant = () => useUpdateTenantMutation();
