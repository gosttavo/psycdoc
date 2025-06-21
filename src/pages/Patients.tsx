import { useEffect, useRef, useState } from "react";
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
    PencilIcon,
    PlusIcon,
    XMarkIcon,
    ExclamationTriangleIcon,
    Bars4Icon,
    EyeIcon,
    ClipboardDocumentListIcon
} from "@heroicons/react/24/outline";
import { Controller, useForm } from "react-hook-form";
import { formPatientSchema, FormPatientSchema, formDeletePatientSchema, FormDeletePatientSchema } from "../schemas/formPatientSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Patient } from "../interfaces/Patient";
import FormSearch from "../components/FormSearch";
import ModalWrapper from "../components/Modal";
import { 
    useCreatePatient, 
    useDeletePatient, 
    useGetPatients,
    useUpdatePatient
} from "../hooks/usePatient";
import { mapEncounterStatus, mapGender } from "../utils/utils";
import { useToast } from "../contexts/ToastContext";
import { useGetEncounters } from "../hooks/useClinicalEncounter";
import Card from "../components/Card";
import { useNavigate } from "react-router";
import ReportCard from "../components/ReportCard";

interface ModalAction {
    row: Patient;
    type: 'create' | 'edit' | 'delete' | 'historic' | 'report';
}

export default function Patients() {
    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode();
    const { showToast } = useToast();

    const [searchText, setSearchText] = useState<string>('');    
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedRow, setSelectedRow] = useState<Patient | null>(null);
    const [formModalType, setFormModalType] = useState<'create' | 'edit'>('create');
    const [openFormModal, setOpenFormModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openHistoricModal, setOpenHistoricModal] = useState(false);
    const [openReportModal, setOpenReportModal] = useState(false);

    const {
        data: encounters,
        refetch: fetchEncounters
    } = useGetEncounters(
        { patientId: selectedRow?.id ?? 0 },
        { enabled: false }
    );

    const { data: patientsResponse, isLoading, isError, refetch } = useGetPatients(searchText);
    const patients = patientsResponse || [];

    const slotProps = {
        input: {
            style: {
                color: isDarkMode ? '#fff' : '#000',
            },
        },
        root: {
            sx: {
                '& .MuiInputLabel-root': {
                    color: isDarkMode ? '#ccc' : '#666',
                },
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#555' : '#ccc',
                },
            }
        }
    }

    // #region Form Handlers
    
    const {
        reset: patientReset,
        handleSubmit: patientSubmit,
        register: patientRegister,
        control: patientControl,
        formState: { errors }
    } = useForm<FormPatientSchema>({
        resolver: zodResolver(formPatientSchema)
    })

    const {
        reset: deletePatientReset,
        handleSubmit: deletePatientSubmit,
        register: deletePatientRegister,
    } = useForm<FormDeletePatientSchema>({
        resolver: zodResolver(formDeletePatientSchema)
    })

    const { mutate: createPatient } = useCreatePatient();
    const { mutate: updatePatient } = useUpdatePatient();
    const { mutate: deletePatient } = useDeletePatient();

    const onSubmitPatient = (data: FormPatientSchema) => {
        try {
            if (formModalType === 'create') {
                createPatient(
                    data as Patient,
                    {
                        onSuccess: () => {
                            showToast(
                                'Paciente criado com sucesso!',
                                'success'
                            );
                            setOpenFormModal(false);
                            patientReset();
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
            };

            if (formModalType === 'edit') {
                updatePatient(
                    {
                        id: selectedRow?.id ?? 0,
                        patient: data as Patient
                    },
                    {
                        onSuccess: () => {
                            showToast(
                                'Paciente atualizado com sucesso!',
                                'success'
                            );
                            setOpenFormModal(false);
                            patientReset();
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
            };
        } catch (error) {
            showToast(
                `Erro: ${error}`,
                'error'
            );
        }
    };

    const onDeleteConfirm = () => {
        if (selectedRow?.id) {
            deletePatient(selectedRow.id, {
                onSuccess: () => {
                    showToast(
                        'Paciente excluído com sucesso!',
                        'success'
                    );
                    setOpenDeleteModal(false);
                    refetch();
                }
            });
        }
    };

    // #endregion

    // #region Dropdown Menu

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

    // #endregion

    // #region Modal Handlers

    const openModal = (type: ModalAction['type'], row?: Patient) => {
        handleClose();

        if (row) {
            setSelectedRow(row);
        }

        switch (type) {
            case 'create':
                patientReset({
                    id: 0,
                    tenantId: 1,
                    name: '',
                    nameSecond: '',
                    nameCalledBy: '',
                    motherName: '',
                    document: '',
                    birthDate: '',
                    gender: 0,
                    phone: '',
                    email: '',
                    active: 1,
                });

                setOpenFormModal(true);
                setFormModalType('create');
                break;
            case 'edit':
                setOpenFormModal(true);
                setFormModalType('edit');
                break;
            case 'delete':
                setOpenDeleteModal(true);
                break;
            case 'historic':
                setOpenHistoricModal(true);
                break;
            case 'report':
                setOpenReportModal(true);
                break;
            default:
                break;
        }
    };

    // #endregion

    // #region Search Handler

    const handleSearch = (text: string) => {
        setSearchText(text);
    };

    // #endregion

    useEffect(() => {
        if (prevOpen.current && openMenuIndex === null) {
            anchorEl?.focus();
        }
        prevOpen.current = openMenuIndex !== null;
    }, [openMenuIndex, anchorEl]);

    useEffect(() => {
        if (selectedRow) {
            deletePatientReset({
                id: selectedRow?.id ?? 0,
            })
            
            patientReset({
                id: selectedRow?.id,
                tenantId: selectedRow?.tenantId ?? 1,
                name: selectedRow?.name ?? '',
                nameSecond: selectedRow?.nameSecond ?? '',
                nameCalledBy: selectedRow?.nameCalledBy ?? '',
                motherName: selectedRow?.motherName ?? '',
                document: selectedRow?.document ?? '',
                birthDate: selectedRow?.birthDate ?? '',
                gender: selectedRow?.gender ?? 1,
                phone: selectedRow?.phone ?? '',
                email: selectedRow?.email ?? '',
                active: selectedRow?.active ?? 1,
            });
        }
    }, [selectedRow, patientReset, deletePatientReset]);

    useEffect(() => {
        if (openHistoricModal && selectedRow?.id) {
            fetchEncounters();
        }
    }, [openHistoricModal, selectedRow, fetchEncounters]);

    
    // useEffect(() => {
    //     if (openReportModal && selectedRow?.id) {
    //         fetchReport();
    //     }
    // }, [openReportModal, selectedRow, fetchReport]);

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Paciente
                </h1>
                <div className="flex justify-end">
                    <Button variant="contained" onClick={() => openModal('create')}>
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Novo Paciente
                    </Button>
                </div>
            </div>

            <FormSearch
                onSubmit={ (data) => handleSearch(data?.searchText ?? '') }
                placeholder="Pesquisar por nome, sobrenome, e-mail, CPF ou data de nascimento..."
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
                            Erro ao carregar paciente
                        </Typography>
                        <Typography variant="body2" className="mt-2">
                            Não foi possível carregar os paciente. Tente novamente.
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
                                    {["Nome", "Nome social", "E-mail", "CPF", "Gênero", "Data de nascimento", ""].map((header, idx) => (
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
                                {patients?.length ? patients.map((row, index) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}
                                        sx={{
                                            backgroundColor: isDarkMode ? '#1e2939' : 'white',
                                            '&:hover': {
                                                backgroundColor: isDarkMode ? '#334155' : '#f1f5f9',
                                            }
                                        }}
                                    >
                                        <TableCell align="left" style={{ color: isDarkMode ? '#e2e8f0' : '#1e2939' }}>
                                            {row?.name} {row?.nameSecond}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: isDarkMode ? '#e2e8f0' : '#1e2939' }}>
                                            {row?.nameCalledBy ?? '-'}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: isDarkMode ? '#e2e8f0' : '#1e2939' }}>
                                            {row.email ?? '-'}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: isDarkMode ? '#e2e8f0' : '#1e2939' }}>
                                            {row?.document ?? '-'}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: isDarkMode ? '#e2e8f0' : '#1e2939' }}>
                                            {mapGender(row?.gender) ?? '-'}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: isDarkMode ? '#e2e8f0' : '#1e2939' }}>
                                            {moment(row.birthDate).format("DD/MM/YYYY")}
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
                                                                    <MenuItem onClick={() => openModal('edit', row)}>
                                                                        <PencilIcon className="h-4 w-4 mr-2" /> Editar
                                                                    </MenuItem>
                                                                    <MenuItem onClick={() => openModal('delete', row)}>
                                                                        <XMarkIcon className="h-4 w-4 mr-2" /> Excluir
                                                                    </MenuItem>
                                                                    <MenuItem onClick={() => openModal('historic', row)}>
                                                                        <ClipboardDocumentListIcon className="h-4 w-4 mr-2" /> Consultas
                                                                    </MenuItem>
                                                                    <MenuItem onClick={() => openModal('report', row)}>
                                                                        <Bars4Icon className="h-4 w-4 mr-2" /> Gerar relatório
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
                                                    Nenhum paciente encontrado
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

            {/* Modal de Formulário (Criar/Editar) */}
            <ModalWrapper
                open={openFormModal}
                onClose={() => setOpenFormModal(false)}
                title={`${formModalType === 'create' ? 'Criar' : 'Editar'} Paciente`}
                width={750}
            >
                <form onSubmit={patientSubmit(onSubmitPatient)}>
                    <div className="grid grid-cols-12 gap-4">
                        <input
                            type="hidden"
                            {...patientRegister('id', { valueAsNumber: true })}
                            defaultValue={0}
                        />
                        {errors.id && <p>{errors.id.message}</p>}
                        <input
                            type="hidden"
                            {...patientRegister('tenantId', { valueAsNumber: true })}
                            defaultValue={1}
                        />
                        {errors.tenantId && <p>{errors.tenantId.message}</p>}
                        <MuiTextField
                            label="Nome"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...patientRegister('name')}
                            defaultValue={selectedRow?.name ?? ''}
                            slotProps={slotProps}
                            size="small"
                            className={`col-span-12 sm:col-span-4 rounded-md`}
                        />
                        {errors.name && <p>{errors.name.message}</p>}
                        <MuiTextField
                            label="Sobrenome"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...patientRegister('nameSecond')}
                            defaultValue={selectedRow?.nameSecond ?? ''}
                            slotProps={slotProps}
                            size="small"
                            className={`col-span-12 sm:col-span-4 rounded-md`}
                        />
                        {errors.nameSecond && <p>{errors.nameSecond.message}</p>}
                        <MuiTextField
                            label="Nome social"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...patientRegister('nameCalledBy')}
                            defaultValue={selectedRow?.nameCalledBy ?? ''}
                            slotProps={slotProps}
                            size="small"
                            className={`col-span-12 sm:col-span-4 rounded-md`}
                        />
                        {errors.nameCalledBy && <p>{errors.nameCalledBy.message}</p>}
                        <MuiTextField
                            label="Nome da mãe"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...patientRegister('motherName')}
                            defaultValue={selectedRow?.motherName ?? ''}
                            slotProps={slotProps}
                            size="small"
                            className={`col-span-12 sm:col-span-4 rounded-md`}
                        />
                        {errors.motherName && <p>{errors.motherName.message}</p>}
                        <MuiTextField
                            label="CPF"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...patientRegister('document')}
                            defaultValue={selectedRow?.document ?? ''}
                            slotProps={slotProps}
                            size="small"
                            className={`col-span-12 sm:col-span-4 rounded-md`}
                        />
                        {errors.document && <p>{errors.document.message}</p>}
                        <MuiTextField
                            type="date"
                            label="Data de nascimento"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...patientRegister('birthDate')}
                            defaultValue={selectedRow?.birthDate ? moment(selectedRow.birthDate).format('YYYY-MM-DD') : ''}
                            slotProps={slotProps}
                            size="small"
                            className={`col-span-12 sm:col-span-4 rounded-md`}
                            InputLabelProps={{ shrink: true }}
                        />
                        {errors.birthDate && <p>{errors.birthDate.message}</p>}
                        <MuiTextField
                            type="email"
                            label="E-mail"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...patientRegister('email')}
                            defaultValue={selectedRow?.email ?? ''}
                            slotProps={slotProps}
                            size="small"
                            className={`col-span-12 sm:col-span-4 rounded-md`}
                        />
                        {errors.email && <p>{errors.email.message}</p>}
                        <MuiTextField
                            label="Telefone"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...patientRegister('phone')}
                            defaultValue={selectedRow?.phone ?? ''}
                            slotProps={slotProps}
                            size="small"
                            className={`col-span-12 sm:col-span-4 rounded-md`}
                        />
                        {errors.phone && <p>{errors.phone.message}</p>}
                        <Controller
                            name="gender"
                            control={patientControl}
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
                                        id="gender"
                                        >
                                            Gênero
                                        </InputLabel>
                                        <Select
                                            {...field}
                                            size="small"
                                            labelId="gender"
                                            id="gender"
                                            label="Gênero"
                                        >
                                            <MenuItem value={0}>Masculino</MenuItem>
                                            <MenuItem value={1}>Feminino</MenuItem>
                                            <MenuItem value={2}>Outro</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            )}
                        />
                        {errors.active && <p>{errors.active.message}</p>}
                        <Controller
                            name="active"
                            control={patientControl}
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
                                        id="active"
                                        >
                                            Status
                                        </InputLabel>
                                        <Select
                                            {...field}
                                            size="small"
                                            labelId="active"
                                            id="active"
                                            label="Ativo"
                                        >
                                            <MenuItem value={1}>Ativo</MenuItem>
                                            <MenuItem value={0}>Inativo</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            )}
                        />
                        {errors.active && <p>{errors.active.message}</p>}
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
                title="Excluir Paciente"
                width={400}
            >
                <Typography sx={{ mt: 2 }}>Deseja excluir o paciente?</Typography>
                <div className="mt-4 flex justify-end gap-4">
                    <form onSubmit={deletePatientSubmit(onDeleteConfirm)}>
                        <input
                            type="hidden"
                            {...deletePatientRegister('id')}
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
                                Sim
                            </Button>
                        </div>
                    </form>
                </div>
            </ModalWrapper>
            
            {/* Modal de Histórico */}
            <ModalWrapper
                open={openHistoricModal}
                onClose={() => setOpenHistoricModal(false)}
                title="Histórico de Consultas"
                width={750}
            >
                <div className="flex flex-col">
                    {
                        encounters?.map((encounter) => (
                            <Card key={encounter.id}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <div className="text-gray-700">
                                            <p>Data: {moment(encounter.encounterDate).format('DD/MM/YYYY')}</p>
                                            <p>Paciente: {encounter?.patient?.name}</p>
                                            <p>Profissional: {encounter?.user?.name}</p>
                                            <p>{mapEncounterStatus(encounter?.status ?? 0)}</p>
                                        </div>
                                    </Box>

                                    <Box>
                                        <Button
                                            onClick={() => {
                                                navigate(`/${encounter.id}/viewEncounter`);
                                            }}
                                            sx={{ minWidth: 'auto', p: 0 }}
                                        >
                                            <EyeIcon className={`h-4 w-4 mr-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-700'}`} />
                                            Visualizar
                                        </Button>
                                    </Box>
                                </Box>
                            </Card>
                        ))
                    }
                    <div className="flex items-center mt-4">
                        <Button
                            variant="outlined"
                            type="reset"
                            onClick={() => setOpenHistoricModal(false)}
                            className="mr-2"
                        >
                            Fechar
                        </Button>
                    </div>
                </div>
            </ModalWrapper>

            {/* Modal de relatório */}
            <ModalWrapper
                title="Relatório do Paciente"
                open={openReportModal}
                onClose={() => setOpenReportModal(false)}
                width={750}
            >
                <ReportCard
                    patientId={selectedRow?.id ?? 0}
                    onClose={() => setOpenReportModal(false) }
                />
            </ModalWrapper>
        </div>
    );
}