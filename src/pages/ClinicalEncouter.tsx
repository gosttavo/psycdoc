import { useEffect, useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { useDarkMode } from "../hooks/useDarkMode";
import TextEditor from "../components/TextEditor";
import Card from "../components/Card";
import { formClinicalEncounterSchema, FormClinicalEncounterSchema } from "../schemas/formEncounterSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOpenEncounter, useUpdateEncounter } from "../hooks/useClinicalEncounter";
import { useParams } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,    
    Button,
    TextField as MuiTextField,
    Typography
} from "@mui/material";
import ModalWrapper from "../components/Modal";
import { Descendant, Text } from 'slate';
import moment from "moment";
import GeminiChat from "../components/GeminiChat";
import { ClinicalEncounter } from "../interfaces/ClinicalEncounter";
import { mapEncounterStatus } from "../utils/utils";

const getPlainText = (value: Descendant[]): string => {
  return value.map(n => {
        if (Text.isText(n)) {
            return n.text
        };
        if (n.children) {
            return getPlainText(n.children)
        };
    return '';
  }).join('\n');
};

export default function ClinicalEncounterPage() {
    const { isDarkMode } = useDarkMode();
    const { showToast } = useToast();
    const { id: encounterId } = useParams<{ id: string }>();

    const [openFinishEncounterModal, setOpenFinishEncounterModal] = useState(false);
    const [openAiChatModal, setOpenAiChatModal] = useState(false);

    const [clinicalEncounterData, setClinicalEncounterData] = useState<ClinicalEncounter | null>(null);

    const slotProps = {
        input: {
            style: {
                color: isDarkMode ? '#fff' : '#000',
            }
        },
        root: {
            sx: {
                '& .MuiInputLabel-root': {
                    color: isDarkMode ? '#ccc' : '#666',
                    '&.MuiInputLabel-shrink': {
                        transform: 'translate(14px, -9px) scale(0.75)'
                    },
                    '&.Mui-focused, &.MuiFormLabel-filled': {
                        transform: 'translate(14px, -9px) scale(0.75)'
                    }
                },
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#555' : '#ccc',
                },
                '& .MuiInputLabel-root.Mui-disabled': {
                    color: isDarkMode ? '#ccc' : '#666',
                    transform: 'translate(14px, -9px) scale(0.75)'
                }
            }
        },
        textField: {
            InputLabelProps: {
                shrink: true
            }
        }
    };

    const cardStyles = {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#f3f4f6' : '#111827',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        borderWidth: '1px',
        borderStyle: 'solid'
    };

    useEffect(() => {
        showToast(
            'Consulta iniciada!',
            'success'
        );
    }, [showToast]);

    const { data, isLoading, isError } = useOpenEncounter(encounterId ? Number(encounterId) : 0);
    const { mutate: updateEncounter } = useUpdateEncounter();

    useEffect(() => {
        if (isLoading) {
            showToast(
                'Carregando dados da consulta...',
                'info'
            );
        } else if (isError) {
            showToast(
                `Erro: ${isError}`,
                'error'
            );
        }
    }, [isLoading, isError, showToast]);

    const {
        handleSubmit: clinicalEncounterSubmit,
        register: clinicalEncounterRegister,
        control: clinicalEncounterControl,
        setValue: clinicalEncounterSetValue,
        formState: { errors: clinicalEncounterErrors }
    } = useForm<FormClinicalEncounterSchema>({
        resolver: zodResolver(formClinicalEncounterSchema)
    });

    const onSubmitEncounter = (submitEncounter: FormClinicalEncounterSchema) => {
        if (!data) {
            showToast(
                'Dados da consulta não encontrados',
                'error'
            );
            return;
        }

        const clinicalEncounter: ClinicalEncounter = {
            tenantId: data?.tenantId,
            userId: data.userId,
            patientId: data.patientId,
            status: data.status,
            encounterDate: data.encounterDate,
            paid: 0,
            contentHtml: submitEncounter.contentHtml,
            contentText: submitEncounter.contentText,
        }
        setOpenFinishEncounterModal(true);
        setClinicalEncounterData(clinicalEncounter);
    };

    const onSubmitFinishEncounter = () => {
        try {
            if (!data || !clinicalEncounterData) {
                showToast(
                    'Dados da consulta não encontrados',
                    'error'
                );
                return;
            }

            const clinicalEncounter: ClinicalEncounter = {
                tenantId: clinicalEncounterData?.tenantId,
                userId: clinicalEncounterData.userId,
                patientId: clinicalEncounterData.patientId,
                status: 2,
                encounterDate: clinicalEncounterData.encounterDate,
                paid: 0,
                contentHtml: clinicalEncounterData.contentHtml,
                contentText: clinicalEncounterData.contentText,
            };

            updateEncounter(
                {
                    id: clinicalEncounter?.id ?? data?.id ?? 0,
                    clinicalEncounter
                },
                {
                    onSuccess: () => {
                        showToast(
                            'Consulta finalizada com sucesso!',
                            'success'
                        );

                        setOpenFinishEncounterModal(false);
                        setOpenAiChatModal(true);
                    },
                    onError: (error) => {
                        showToast(
                            `Erro: ${error.message}`, 
                            'error'
                        );
                    }
                }
            );
        } catch (error: Error | unknown) {
            showToast(
                `Erro: ${error}`, 
                'error'
            );
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Consulta
                </h1>
            </div>

            <form
                className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4"
                onSubmit={clinicalEncounterSubmit(onSubmitEncounter)}
            >
                <div className="col-span-2">
                    <Card customClass="h-screen">
                        <p>Prontuário</p>
                        <input
                            type="hidden"
                            {...clinicalEncounterRegister('tenantId', { valueAsNumber: true })}
                            defaultValue={1}
                        />
                        {clinicalEncounterErrors.tenantId && <p>{clinicalEncounterErrors.tenantId.message}</p>}
                        <Controller
                            name="contentHtml"
                            control={clinicalEncounterControl}
                            defaultValue={data?.contentHtml}
                            render={({ field }) => (
                                <TextEditor
                                    value={field?.value}
                                    onChange={(richContent) => {
                                        clinicalEncounterSetValue('contentHtml', JSON.stringify(richContent));
                                        clinicalEncounterSetValue('contentText', getPlainText(richContent));
                                    }}
                                />
                            )}
                        />
                        {clinicalEncounterErrors.contentHtml && <p>{clinicalEncounterErrors.contentHtml.message}</p>}
                    </Card>
                </div>
                <div className="col-span-1">
                    <Card>
                        <div>
                            <Typography sx={{
                                color: isDarkMode ? '#f3f4f6' : '#111827',
                                fontWeight: 'bold',
                                padding: 1,
                                justifyContent: 'space-between',
                                display: 'flex',
                            }}>
                                <span>
                                    Dados da consulta
                                </span>

                                {/* <span>
                                    00:35:00
                                </span> */}
                            </Typography>
                        </div>

                        <div className="grid grid-cols-12 gap-4 p-1">
                            <input
                                type="hidden"
                                {...clinicalEncounterRegister('userId', { valueAsNumber: true })}
                                value={data?.userId ?? 0}
                            />
                            {clinicalEncounterErrors.userId && <p>{clinicalEncounterErrors.userId.message}</p>}
                            <input
                                type="hidden"
                                {...clinicalEncounterRegister('id', { valueAsNumber: true })}
                                value={data?.id ?? 0}
                            />
                            {clinicalEncounterErrors.id && <p>{clinicalEncounterErrors.id.message}</p>}
                            <MuiTextField
                                {...clinicalEncounterRegister('status', { valueAsNumber: true })}
                                label="Status"
                                disabled
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={mapEncounterStatus(data?.status ?? 0)}
                                slotProps={slotProps}
                                size="small"
                                className={`col-span-12 sm:col-span-6 rounded-md`}
                            />
                            {clinicalEncounterErrors.status && <p>{clinicalEncounterErrors.status.message}</p>}
                            <MuiTextField
                                disabled
                                label="Data da consulta"
                                type="date"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                {...clinicalEncounterRegister('encounterDate')}
                                defaultValue={data?.encounterDate ? moment(data?.encounterDate).format('YYYY-MM-DD') : ''}
                                slotProps={slotProps}
                                size="small"
                                className={`col-span-12 sm:col-span-6 rounded-md`}
                            />
                            {clinicalEncounterErrors.encounterDate && <p>{clinicalEncounterErrors.encounterDate.message}</p>}
                            <Button
                                className="col-span-12"
                                variant="contained"
                                type="submit"
                            >
                                Finalizar consulta
                            </Button>
                        </div>
                    </Card>

                    <Accordion
                        sx={{ 
                            ...cardStyles,
                            '&.MuiAccordion-root': {
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                                borderRadius: '1rem',
                                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                                overflow: 'hidden',
                                marginBottom: '1.5rem',
                                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                            },
                            '&.MuiAccordion-root:before': {
                                display: 'none'
                            }
                        }}
                    >
                        <AccordionSummary
                            expandIcon={
                                <PlusCircleIcon 
                                    className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} 
                                />
                            }
                            aria-controls="panel1-content"
                            id="panel1-header"
                            sx={{
                                '& .MuiAccordionSummary-expandIconWrapper': {
                                    color: isDarkMode ? '#60a5fa' : '#2563eb'
                                }
                            }}
                        >
                            <Typography sx={{
                                color: isDarkMode ? '#f3f4f6' : '#111827',
                                fontWeight: 'bold'
                            }}>
                                Dados do paciente
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: 1 }}>
                            <div className="grid grid-cols-12 gap-4">
                                <input
                                    type="hidden"
                                    {...clinicalEncounterRegister('patientId', { valueAsNumber: true })}
                                    value={data?.patientId ?? 0}
                                />
                                {clinicalEncounterErrors.patientId && <p>{clinicalEncounterErrors.patientId.message}</p>}
                                <MuiTextField
                                    label="Paciente"
                                    disabled
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={
                                        data?.patient?.nameCalledBy ??
                                        `${data?.patient?.name ?? ''} ${data?.patient?.nameSecond ?? ''}`
                                    }
                                    slotProps={slotProps}
                                    size="small"
                                    className={`col-span-12 sm:col-span-12 rounded-md`}
                                />
                                <MuiTextField
                                    label="Gênero"
                                    disabled
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={data?.patient?.gender}
                                    slotProps={slotProps}
                                    size="small"
                                    className={`col-span-12 sm:col-span-6 rounded-md`}
                                />
                                <MuiTextField
                                    label="CPF"
                                    disabled
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={data?.patient?.document}
                                    slotProps={slotProps}
                                    size="small"
                                    className={`col-span-12 sm:col-span-6 rounded-md`}
                                />
                                <MuiTextField
                                    label="E-mail"
                                    disabled
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={data?.patient?.email}
                                    slotProps={slotProps}
                                    size="small"
                                    className={`col-span-12 sm:col-span-6 rounded-md`}
                                />
                                <MuiTextField
                                    label="Telefone"
                                    disabled
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={data?.patient?.phone}
                                    slotProps={slotProps}
                                    size="small"
                                    className={`col-span-12 sm:col-span-6 rounded-md`}
                                />
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </form>

            
            {/* Modal de Finalizar Consulta */}
            <ModalWrapper
                open={openFinishEncounterModal}
                onClose={() => setOpenFinishEncounterModal(false)}
                title={`Deseja finalizar a consulta de ${data?.patient?.name}?`}
            >
                <Typography sx={{ mt: 2 }}>Você não poderá desfazer essa ação.</Typography>
                <div className="mt-4 flex justify-end gap-4">
                    <Button
                        variant="outlined"
                        type="reset"
                        onClick={() => { setOpenFinishEncounterModal(false) }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => { onSubmitFinishEncounter() }}
                    >
                        Finalizar
                    </Button>
                </div>
            </ModalWrapper>

            {/* Modal de AI */}
            <ModalWrapper
                title="Fale com o gemini"
                open={openAiChatModal}
                onClose={() => setOpenAiChatModal(false)}
            >
                <GeminiChat
                    onClose={() => setOpenAiChatModal(false)}
                />
            </ModalWrapper>
        </div>
    );
}