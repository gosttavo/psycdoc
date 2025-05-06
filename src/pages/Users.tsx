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
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { Controller, useForm } from "react-hook-form";
import { formUserSchema, FormUserSchema, formDeleteUserSchema, FormDeleteUserSchema } from "../schemas/formUserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "../interfaces/User";
import FormSearch from "../components/FormSearch";
import ModalWrapper from "../components/Modal";
import { 
    useCreateUser, 
    useDeleteUser, 
    useGetUsers,
    useUpdateUser
} from "../hooks/useUser";

interface ModalAction {
    row: User;
    type: 'create' | 'edit' | 'delete';
}

export default function Home() {
    const { isDarkMode } = useDarkMode();

    const [searchText, setSearchText] = useState<string>('');
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedRow, setSelectedRow] = useState<User | null>(null);
    const [openFormModal, setOpenFormModal] = useState(false);
    const [formModalType, setFormModalType] = useState<'create' | 'edit'>('create');
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const { data: usersResponse, isLoading, isError, refetch } = useGetUsers(searchText);
    const users = usersResponse || [];

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
        reset: userReset,
        handleSubmit: userSubmit,
        register: userRegister,
        control: userControl,
        formState: { errors }
    } = useForm<FormUserSchema>({
        resolver: zodResolver(formUserSchema)
    })

    const {
        reset: deleteUserReset,
        handleSubmit: deleteUserSubmit,
        register: deleteUserRegister,
    } = useForm<FormDeleteUserSchema>({
        resolver: zodResolver(formDeleteUserSchema)
    })

    const { mutate: createUser } = useCreateUser();
    const { mutate: updateUser } = useUpdateUser();
    const { mutate: deleteUser } = useDeleteUser();

    const onSubmitUser = (data: FormUserSchema) => {
        try {
            if (formModalType === 'create') {
                createUser(data as User, {
                    onSuccess: () => {
                        setOpenFormModal(false);
                        userReset();
                        refetch();
                    },
                    onError: (error) => {
                        console.error("Error creating user:", error);
                    }
                });
            } else {
                updateUser({ id: selectedRow?.id ?? 0, user: data as User }, {
                    onSuccess: () => {
                        setOpenFormModal(false);
                        userReset();
                        refetch();
                    },
                    onError: (error) => {
                        console.error("Error updating user:", error);
                    }
                });
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };

    const onDeleteConfirm = () => {
        if (selectedRow?.id) {
            deleteUser(selectedRow.id, {
                onSuccess: () => {
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

    const openModal = (type: ModalAction['type'], row?: User) => {
        handleClose();

        if (row) {
            setSelectedRow(row);
        }

        switch (type) {
            case 'create':
                userReset({
                    id: 0,
                    tenantId: 1,
                    name: '',
                    nameSecond: '',
                    nameCalledBy: '',
                    motherName: '',
                    document: '',
                    documentCrp: '',
                    birthDate: '',
                    gender: 0,
                    phone: '',
                    email: '',
                    password: '',
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
            deleteUserReset({
                id: selectedRow?.id ?? 0,
            })
            
            userReset({
                id: selectedRow?.id,
                tenantId: selectedRow?.tenantId ?? 1,
                name: selectedRow?.name ?? '',
                nameSecond: selectedRow?.nameSecond ?? '',
                nameCalledBy: selectedRow?.nameCalledBy ?? '',
                motherName: selectedRow?.motherName ?? '',
                document: selectedRow?.document ?? '',
                documentCrp: selectedRow?.documentCrp ?? '',
                birthDate: selectedRow?.birthDate ?? '',
                gender: selectedRow?.gender ?? 1,
                phone: selectedRow?.phone ?? '',
                email: selectedRow?.email ?? '',
                password: '',
                active: selectedRow?.active ?? 1,
            });
        }
    }, [selectedRow, userReset, deleteUserReset]);

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Médico
                </h1>
                <div className="flex justify-end">
                    <Button variant="contained" onClick={() => openModal('create')}>
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Novo Médico
                    </Button>
                </div>
            </div>

            <FormSearch
                onSubmit={ (data) => handleSearch(data?.searchText ?? '') }
                placeholder="Pesquisar por nome, sobrenome, e-mail, CRP, CPF ou data de nascimento..."
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
                            Erro ao carregar médico
                        </Typography>
                        <Typography variant="body2" className="mt-2">
                            Não foi possível carregar os médico. Tente novamente.
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
                                    {["Nome", "Nome social", "E-mail", "CRP", "CPF", "Gênero", "Data de nascimento", ""].map((header, idx) => (
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
                                {users?.length ? users.map((row, index) => (
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
                                            {row?.documentCrp ?? '-'}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: isDarkMode ? '#e2e8f0' : '#1e2939' }}>
                                            {row?.document ?? '-'}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: isDarkMode ? '#e2e8f0' : '#1e2939' }}>
                                            {row?.gender ?? '-'}
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
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" className="text-center">
                                            <div className={`flex items-center justify-center ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
                                                <Typography variant="subtitle1">
                                                    Nenhum médico encontrado
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
                title={`${formModalType === 'create' ? 'Criar' : 'Editar'} Médico`}
                width={1000}
            >
                <form onSubmit={userSubmit(onSubmitUser)}>
                    <div className="grid grid-cols-12 gap-4">
                        <input
                            type="hidden"
                            {...userRegister('id', { valueAsNumber: true })}
                            defaultValue={0}
                        />
                        {errors.id && <p>{errors.id.message}</p>}
                        <input
                            type="hidden"
                            {...userRegister('tenantId', { valueAsNumber: true })}
                            defaultValue={1}
                        />
                        {errors.tenantId && <p>{errors.tenantId.message}</p>}
                        <MuiTextField
                            label="Nome"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...userRegister('name')}
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
                            {...userRegister('nameSecond')}
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
                            {...userRegister('nameCalledBy')}
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
                            {...userRegister('motherName')}
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
                            {...userRegister('document')}
                            defaultValue={selectedRow?.document ?? ''}
                            slotProps={slotProps}
                            size="small"
                            className={`col-span-12 sm:col-span-4 rounded-md`}
                        />
                        {errors.document && <p>{errors.document.message}</p>}
                        <MuiTextField
                            label="CRP"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...userRegister('documentCrp')}
                            defaultValue={selectedRow?.documentCrp ?? ''}
                            slotProps={slotProps}
                            size="small"
                            className={`col-span-12 sm:col-span-4 rounded-md`}
                        />
                        {errors.documentCrp && <p>{errors.documentCrp.message}</p>}
                        <MuiTextField
                            type="date"
                            label="Data de nascimento"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...userRegister('birthDate')}
                            defaultValue={selectedRow?.birthDate ? moment(selectedRow.birthDate).format('YYYY-MM-DD') : ''}
                            slotProps={slotProps}
                            size="small"
                            className={`col-span-12 sm:col-span-4 rounded-md`}
                        />
                        {errors.birthDate && <p>{errors.birthDate.message}</p>}
                        <MuiTextField
                            type="email"
                            label="E-mail"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...userRegister('email')}
                            defaultValue={selectedRow?.email ?? ''}
                            slotProps={slotProps}
                            size="small"
                            className={`col-span-12 sm:col-span-4 rounded-md`}
                        />
                        {errors.email && <p>{errors.email.message}</p>}
                        <MuiTextField
                            type="password"
                            label="Senha"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...userRegister('password')}
                            defaultValue={selectedRow?.email ?? ''}
                            slotProps={slotProps}
                            size="small"
                            className={`col-span-12 sm:col-span-4 rounded-md`}
                        />
                        {errors.password && <p>{errors.password.message}</p>}
                        <MuiTextField
                            label="Telefone"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...userRegister('phone')}
                            defaultValue={selectedRow?.phone ?? ''}
                            slotProps={slotProps}
                            size="small"
                            className={`col-span-12 sm:col-span-4 rounded-md`}
                        />
                        {errors.phone && <p>{errors.phone.message}</p>}
                        <Controller
                            name="gender"
                            control={userControl}
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
                            control={userControl}
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
                title="Excluir Médico"
                width={400}
            >
                <Typography sx={{ mt: 2 }}>Deseja excluir o médico?</Typography>
                <div className="mt-4 flex justify-end gap-4">
                    <form onSubmit={deleteUserSubmit(onDeleteConfirm)}>
                        <input
                            type="hidden"
                            {...deleteUserRegister('id')}
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
        </div>
    );
}