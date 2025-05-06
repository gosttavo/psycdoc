export const TenantEndpoints = {
    get: () => "/tenant/search.php",
    put: (id: number) => `/tenant/update_tenant.php/${id}`,
}