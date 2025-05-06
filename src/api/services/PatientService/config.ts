export const PatientEndpoints = {
    get: () => "/patient/search.php",
    post: () => "/patient/register_patient.php",
    put: (id: number) => `/patient/update_patient.php/${id}`,
    delete: (id: number) => `/patient/delete_patient.php/${id}`,
}