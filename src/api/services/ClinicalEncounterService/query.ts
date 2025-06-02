import { useQuery } from "@tanstack/react-query";
import EncounterService from "./service";
import { ClinicalEncounter } from "../../../interfaces/ClinicalEncounter";

export const useGetEncountersQuery = (searchText?: string) => {
    return useQuery<ClinicalEncounter[], Error>({
        queryKey: ['getEncounters', searchText],
        queryFn: () => EncounterService.get(searchText)
    });
};

export const useOpenEncounterQuery = (id: number) => {
    return useQuery<ClinicalEncounter, Error>({
        queryKey: ['openEncounter', id],
        queryFn: () => EncounterService.open(id)
    });
};