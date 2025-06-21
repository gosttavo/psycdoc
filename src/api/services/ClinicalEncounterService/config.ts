export const EncounterEndpoints = {
    get: () => "/encounter/search.php",
    open: (id: number) => `/encounter/open_encounter.php/${id}`,
    post: () => "/encounter/register_encounter.php",
    put: (id: number) => `/encounter/update_encounter.php/${id}`,
    delete: (id: number) => `/encounter/delete_encounter.php/${id}`,
    initEncounter: (id: number) => `/encounter/init_encounter.php/${id}`,
}