import { useEffect } from "react";
import { useToast } from "../contexts/ToastContext";
import { useDarkMode } from "../hooks/useDarkMode";
import TextEditor from "../components/TextEditor";
import Card from "../components/Card";
import { useOpenEncounter } from "../hooks/useClinicalEncounter";
import { useParams } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    TextField as MuiTextField,
    TextareaAutosize,
    Typography
} from "@mui/material";
import moment from "moment";
import { mapEncounterStatus, mapGender } from "../utils/utils";
import { Descendant } from 'slate';
import { useMemo } from 'react';

export default function ViewEncounter() {
    const { isDarkMode } = useDarkMode();
    const { showToast } = useToast();
    const { id: encounterId } = useParams<{ id: string }>();

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

    const { data, isLoading, isError } = useOpenEncounter(encounterId ? Number(encounterId) : 0);

    const parsedContentHtml: Descendant[] = useMemo(() => {
        const initialEditorValue: Descendant[] = [
            {
                type: 'paragraph',
                children: [{ text: '' }],
            }
        ];

        if (!data?.contentHtml) {
            return initialEditorValue;
        }

        try {
            const parsed = JSON.parse(data.contentHtml);
            if (Array.isArray(parsed)) {
                return parsed as Descendant[];
            }
        } catch (err) {
            console.error('Erro ao fazer parse do contentHtml:', err);
        }

        return initialEditorValue;
    }, [data?.contentHtml]);

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

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                   Visualizar Prontuário
                </h1>
            </div>

            <div
                className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4"
            >
                <div className="col-span-2">
                    <Card customClass="h-screen">
                        <p>Prontuário</p>
                        <TextEditor
                            disabled={true}
                            value={parsedContentHtml}
                        />
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
                            </Typography>
                        </div>

                        <div className="grid grid-cols-12 gap-4 p-1">
                            <input
                                type="hidden"
                                value={data?.userId ?? 0}
                            />
                            <input
                                type="hidden"
                                value={data?.id ?? 0}
                            />
                            <input
                                type="hidden"
                                value={data?.status ?? 0}
                            />
                            <input
                                type="hidden"
                                value={data?.patientId ?? 0}
                            />
                            <MuiTextField
                                label="Paciente"
                                disabled
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={
                                    data?.patient?.nameCalledBy ? data?.patient?.nameCalledBy :
                                    `${data?.patient?.name ?? ''} ${data?.patient?.nameSecond ?? ''}`
                                }
                                slotProps={slotProps}
                                size="small"
                                className={`col-span-12 sm:col-span-12 rounded-md`}
                            />
                            <MuiTextField
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
                            <MuiTextField
                                disabled
                                label="Data da consulta"
                                type="date"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                defaultValue={data?.encounterDate ? moment(data?.encounterDate).format('YYYY-MM-DD') : ''}
                                slotProps={slotProps}
                                size="small"
                                className={`col-span-12 sm:col-span-6 rounded-md`}
                                InputLabelProps={{ shrink: true }}
                            />
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
                            sx={{ '& .MuiAccordionSummary-expandIconWrapper': { color: isDarkMode ? '#60a5fa' : '#2563eb' }}}
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
                                <MuiTextField
                                    label="Gênero"
                                    disabled
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={mapGender(data?.patient?.gender ??0)}
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
                            sx={{ '& .MuiAccordionSummary-expandIconWrapper': {color: isDarkMode ? '#60a5fa' : '#2563eb' }}}
                        >
                            <Typography sx={{
                                color: isDarkMode ? '#f3f4f6' : '#111827',
                                fontWeight: 'bold'
                            }}>
                                Resposta do Gemini
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: 1 }}>
                            <div className="grid grid-cols-12 gap-4">
                                <TextareaAutosize
                                    value={
                                        Array.isArray(data?.gptResponse)
                                            ? data.gptResponse.join('\n')
                                            : (data?.gptResponse ?? '')
                                    }
                                    style={{
                                        ...textareaStyles,
                                        backgroundColor: isDarkMode ? '#424242' : '#f5f5f5'
                                    }}
                                    className="col-span-12 sm:col-span-12"
                                    readOnly
                                />
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}