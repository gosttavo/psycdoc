import { useMutation } from "@tanstack/react-query"
import GeminiService from "./service"
import { IGemini } from "../../../interfaces/Gemini";

export const useCreateGeminiMutation = () => {
    return useMutation({
        mutationFn: (gemini: IGemini) => GeminiService.post(gemini),
        onMutate: () => {},
        onSuccess: (data) => { return data; },
        onError: (error) => { return error; }
    });
};