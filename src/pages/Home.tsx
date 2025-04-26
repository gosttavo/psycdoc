import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import moment from "moment";
import mock from "../database/mock.json";
//import { useAuth } from "../contexts/AuthContext";
import { useDarkMode } from "../hooks/useDarkMode";
import {
    Box,
    Button,
    ClickAwayListener,
    Fade,
    Grow,
    MenuItem,
    MenuList,
    Modal,
    Paper,
    Popper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Backdrop
} from "@mui/material";
import {
    EllipsisVerticalIcon,
    ChevronDoubleRightIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    PlusIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { formInitEncounterSchema, FormInitEncounterSchema } from "../schemas/formEncounterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClinicalEncounter } from "../interfaces/ClinicalEncounter";

interface ModalAction {
    row: ClinicalEncounter;
    type: 'edit' | 'consult' | 'delete';
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
};

export default function Home() {
    const [clinicalEncounters] = useState<ClinicalEncounter[]>(mock.clinicalEncounters);

    const navigate = useNavigate();
    //const { user } = useAuth();
    const { isDarkMode } = useDarkMode();
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const [selectedRow, setSelectedRow] = useState<ClinicalEncounter | null>(null);

    const [openEditModal, setOpenEditModal] = useState(false);
    const [openEncounterModal, setOpenEncounterModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // #region Form Handling

    const { reset, handleSubmit, register } = useForm<FormInitEncounterSchema>({
        resolver: zodResolver(formInitEncounterSchema)
    })

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

    const openModal = (row: ClinicalEncounter, type: ModalAction['type']) => {
        handleClose();
        setSelectedRow(row);
        switch (type) {
            case 'edit':
                setOpenEditModal(true);
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
            reset({
                patient: selectedRow.patientId ?? 0,
                status: 2,
            });
        }
    }, [selectedRow, reset]);

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Próximas consultas
                </h1>
                <div className="flex justify-end">
                    <Button variant="contained">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Nova Consulta
                    </Button>
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <form className={`flex items-center gap-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-2xl p-3 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <input
                        type="text"
                        placeholder="Pesquisar por paciente, profissional, data..."
                        className={`flex-1 p-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
                    />
                    <Button
                        variant="outlined"
                        onClick={(e) => {
                            e.preventDefault();
                            // Implementar search aqui
                        }}
                    >
                        <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                        Pesquisar
                    </Button>
                </form>
            </div>

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
                                <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={index}
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
                                                                <MenuItem onClick={() => openModal(row, 'consult')}>
                                                                    <ChevronDoubleRightIcon className="h-4 w-4 mr-2" /> Consultar
                                                                </MenuItem>
                                                                <MenuItem onClick={() => openModal(row, 'edit')}>
                                                                    <PencilIcon className="h-4 w-4 mr-2" /> Editar
                                                                </MenuItem>
                                                                <MenuItem onClick={() => openModal(row, 'delete')}>
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

            {/* Modais */}
            <Modal
                open={openEncounterModal}
                onClose={() => setOpenEncounterModal(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500 } }}
            >
                <Fade in={openEncounterModal}>
                    <Box 
                        sx={modalStyle}
                        style={{
                            backgroundColor: isDarkMode ? '#1e2939' : 'white',
                            color: isDarkMode ? '#e2e8f0' : '#1e2939',
                        }}
                    >
                        <form onSubmit={handleSubmit((data) => {
                            console.log("Iniciar consulta", selectedRow?.id, data);
                            navigate(`/${selectedRow?.id}/clinicalEncounter`);
                        })}>
                            <input
                                type="hidden"
                                {...register('patient')}
                                value={selectedRow?.patientId ?? 0}
                            />
                            <input
                                type="hidden"
                                {...register('status')}
                                value={2}
                            />
                            {/* Se quiser mostrar também, pode renderizar */}
                            <Typography variant="h6" component="h2">{`Iniciar a consulta de ${selectedRow?.patient?.name}?`}</Typography>
                            <Typography sx={{ mt: 2 }}>Você será redirecionado para outra página.</Typography>

                            <div className="mt-4 flex justify-end gap-4">
                                <Button variant="outlined" type="reset" onClick={() => {
                                    setOpenEncounterModal(false);
                                    reset()
                                }}>
                                    Cancelar
                                </Button>
                                <Button variant="contained" type="submit">
                                    Iniciar
                                </Button>
                            </div>
                        </form>
                    </Box>
                </Fade>
            </Modal>

            <Modal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500 } }}
            >
                <Fade in={openEditModal}>
                    <Box 
                        sx={modalStyle}
                        style={{
                            backgroundColor: isDarkMode ? '#1e2939' : 'white',
                            color: isDarkMode ? '#e2e8f0' : '#1e2939',
                        }}
                    >
                        <Typography variant="h6" component="h2">Editar Consulta</Typography>
                        <Typography sx={{ mt: 2 }}>Formulário de edição aqui.</Typography>
                    </Box>
                </Fade>
            </Modal>

            <Modal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500 } }}
            >
                <Fade in={openDeleteModal}>
                    <Box 
                        sx={modalStyle}
                        style={{
                            backgroundColor: isDarkMode ? '#1e2939' : 'white',
                            color: isDarkMode ? '#e2e8f0' : '#1e2939',
                        }}
                    >
                        <Typography variant="h6" component="h2">Cancelar Consulta</Typography>
                        <Typography sx={{ mt: 2 }}>Deseja realmente cancelar?</Typography>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
