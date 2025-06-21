import { useDarkMode } from "../hooks/useDarkMode";
import { useForm } from "react-hook-form";
import { formAiIntegrationSchema, FormAiIntegrationSchema } from "../schemas/formEncounterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    TextareaAutosize,
    FormLabel
} from "@mui/material";
import { IAICardChat } from "../interfaces/ClinicalEncounter";
import { useCreateGemini } from "../hooks/useGemini";
import { IGemini } from "../interfaces/Gemini";
import { useState } from "react";
import { useToast } from "../contexts/ToastContext";

export default function GeminiCard({
    clinicalEncounterId,
    onClose
}: IAICardChat) {
    const { showToast } = useToast();
    const { isDarkMode } = useDarkMode();
    const [aiResponse, setAiResponse] = useState<string[]>(['']);

    const {
        reset,
        handleSubmit,
        register,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm<FormAiIntegrationSchema>({
        resolver: zodResolver(formAiIntegrationSchema)
    });

    const { mutateAsync: createGemini } = useCreateGemini();

    const onSubmitEncounter = async (data: FormAiIntegrationSchema) => {
        try {
            data.clinicalEncounterId = clinicalEncounterId;
            const result = await createGemini(data as IGemini);
            showToast('Integração com IA enviada com sucesso!', 'success');
            setAiResponse(result?.atividades as string[]);
        } catch (error) {
            showToast(`Erro: ${error}`, 'error');
        }
    };

    const textareaStyles = {
        backgroundColor: isDarkMode ? '#333' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
        borderColor: isDarkMode ? '#555' : '#ccc',
        borderRadius: '4px',
        padding: '16.5px 14px',
        fontFamily: 'inherit',
        fontSize: '1rem',
        minHeight: '100px',
        width: '100%',
        '&:focus': {
            outline: 'none',
            borderColor: isDarkMode ? '#90caf9' : '#1976d2',
            borderWidth: '2px'
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmitEncounter)}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Escreva apenas os sintomas do paciente, não forneça dados sensíveis (ex: nome)
            </p>
            <div className="grid grid-cols-12 gap-4 mt-2">
                <FormLabel htmlFor={'prompt'}>
                    Sintomas
                </FormLabel>
                <TextareaAutosize
                    {...register('prompt')}
                    style={{
                        ...textareaStyles,
                        backgroundColor: isDarkMode ? '#424242' : '#f5f5f5'
                    }}
                    className="col-span-12 sm:col-span-12"
                    placeholder="Descreva os sintomas aqui..."
                />
                {errors.prompt && <p>{errors.prompt.message}</p>}
                
                <FormLabel>
                    Resposta
                </FormLabel>
                <TextareaAutosize
                    value={aiResponse.join('\n')}
                    style={{
                        ...textareaStyles,
                        backgroundColor: isDarkMode ? '#424242' : '#f5f5f5'
                    }}
                    className="col-span-12 sm:col-span-12"
                    readOnly
                />
            </div>
            <div className="mt-4 flex justify-end gap-4">
                {   
                    aiResponse.length > 1 ? (
                        <Button
                            variant="outlined"
                            onClick={() => { onClose() }}
                        >
                            Fechar
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outlined"
                                disabled={isSubmitting}
                                onClick={() => {
                                    reset();
                                    onClose();
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Salvando...' : 'Enviar'}
                            </Button>
                        </>
                    )
                }
            </div>
        </form>
    )
}