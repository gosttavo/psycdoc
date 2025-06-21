import { useQuery } from "@tanstack/react-query";
import EncounterService from "./service";
import { ClinicalEncounter } from "../../../interfaces/ClinicalEncounter";

export const useGetEncountersQuery = (
    { searchText, patientId }: { searchText?: string; patientId?: number },
    options?: { enabled?: boolean }
) => {
    return useQuery<ClinicalEncounter[], Error>({
        queryKey: ['getEncounters', searchText, patientId],
        queryFn: () => EncounterService.get({ searchText, patientId }),
        enabled: options?.enabled ?? true
    });
};

export const useOpenEncounterQuery = (id: number) => {
    return useQuery<ClinicalEncounter, Error>({
        queryKey: ['openEncounter', id],
        queryFn: () => EncounterService.open(id)
    });
};