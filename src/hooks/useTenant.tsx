import { useUpdateTenantMutation } from "../api/services/TenantService/mutation";
import { useGetTenantQuery } from "../api/services/TenantService/query";


export const useGetTenants = (searchText?: string) => useGetTenantQuery(searchText);
export const useUpdateTenant = () => useUpdateTenantMutation();
