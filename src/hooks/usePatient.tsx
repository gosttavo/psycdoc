import { useCreatePatientMutation, useDeletePatientMutation, useUpdatePatientMutation } from "../api/services/PatientService/mutation";
import { useGetPatientsQuery } from "../api/services/PatientService/query";


export const useGetPatients = (searchText?: string) => useGetPatientsQuery(searchText);
export const useCreatePatient = () => useCreatePatientMutation();
export const useUpdatePatient = () => useUpdatePatientMutation();
export const useDeletePatient = () => useDeletePatientMutation();