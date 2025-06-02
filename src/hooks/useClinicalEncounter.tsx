import {
    useCreateEncounterMutation,
    useDeleteEncounterMutation,
    useUpdateEncounterMutation
} from "../api/services/ClinicalEncounterService/mutation";
import {
    useGetEncountersQuery,
    useOpenEncounterQuery
} from "../api/services/ClinicalEncounterService/query";

export const useGetEncounters = (searchText?: string) => useGetEncountersQuery(searchText);
export const useOpenEncounter = (id: number) => useOpenEncounterQuery(id);
export const useCreateEncounter = () => useCreateEncounterMutation();
export const useUpdateEncounter = () => useUpdateEncounterMutation();
export const useDeleteEncounter = () => useDeleteEncounterMutation();