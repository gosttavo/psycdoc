import { useEffect, useRef, useState } from "react";
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
    PencilIcon,
    PlusIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { formUserSchema, FormUserSchema } from "../schemas/formUserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "../interfaces/User";
import FormSearch from "../components/FormSearch";
import ModalWrapper from "../components/Modal";

interface ModalAction {
    row: User;
    type: 'create' | 'edit' | 'delete';
}

export default function Home() {
    const [users] = useState<User[]>(mock.users);
    const { isDarkMode } = useDarkMode();
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedRow, setSelectedRow] = useState<User | null>(null);
    const [openFormModal, setOpenFormModal] = useState(false);
    const [formModalType, setFormModalType] = useState<'create' | 'edit'>('create');
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const {
        reset: userReset,
        handleSubmit: userSubmit,
        register: userRegister
    } = useForm<FormUserSchema>({
        resolver: zodResolver(formUserSchema)
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
    const openModal = (type: ModalAction['type'], row?: User) => {
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
            userReset({
                id: selectedRow.id ?? 0,
            });
        }
    }, [selectedRow, userReset]);

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Médicos
                </h1>
                <div className="flex justify-end">
                  <Button variant="contained" onClick={() => openModal('create')}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Novo Médico
                  </Button>
                </div>
            </div>

            <FormSearch
                onSubmit={(data) => console.log("Pesquisar", data)}
                placeholder="Pesquisar nome, e-mail, CRM, ou CPF..."
            />

            <div className={`flex justify-between items-center mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-2xl p-3 mb-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <TableContainer component="div">
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {["Nome", "E-mail", "CRM", "CPF", "Data de nascimento", ""].map((header, idx) => (
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
                            {users.map((row, index) => (
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
                                        {row.email}
                                    </TableCell>
                                    <TableCell align="left" style={{ color: isDarkMode ? '#e2e8f0' : '#1e2939' }}>
                                        {row?.documentCrm}
                                    </TableCell>
                                    <TableCell align="left" style={{ color: isDarkMode ? '#e2e8f0' : '#1e2939' }}>
                                        {row?.document}
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

            {/* Modal de Formulário (Criar/Editar) */}
            <ModalWrapper
                open={openFormModal}
                onClose={() => setOpenFormModal(false)}
                title={`${formModalType === 'create' ? 'Criar' : 'Editar'} Médico`}
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
                title="Excluir Médico"
                width={400}
            >
                <Typography sx={{ mt: 2 }}>Deseja excluir o médico?</Typography>
                <div className="mt-4 flex justify-end gap-4">
                    <Button variant="outlined" onClick={() => setOpenDeleteModal(false)}>
                        Não
                    </Button>
                    <Button variant="contained" color="error">
                        Sim
                    </Button>
                </div>
            </ModalWrapper>
        </div>
    );
}