export const TenantEndpoints = {
    open: (id: number) => `/tenant/open_tenant.php/${id}`,
    put: (id: number) => `/tenant/update_tenant.php/${id}`,
}