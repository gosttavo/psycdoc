import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import moment from "moment";
import { useDarkMode } from "../hooks/useDarkMode";
import {
    Button,
    CircularProgress,
    ClickAwayListener,
    Grow,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TextField as MuiTextField,
    Select,
    Box,
    FormControl,
    InputLabel
} from "@mui/material";
import {
    EllipsisVerticalIcon,
    ChevronDoubleRightIcon,
    PencilIcon,
    PlusIcon,
    XMarkIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { Controller, useForm } from "react-hook-form";
import { formClinicalEncounterSchema, FormClinicalEncounterSchema, formDeleteEncounterSchema, FormDeleteEncounterSchema, formInitEncounterSchema, FormInitEncounterSchema } from "../schemas/formEncounterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClinicalEncounter } from "../interfaces/ClinicalEncounter";
import FormSearch from "../components/FormSearch";
import ModalWrapper from "../components/Modal";
import { 
    useCreateEncounter, 
    useDeleteEncounter, 
    useGetEncounters,
    useInitEncounter,
    useUpdateEncounter
} from "../hooks/useClinicalEncounter";
import { mapEncounterStatus, mapPaidStatus } from "../utils/utils";
import { useToast } from "../contexts/ToastContext";
import { useGetPatients } from "../hooks/usePatient";
import { useGetUsers } from "../hooks/useUser";

interface ModalAction {
    row: ClinicalEncounter;
    type: 'create' | 'edit' | 'consult' | 'delete';
}

export default function Home() {
    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode();
    const { showToast } = useToast();

    const [searchText, setSearchText] = useState<string>('');
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedRow, setSelectedRow] = useState<ClinicalEncounter | null>(null);
    const [openFormModal, setOpenFormModal] = useState(false);
    const [formModalType, setFormModalType] = useState<'create' | 'edit'>('create');
    const [openEncounterModal, setOpenEncounterModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const { data: encountersResponse, isLoading, isError, refetch } = useGetEncounters({searchText});
    const { data: patients } = useGetPatients();
    const { data: users } = useGetUsers();

    const clinicalEncounters = encountersResponse || [];
    const slotProps = {
        input: { style: { color: isDarkMode ? '#fff' : '#000' }
        },
        root: {
            sx: {
                '& .MuiInputLabel-root': {
                    color: isDarkMode ? '#ccc' : '#666',
                },
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#555' : '#ccc',
                }
            }
        }
    };

    const { mutate: createEncounter } = useCreateEncounter();
    const { mutate: updateEncounter } = useUpdateEncounter();
    const { mutate: deleteEncounter } = useDeleteEncounter();
    const { mutate: initEncounter } = useInitEncounter();

    // #region === INIT ENCOUNTER ===

    const {
        reset: initEncounterReset,
        handleSubmit: initEncounterSubmit,
        register: initEncounterRegister
    } = useForm<FormInitEncounterSchema>({
        resolver: zodResolver(formInitEncounterSchema)
    })

    const onSubmitInitEncounter = (data: FormInitEncounterSchema) => {
        try {
            if (!selectedRow) {
                throw Error('Nenhuma consulta selecionada!');
            }

            initEncounter(
                {
                    id: selectedRow.id ??0,
                    tenantId: data.tenantId ?? 0
                },
                {
                    onSuccess: () => {
                        navigate(`/${selectedRow.id}/clinicalEncounter`);
                    },
                    onError: (error) => {
                        showToast(
                            `Erro: ${error.message}`,
                            'error'
                        );
                    }
                }
            );
        } catch (error) {
            showToast(
                `Erro: ${error}`, 
                'error'
        );
        }
    };

    // #endregion

    // #region === CLINICAL ENCOUNTER ===
    
    const {
        reset: clinicalEncounterReset,
        handleSubmit: clinicalEncounterSubmit,
        register: clinicalEncounterRegister,
        control: clinicalEncounterControl,
        formState: { errors }
    } = useForm<FormClinicalEncounterSchema>({
        resolver: zodResolver(formClinicalEncounterSchema)
    })

    const onSubmitClinicalEncounter = (data: FormClinicalEncounterSchema) => {
        try {
            if (formModalType === 'create') {
                createEncounter(
                    data as ClinicalEncounter,
                    {
                        onSuccess: () => {
                            showToast(
                                'Consulta criada com sucesso!',
                                'success'
                            );
                            setOpenFormModal(false);
                            clinicalEncounterReset();
                            refetch();
                        },
                        onError: (error) => {
                            showToast(
                                `Erro: ${error.message}`,
                                'error'
                            );
                        }
                    }
                );
            }

            if (formModalType === 'edit') {
                updateEncounter(
                    {
                        id: selectedRow?.id ?? 0,
                        clinicalEncounter: data as ClinicalEncounter
                    },
                    {
                        onSuccess: () => {
                            showToast(
                                'Consulta atualizada com sucesso!',
                                'success'
                            );
                            setOpenFormModal(false);
                            clinicalEncounterReset();
                            refetch();
                        },
                        onError: (error) => {
                            showToast(
                                `Erro: ${error.message}`,
                                'error'
                            );
                        }
                    }
                );
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };

    // #endregion

    // #region === DELETE ENCOUNTER ===

    const {
        reset: deleteEncounterReset,
        handleSubmit: deleteEncounterSubmit,
        register: deleteEncounterRegister,
    } = useForm<FormDeleteEncounterSchema>({
        resolver: zodResolver(formDeleteEncounterSchema)
    })

    const onDeleteConfirm = () => {
        if (selectedRow?.id) {
            deleteEncounter(selectedRow.id, {
                onSuccess: () => {
                    showToast(
                        'Consulta excluída com sucesso!',
                        'success'
                    );
                    setOpenDeleteModal(false);
                    refetch();
                }
            });
        }
    };

    // #endregion

    // #region === DROPDOWN MENU E MODAL HANDLER ===

    const prevOpen = useRef(openMenuIndex !== null);

    const handleToggle = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        setAnchorEl(event.currentTarget);
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    const handleClose = () => {
        setOpenMenuIndex(null);
        setAnchorEl(null);
    };

    const handleListKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Tab' || event.key === 'Escape') {
            event.preventDefault();
            setOpenMenuIndex(null);
        }
    };

    const openModal = (type: ModalAction['type'], row?: ClinicalEncounter) => {
        handleClose();

        if (row) {
            setSelectedRow(row);
        }

        switch (type) {
            case 'create':
                clinicalEncounterReset({
                    id: 0,
                    tenantId: 1,
                    userId: 13,
                    patientId: 0,
                    encounterDate: '',
                    status: 0,
                    paid: 0,
                    contentHtml: '',
                    contentText: '',
                    gptResponse: '',
                });

                setOpenFormModal(true);
                setFormModalType('create');
                break;
            case 'edit':
                setOpenFormModal(true);
                setFormModalType('edit');
                break;
            case 'consult':
                setOpenEncounterModal(true);
                break;
            case 'delete':
                setOpenDeleteModal(true);
                break;
            default:
                break;
        }
    };

    // #endregion

    const handleSearch = (text: string) => { setSearchText(text) };

    useEffect(() => {
        if (prevOpen.current && openMenuIndex === null) {
            anchorEl?.focus();
        }
        prevOpen.current = openMenuIndex !== null;
    }, [openMenuIndex, anchorEl]);

    useEffect(() => {
        if (selectedRow) {
            initEncounterReset();

            deleteEncounterReset({
                id: selectedRow?.id ?? 0,
            })
            
            clinicalEncounterReset({
                id: selectedRow?.id,
                tenantId: selectedRow?.tenantId ?? 1,
                userId: selectedRow?.user?.id ?? 13,
                patientId: selectedRow?.patient?.id ?? 0,
                encounterDate: selectedRow.encounterDate ? moment(selectedRow.encounterDate).format('YYYY-MM-DD') : '',
                status: selectedRow.status ?? 0,
                paid: selectedRow.paid ? 1 : 0,
                contentHtml: selectedRow.contentHtml ?? '',
                contentText: selectedRow.contentText ?? '',
                gptResponse: selectedRow.gptResponse ?? '',
            });
        }
    }, [selectedRow, initEncounterReset, deleteEncounterReset, clinicalEncounterReset]);

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Próximas consultas
                </h1>
                <div className="flex justify-end">
                    <Button variant="contained" onClick={() => openModal('create')}>
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Nova Consulta
                    </Button>
                </div>
            </div>

            <FormSearch
                onSubmit={ (data) => handleSearch(data?.searchText ?? '') }
                placeholder="Pesquisar por paciente, profissional, data, status da consulta ou pagamento..."
            />

            <div className={`flex justify-between items-center mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-2xl p-3 mb-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                {isLoading ? (
                    <div className="w-full flex justify-center items-center p-8">
                        <CircularProgress />
                    </div>
                ) : isError ? (
                    <div className="w-full flex flex-col items-center justify-center p-8 text-center">
                        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
                        <Typography variant="h6" color="error">
                            Erro ao carregar consultas
                        </Typography>
                        <Typography variant="body2" className="mt-2">
                            Não foi possível carregar as consultas. Tente novamente.
                        </Typography>
                        <Button 
                            variant="outlined" 
                            color="error" 
                            className="mt-4"
                            onClick={() => refetch()}
                        >
                            Tentar novamente
                        </Button>
                    </div>
                ) : (
                    <TableContainer component="div">
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {["Paciente", "Profissional", "Data", "Status", "Pago", ""].map((header, idx) => (
                                        <TableCell
                                            key={idx}
                                            align={header ? 'left' : 'center'}
                                            style={{
                                                minWidth: 100,
                                                backgroundColor: isDarkMode ? '#1e2939' : '#f8fafc',
                                                color: isDarkMode ? '#e2e8f0' : '#1e2939',
                                            }}
                                        >
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {clinicalEncounters?.length ? clinicalEncounters.map((row, index) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}
                                        sx={{
                                            backgroundColor: isDarkMode ? '#1e2939' : 'white',
                                            '&:hover': {
                                                backgroundColor: isDarkMode ? '#334155' : '#f1f5f9',
                                            }
                                        }}
                                    >
                                        <TableCell align="left" style={{ color: isDarkMode ? '#e2e8f0' : '#1e2939' }}>
                                            {row.patient?.name} {row.patient?.nameSecond}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: isDarkMode ? '#e2e8f0' : '#1e2939' }}>
                                            {row.user?.name} {row.user?.nameSecond} {row.user?.documentCrp && `(${row.user?.documentCrp})`}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: isDarkMode ? '#e2e8f0' : '#1e2939' }}>
                                            {moment(row.encounterDate).format("DD/MM/YYYY")}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: isDarkMode ? '#e2e8f0' : '#1e2939' }}>
                                            {mapEncounterStatus(row?.status ?? 0)}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: isDarkMode ? '#e2e8f0' : '#1e2939' }}>
                                            {mapPaidStatus(row?.paid ?? 0)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                id={`composition-button-${index}`}
                                                aria-controls={openMenuIndex === index ? 'composition-menu' : undefined}
                                                aria-expanded={openMenuIndex === index ? 'true' : undefined}
                                                aria-haspopup="true"
                                                onClick={(event) => handleToggle(event, index)}
                                            >
                                                <EllipsisVerticalIcon className={`h-5 w-5 ${isDarkMode ? 'text-slate-100' : 'text-slate-700'}`} />
                                            </Button>

                                            <Popper
                                                open={openMenuIndex === index}
                                                anchorEl={anchorEl}
                                                role={undefined}
                                                placement="bottom-start"
                                                transition
                                                disablePortal
                                                modifiers={[{ name: 'zIndex', enabled: true, phase: 'write', fn: ({ state }) => { state.elements.popper.style.zIndex = '1500'; } }]}
                                            >
                                                {({ TransitionProps, placement }) => (
                                                    <Grow
                                                        {...TransitionProps}
                                                        style={{
                                                            transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
                                                        }}
                                                    >
                                                        <Paper
                                                            sx={{
                                                                zIndex: 1500,
                                                                color: isDarkMode ? '#e2e8f0' : '#1e2939',
                                                                backgroundColor: isDarkMode ? '#1e2939' : 'white',
                                                                borderRadius: '0.5rem',
                                                                boxShadow: isDarkMode ? '0 4px 6px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.2)',
                                                            }}
                                                        >
                                                            <ClickAwayListener onClickAway={handleClose}>
                                                                <MenuList id="composition-menu" aria-labelledby="composition-button" onKeyDown={handleListKeyDown}>
                                                                    <MenuItem onClick={() => openModal('consult', row)}>
                                                                        <ChevronDoubleRightIcon className="h-4 w-4 mr-2" /> Consultar
                                                                    </MenuItem>
                                                                    <MenuItem onClick={() => openModal('edit', row)}>
                                                                        <PencilIcon className="h-4 w-4 mr-2" /> Editar
                                                                    </MenuItem>
                                                                    <MenuItem onClick={() => openModal('delete', row)}>
                                                                        <XMarkIcon className="h-4 w-4 mr-2" /> Cancelar
                                                                    </MenuItem>
                                                                </MenuList>
                                                            </ClickAwayListener>
                                                        </Paper>
                                                    </Grow>
                                                )}
                                            </Popper>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" className="text-center">
                                            <div className={`flex items-center justify-center ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
                                                <Typography variant="subtitle1">
                                                    Nenhuma consulta encontrada
                                                </Typography>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>

            {/* Modal de Iniciar Consulta */}
            <ModalWrapper
                open={openEncounterModal}
                onClose={() => setOpenEncounterModal(false)}
                title={`Iniciar a consulta de ${selectedRow?.patient?.name}?`}
            >
                <form onSubmit={initEncounterSubmit(onSubmitInitEncounter)}>
                    <input
                        type="hidden"
                        {...initEncounterRegister('id', { valueAsNumber: true })}
                        value={selectedRow?.id ?? 0}
                    />
                    {errors.id && <p>{errors.id.message}</p>}

                    <input
                        type="hidden"
                        {...initEncounterRegister('tenantId', { valueAsNumber: true })}
                        value={selectedRow?.tenantId ?? 0}
                    />
                    {errors.tenantId && <p>{errors.tenantId.message}</p>}

                    <Typography sx={{ mt: 2 }}>
                        Você será redirecionado para outra página.
                    </Typography>

                    <div className="mt-4 flex justify-end gap-4">
                        <Button variant="outlined" type="reset" onClick={() => {
                            setOpenEncounterModal(false);
                            initEncounterReset()
                        }}>
                            Cancelar
                        </Button>
                        <Button variant="contained" type="submit">
                            Iniciar
                        </Button>
                    </div>
                </form>
            </ModalWrapper>

            {/* Modal de Formulário (Criar/Editar) */}
            <ModalWrapper
                open={openFormModal}
                onClose={() => setOpenFormModal(false)}
                title={`${formModalType === 'create' ? 'Criar' : 'Editar'} Consulta`}
                width={750}
            >
                <form onSubmit={clinicalEncounterSubmit(onSubmitClinicalEncounter)}>
                    <div className="grid grid-cols-12 gap-4">
                        <input
                            type="hidden"
                            {...clinicalEncounterRegister('id', { valueAsNumber: true })}
                            defaultValue={0}
                        />
                        {errors.id && <p>{errors.id.message}</p>}
                        <input
                            type="hidden"
                            {...clinicalEncounterRegister('tenantId', { valueAsNumber: true })}
                            defaultValue={selectedRow?.tenantId ?? 1}
                        />
                        {errors.tenantId && <p>{errors.tenantId.message}</p>}
                        <Controller
                            name="patientId"
                            control={clinicalEncounterControl}
                            render={({ field }) => (
                                <Box className={`mt-4 col-span-12 sm:col-span-4 rounded-md`}>
                                    <FormControl fullWidth>
                                        <InputLabel 
                                            sx={{
                                                transform: 'translate(14px, 8px) scale(1)',
                                                '&.Mui-focused, &.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.75)'
                                                }
                                            }}
                                            id="patientId"
                                        >
                                            Paciente
                                        </InputLabel>
                                        <Select
                                            {...field}
                                            size="small"
                                            labelId="patientId"
                                            id="patientId"
                                            label="Paciente"
                                        >
                                            {
                                                patients?.map((patient) => (
                                                    <MenuItem key={patient.id} value={patient.id}>
                                                        {patient.name} {patient.nameSecond}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            )}
                        />
                        {errors.patientId && <p>{errors.patientId.message}</p>}
                        <Controller
                            name="userId"
                            control={clinicalEncounterControl}
                            render={({ field }) => (
                                <Box className={`mt-4 col-span-12 sm:col-span-4 rounded-md`}>
                                    <FormControl fullWidth>
                                        <InputLabel 
                                            sx={{
                                                transform: 'translate(14px, 8px) scale(1)',
                                                '&.Mui-focused, &.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.75)'
                                                }
                                            }}
                                            id="patientId"
                                        >
                                            Médico
                                        </InputLabel>
                                        <Select
                                            {...field}
                                            size="small"
                                            labelId="userId"
                                            id="userId"
                                            label="Médico"
                                        >
                                            {
                                                users?.map((user) => (
                                                    <MenuItem key={user.id} value={user.id}>
                                                        {user.name} {user.nameSecond}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            )}
                        />
                        {errors.userId && <p>{errors.userId.message}</p>}
                        <MuiTextField
                            type="date"
                            label="Data"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...clinicalEncounterRegister('encounterDate')}
                            defaultValue={selectedRow?.encounterDate ? moment(selectedRow.encounterDate).format('YYYY-MM-DD') : ''}
                            slotProps={slotProps}
                            size="small"
                            className={`col-span-12 sm:col-span-4 rounded-md`}
                            InputLabelProps={{ shrink: true }}
                        />
                        {errors.encounterDate && <p>{errors.encounterDate.message}</p>}
                        <Controller
                            name="paid"
                            control={clinicalEncounterControl}
                            render={({ field }) => (
                                <Box className={`mt-4 col-span-12 sm:col-span-4 rounded-md`}>
                                    <FormControl fullWidth>
                                        <InputLabel 
                                            sx={{
                                                transform: 'translate(14px, 8px) scale(1)',
                                                '&.Mui-focused, &.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.75)'
                                                }
                                            }}
                                            id="paid"
                                        >
                                            Pago
                                        </InputLabel>
                                        <Select
                                            {...field}
                                            size="small"
                                            labelId="paid"
                                            id="paid"
                                            label="Pago"
                                        >
                                            <MenuItem value={1}>Sim</MenuItem>
                                            <MenuItem value={0}>Não</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            )}
                        />
                        {errors.paid && <p>{errors.paid.message}</p>}
                        <Controller
                            name="status"
                            control={clinicalEncounterControl}
                            render={({ field }) => (
                                <Box className={`mt-4 col-span-12 sm:col-span-4 rounded-md`}>
                                    <FormControl fullWidth>
                                        <InputLabel
                                        sx={{
                                            transform: 'translate(14px, 8px) scale(1)',
                                            '&.Mui-focused, &.MuiFormLabel-filled': {
                                            transform: 'translate(14px, -9px) scale(0.75)'
                                            }
                                        }}
                                        id="paid"
                                        >
                                            Status
                                        </InputLabel>
                                        <Select
                                            {...field}
                                            size="small"
                                            labelId="status"
                                            id="status"
                                            label="Status"
                                        >
                                            <MenuItem value={0}>Agendado</MenuItem>
                                            <MenuItem value={1}>Iniciado</MenuItem>
                                            <MenuItem value={2}>Concluído</MenuItem>
                                            <MenuItem value={3}>Cancelado</MenuItem>
                                            <MenuItem value={4}>Faltante</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            )}
                        />
                        {errors.status && <p>{errors.status.message}</p>}
                    </div>
                    <div className="mt-4 flex justify-end gap-4">
                        <Button
                            variant="outlined"
                            onClick={() => setOpenFormModal(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                        >
                            {formModalType === 'create' ? 'Criar' : 'Salvar'}
                        </Button>
                    </div>
                </form>
            </ModalWrapper>

            {/* Modal de Cancelamento */}
            <ModalWrapper
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                title="Cancelar Consulta"
                width={400}
            >
                <Typography sx={{ mt: 2 }}>Deseja realmente cancelar a consulta?</Typography>
                <div className="mt-4 flex justify-end gap-4">
                    <form onSubmit={deleteEncounterSubmit(onDeleteConfirm)}>
                        <input
                            type="hidden"
                            {...deleteEncounterRegister('id')}
                            value={selectedRow?.id ?? 0}
                        />
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outlined"
                                type="reset"
                                onClick={() => setOpenDeleteModal(false)}
                                className="mr-2"
                            >
                                Não
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                type="submit"
                            >
                                Sim, cancelar
                            </Button>
                        </div>
                    </form>
                </div>
            </ModalWrapper>
        </div>
    );
}