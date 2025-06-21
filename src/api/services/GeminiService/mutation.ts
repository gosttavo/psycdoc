import { useMutation } from "@tanstack/react-query"
import GeminiService from "./service"
import { IGemini, IReportEncounter } from "../../../interfaces/Gemini";

export const useCreateGeminiMutation = () => {
    return useMutation({
        mutationFn: (gemini: IGemini) => GeminiService.post(gemini),
        onMutate: () => {},
        onSuccess: (data) => { return data; },
        onError: (error) => { return error; }
    });
};

export const useCreateReportEncounterMutation = () => {
    return useMutation({
        mutationFn: (data: IReportEncounter) => GeminiService.report(data),
        onMutate: () => {},
        onSuccess: (data) => { return data; },
        onError: (error) => { return error; }
    });
};