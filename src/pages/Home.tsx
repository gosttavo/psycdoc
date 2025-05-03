import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import moment from "moment";
import mock from "../database/mock.json";
import { useDarkMode } from "../hooks/useDarkMode";
import {
    Button,
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
    Typography
} from "@mui/material";
import {
    EllipsisVerticalIcon,
    ChevronDoubleRightIcon,
    PencilIcon,
    PlusIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { formInitEncounterSchema, FormInitEncounterSchema } from "../schemas/formEncounterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClinicalEncounter } from "../interfaces/ClinicalEncounter";
import FormSearch from "../components/FormSearch";
import ModalWrapper from "../components/Modal";

interface ModalAction {
    row: ClinicalEncounter;
    type: 'create' | 'edit' | 'consult' | 'delete';
}

export default function Home() {
    const [clinicalEncounters] = useState<ClinicalEncounter[]>(mock.clinicalEncounters);
    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode();
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedRow, setSelectedRow] = useState<ClinicalEncounter | null>(null);
    const [openFormModal, setOpenFormModal] = useState(false);
    const [formModalType, setFormModalType] = useState<'create' | 'edit'>('create');
    const [openEncounterModal, setOpenEncounterModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const {
        reset: encounterReset,
        handleSubmit: encounterSubmit,
        register: encounterRegister
    } = useForm<FormInitEncounterSchema>({
        resolver: zodResolver(formInitEncounterSchema)
    })

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
    const openModal = (type: ModalAction['type'], row?: ClinicalEncounter) => {
        handleClose();

        if (row) {
            setSelectedRow(row);
        }

        switch (type) {
            case 'create':
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

    useEffect(() => {
        if (prevOpen.current && openMenuIndex === null) {
            anchorEl?.focus();
        }
        prevOpen.current = openMenuIndex !== null;
    }, [openMenuIndex, anchorEl]);

    useEffect(() => {
        if (selectedRow) {
            encounterReset({
                patient: selectedRow.patientId ?? 0,
                status: 2,
            });
        }
    }, [selectedRow, encounterReset]);

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
                onSubmit={(data) => console.log("Pesquisar", data)}
                placeholder="Pesquisar por paciente, profissional, data..."
            />

            <div className={`flex justify-between items-center mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-2xl p-3 mb-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <TableContainer component="div">
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {["Paciente", "Profissional", "Data", "Status", ""].map((header, idx) => (
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
                            {clinicalEncounters.map((row, index) => (
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
                                        {row.user?.name} {row.user?.nameSecond} {row.user?.documentCrm && `(${row.user?.documentCrm})`}
                                    </TableCell>
                                    <TableCell align="left" style={{ color: isDarkMode ? '#e2e8f0' : '#1e2939' }}>
                                        {moment(row.encounterDate).format("DD/MM/YYYY")}
                                    </TableCell>
                                    <TableCell align="left" style={{ color: isDarkMode ? '#e2e8f0' : '#1e2939' }}>
                                        {row.status}
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
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            {/* Modal de Iniciar Consulta */}
            <ModalWrapper
                open={openEncounterModal}
                onClose={() => setOpenEncounterModal(false)}
                title={`Iniciar a consulta de ${selectedRow?.patient?.name}?`}
            >
                <form onSubmit={encounterSubmit((data) => {
                    console.log("Iniciar consulta", selectedRow?.id, data);
                    navigate(`/${selectedRow?.id}/clinicalEncounter`);
                })}>
                    <input
                        type="hidden"
                        {...encounterRegister('patient')}
                        value={selectedRow?.patientId ?? 0}
                    />
                    <input
                        type="hidden"
                        {...encounterRegister('status')}
                        value={2}
                    />
                    <Typography sx={{ mt: 2 }}>Você será redirecionado para outra página.</Typography>

                    <div className="mt-4 flex justify-end gap-4">
                        <Button variant="outlined" type="reset" onClick={() => {
                            setOpenEncounterModal(false);
                            encounterReset()
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
                width={600}
            >
                <Typography sx={{ mt: 2 }}>Formulário de edição aqui.</Typography>
                <div className="mt-4 flex justify-end gap-4">
                    <Button variant="outlined" onClick={() => setOpenFormModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="contained">
                        {formModalType === 'create' ? 'Criar' : 'Salvar'}
                    </Button>
                </div>
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
                    <Button variant="outlined" onClick={() => setOpenDeleteModal(false)}>
                        Não
                    </Button>
                    <Button variant="contained" color="error">
                        Sim, cancelar
                    </Button>
                </div>
            </ModalWrapper>
        </div>
    );
}