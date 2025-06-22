import { useDarkMode } from "../hooks/useDarkMode";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    TextField as MuiTextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { formUserSchema, FormUserSchema } from "../schemas/formUserSchema";
import moment from "moment";
import { useUpdateUser } from "../hooks/useUser";
import { useToast } from "../contexts/ToastContext";
import { User } from "../interfaces/User";

export default function Settings() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const {
        reset,
        handleSubmit,
        register: userRegister,
        control: userControl,
        formState: { errors },
    } = useForm<FormUserSchema>({
        resolver: zodResolver(formUserSchema),
        defaultValues: {
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
            active: 0
        }
    });

    const { mutate: updateUser } = useUpdateUser();

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
    };

    const onSubmitProfile = (data: FormUserSchema) => {
        try {
            if ('password' in data) {
                delete (data as User).password;
            }

            updateUser(
                {
                    id: user?.id ?? 0,
                    user: data as User
                },
                {
                    onSuccess: () => {
                        showToast(
                            'Médico atualizado com sucesso!',
                            'success'
                        );
                        reset();
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
    }

    useEffect(() => {
        reset({
            id: user?.id ?? 0,
            tenantId: user?.tenantId ?? 0,
            name: user?.name ?? '',
            nameSecond: user?.nameSecond ?? '',
            nameCalledBy: user?.nameCalledBy ?? '',
            motherName: user?.motherName ?? '',
            document: user?.document ?? '',
            documentCrp: user?.documentCrp ?? '',
            birthDate: user?.birthDate ?? '',
            gender: user?.gender ?? 0,
            phone: user?.phone ?? '',
            email: user?.email ?? '',
            active: user?.active ?? 0
        })
    }, [user, reset]);

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Perfil
                </h1>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">   
                <div className={`flex flex-col flex-1 min-w-[300px] h-full gap-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-2xl p-6 mb-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <form
                        onSubmit={handleSubmit(onSubmitProfile)}
                    >
                        <div className="grid grid-cols-12 gap-4">
                            <h2 className={`col-span-12 text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                                Dados da clínica
                            </h2>
                            <input
                                type="hidden"
                                {...userRegister('id', { valueAsNumber: true })}
                                defaultValue={user?.id}
                            />
                            {errors.id && <p> id {errors.id.message}</p>}
                            <input
                                type="hidden"
                                {...userRegister('tenantId', { valueAsNumber: true })}
                                defaultValue={user?.tenantId}
                            />
                            {errors.tenantId && <p> tenantId {errors.tenantId.message}</p>}
                            <MuiTextField
                                label="Nome"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                {...userRegister('name')}
                                defaultValue={user?.name ?? ''}
                                slotProps={slotProps}
                                size="small"
                                className={`col-span-12 sm:col-span-4 rounded-md`}
                            />
                            {errors.name && <p> name {errors.name.message}</p>}
                            <MuiTextField
                                label="Sobrenome"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                {...userRegister('nameSecond')}
                                defaultValue={user?.nameSecond ?? ''}
                                slotProps={slotProps}
                                size="small"
                                className={`col-span-12 sm:col-span-4 rounded-md`}
                            />
                            {errors.nameSecond && <p> nameSecond {errors.nameSecond.message}</p>}
                            <MuiTextField
                                label="Nome social"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                {...userRegister('nameCalledBy')}
                                defaultValue={user?.nameCalledBy ?? ''}
                                slotProps={slotProps}
                                size="small"
                                className={`col-span-12 sm:col-span-4 rounded-md`}
                            />
                            {errors.nameCalledBy && <p> nameCalledBy {errors.nameCalledBy.message}</p>}
                            <MuiTextField
                                label="Nome da mãe"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                {...userRegister('motherName')}
                                defaultValue={user?.motherName ?? ''}
                                slotProps={slotProps}
                                size="small"
                                className={`col-span-12 sm:col-span-4 rounded-md`}
                            />
                            {errors.motherName && <p> motherName {errors.motherName.message}</p>}
                            <MuiTextField
                                label="CPF"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                {...userRegister('document')}
                                defaultValue={user?.document ?? ''}
                                slotProps={slotProps}
                                size="small"
                                className={`col-span-12 sm:col-span-4 rounded-md`}
                            />
                            {errors.document && <p> document {errors.document.message}</p>}
                            <MuiTextField
                                label="CRP"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                {...userRegister('documentCrp')}
                                defaultValue={user?.documentCrp ?? ''}
                                slotProps={slotProps}
                                size="small"
                                className={`col-span-12 sm:col-span-4 rounded-md`}
                            />
                            {errors.documentCrp && <p> documentCrp {errors.documentCrp.message}</p>}
                            <MuiTextField
                                type="date"
                                label="user de nascimento"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                {...userRegister('birthDate')}
                                defaultValue={user?.birthDate ? moment(user.birthDate).format('YYYY-MM-DD') : ''}
                                slotProps={slotProps}
                                size="small"
                                className={`col-span-12 sm:col-span-4 rounded-md`}
                                InputLabelProps={{ shrink: true }}
                            />
                            {errors.birthDate && <p> birthDate {errors.birthDate.message}</p>}
                            <MuiTextField
                                type="email"
                                label="E-mail"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                {...userRegister('email')}
                                defaultValue={user?.email ?? ''}
                                slotProps={slotProps}
                                size="small"
                                className={`col-span-12 sm:col-span-4 rounded-md`}
                            />
                            {errors.email && <p> email {errors.email.message}</p>}
                            <MuiTextField
                                label="Telefone"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                {...userRegister('phone')}
                                defaultValue={user?.phone ?? ''}
                                slotProps={slotProps}
                                size="small"
                                className={`col-span-12 sm:col-span-4 rounded-md`}
                            />
                            {errors.phone && <p> phone {errors.phone.message}</p>}
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
                                type="reset"
                                onClick={() => { reset() }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                type="submit"
                            >
                                Salvar
                            </Button>
                        </div>
                    </form>
                </div>
                
                <div className={`flex flex-col min-w-[300px] gap-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-2xl p-6 mb-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Tema
                    </h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Escolha entre o modo claro ou escuro para a interface.
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        O modo escuro é mais confortável para os olhos em ambientes com pouca luz.
                    </p>
                    <div className="mt-28"></div>
                    <Button
                        className={`px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ease-in-out border 
                            ${isDarkMode 
                                ? 'bg-gray-700 text-blue-300 hover:bg-gray-600 border-gray-600' 
                                : 'bg-slate-100 text-blue-600 hover:bg-slate-200 border-slate-300'
                            }`}
                        onClick={toggleDarkMode}
                        variant="contained"
                        type="button"
                    >
                        {isDarkMode ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span>Light Mode</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                                <span>Dark Mode</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}