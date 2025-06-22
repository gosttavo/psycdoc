import {
    useCreateEncounterMutation,
    useCreateReportEncounterMutation,
    useDeleteEncounterMutation,
    useInitEncounterMutation,
    useUpdateEncounterMutation
} from "../api/services/ClinicalEncounterService/mutation";
import {
    useGetEncountersQuery,
    useOpenEncounterQuery
} from "../api/services/ClinicalEncounterService/query";

export const useGetEncounters = (
    params: { searchText?: string; patientId?: number },
    options?: { enabled?: boolean }
) => useGetEncountersQuery(params, options);
export const useOpenEncounter = (id: number) => useOpenEncounterQuery(id);
export const useCreateEncounter = () => useCreateEncounterMutation();
export const useUpdateEncounter = () => useUpdateEncounterMutation();
export const useDeleteEncounter = () => useDeleteEncounterMutation();
export const useInitEncounter = () => useInitEncounterMutation();
export const useCreateReportEncounter = () => useCreateReportEncounterMutation();