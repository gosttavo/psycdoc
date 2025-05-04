import { useGetEncountersQuery } from "../api/services/ClinicalEncounterService/query";

export const useGetEncounters = (searchText?: string) => useGetEncountersQuery(searchText);