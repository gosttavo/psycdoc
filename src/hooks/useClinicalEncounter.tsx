import { useCreateEncounterMutation, useDeleteEncounterMutation, useUpdateEncounterMutation } from "../api/services/ClinicalEncounterService/mutation";
import { useGetEncountersQuery } from "../api/services/ClinicalEncounterService/query";

export const useGetEncounters = (searchText?: string) => useGetEncountersQuery(searchText);
export const useCreateEncounter = () => useCreateEncounterMutation();
export const useUpdateEncounter = () => useUpdateEncounterMutation();
export const useDeleteEncounter = () => useDeleteEncounterMutation();