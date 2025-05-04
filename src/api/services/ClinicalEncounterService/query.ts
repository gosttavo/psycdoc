import { useQuery } from "@tanstack/react-query";
import EncounterService from "./service";
import { ClinicalEncounter } from "../../../interfaces/ClinicalEncounter";

export const useGetEncountersQuery = (searchText?: string) => {
    return useQuery<ClinicalEncounter[], Error>({
        queryKey: ['getEncounters', searchText],
        queryFn: () => EncounterService.get(searchText)
    });
};