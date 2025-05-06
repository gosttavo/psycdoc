import { useMutation } from "@tanstack/react-query";
import { ClinicalEncounter } from "../../../interfaces/ClinicalEncounter";
import EncounterService from "../ClinicalEncounterService/service";

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