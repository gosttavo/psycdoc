import { useMutation } from "@tanstack/react-query";
import { ClinicalEncounter } from "../../../interfaces/ClinicalEncounter";
import EncounterService from "../ClinicalEncounterService/service";
import { IReportEncounter } from "../../../interfaces/Gemini";

export const useCreateEncounterMutation = () => {
  return useMutation({
    mutationFn: (clinicalEncounter: ClinicalEncounter) => EncounterService.post(clinicalEncounter),
    onSuccess: (data) => { return data; },
    onError: (error) => { return error; }
  });
};

export const useUpdateEncounterMutation = () => {
  return useMutation({
    mutationFn: ({ id, clinicalEncounter }: { id: number; clinicalEncounter: ClinicalEncounter }) => EncounterService.put(id, clinicalEncounter),
    onSuccess: (data) => { return data; },
    onError: (error) => { return error; }
  });
};

export const useDeleteEncounterMutation = () => {
  return useMutation({
    mutationFn: (id: number) => EncounterService.delete(id),
    onSuccess: (data) => { return data; },
    onError: (error) => { return error; }
  });
};

export const useInitEncounterMutation = () => {
  return useMutation({
    mutationFn: ({ id, tenantId }: { id: number; tenantId: number }) => EncounterService.initEncounter(id, tenantId),
    onSuccess: (data) => { return data; },
    onError: (error) => { return error; }
  });
};

export const useCreateReportEncounterMutation = () => {
    return useMutation({
        mutationFn: (data: IReportEncounter) => EncounterService.report(data),
        onMutate: () => {},
        onSuccess: (data) => { return data; },
        onError: (error) => { return error; }
    });
};