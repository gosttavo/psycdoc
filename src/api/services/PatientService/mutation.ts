import { useMutation } from "@tanstack/react-query";
import { Patient } from "../../../interfaces/Patient";
import PatientService from "../PatientService/service";

export const useCreatePatientMutation = () => {
  return useMutation({
    mutationFn: (patient: Patient) => PatientService.post(patient),
      onSuccess: (data) => { return data; },
      onError: (error) => { return error; }
  });
};

export const useUpdatePatientMutation = () => {
  return useMutation({
    mutationFn: ({ id, patient }: { id: number; patient: Patient }) => PatientService.put(id, patient),
      onSuccess: (data) => { return data; },
      onError: (error) => { return error; }
  });
};

export const useDeletePatientMutation = () => {
  return useMutation({
    mutationFn: (id: number) => PatientService.delete(id),
      onSuccess: (data) => { return data; },
      onError: (error) => { return error; }
  });
};