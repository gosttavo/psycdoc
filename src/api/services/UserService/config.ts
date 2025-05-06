export const UserEndpoints = {
    get: () => "/user/search.php",
    post: () => "/user/register_user.php",
    put: (id: number) => `/user/update_user.php/${id}`,
    delete: (id: number) => `/user/delete_user.php/${id}`,
}