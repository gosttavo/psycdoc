import { useCreateGeminiMutation, useCreateReportEncounterMutation } from "../api/services/GeminiService/mutation";

export const useCreateGemini = () => useCreateGeminiMutation();
export const useCreateReportEncounter = () => useCreateReportEncounterMutation();