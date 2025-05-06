import { useQuery } from "@tanstack/react-query";
import PatientService from "./service";
import { Patient } from "../../../interfaces/Patient";

export const useGetPatientsQuery = (searchText?: string) => {
    return useQuery<Patient[], Error>({
        queryKey: ['getPatients', searchText],
        queryFn: () => PatientService.get(searchText)
    });
};