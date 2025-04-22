
import { useDarkMode } from "../hooks/useDarkMode";
import { formTenantSchema, FormTenantSchema } from "../schemas/formTenantSchema";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    TextField as MuiTextField,
    Button,
} from '@mui/material';

export default function Settings() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const { reset, handleSubmit, control } = useForm<FormTenantSchema>({
        resolver: zodResolver(formTenantSchema),
        defaultValues: {
            description: '',
            email: '',
            addressLine1: '',
            addressLine2: '',
            addressCity: '',
            addressZipCode: '',
            document: '',
            phone: ''
        }
    });

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Configurações
                </h1>
            </div>

            <div className={`flex flex-col gap-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-2xl p-6 mb-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <form
                    onSubmit={handleSubmit(async () => {
                        console.log('Form submitted');
                    })}
                >
                    <div className="grid grid-cols-12 gap-4">
                        <h2 className={`col-span-12 text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                            Dados da clínica
                        </h2>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <MuiTextField
                                    {...field}
                                    size="small"
                                    type="text"
                                    label="Clínica"
                                    placeholder="Clínica"
                                    className={`col-span-4 xs:col-span-12 rounded-md}`}
                                />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <MuiTextField
                                    {...field}
                                    size="small"
                                    type="email"
                                    label="Email"
                                    placeholder="Email"
                                    className={`col-span-4 xs:col-span-12 rounded-md`}
                                />
                            )}
                        />
                        <Controller
                            name="addressLine1"
                            control={control}
                            render={({ field }) => (
                                <MuiTextField
                                    {...field}
                                    size="small"
                                    type="text"
                                    label="Endereço"
                                    placeholder="Endereço"
                                    className={`col-span-4 xs:col-span-12 rounded-md`}
                                />
                            )}
                        />
                        <Controller
                            name="addressLine2"
                            control={control}
                            render={({ field }) => (
                                <MuiTextField
                                    {...field}
                                    size="small"
                                    type="text"
                                    label="Complemento"
                                    placeholder="Complemento"
                                    className={`col-span-4 xs:col-span-12 rounded-md`}
                                />
                            )}
                        />
                        <Controller
                            name="addressCity"
                            control={control}
                            render={({ field }) => (
                                <MuiTextField
                                    {...field}
                                    size="small"
                                    type="text"
                                    label="Cidade"
                                    placeholder="Cidade"
                                    className={`col-span-4 xs:col-span-12 rounded-md`}
                                />
                            )}
                        />
                        <Controller
                            name="addressZipCode"
                            control={control}
                            render={({ field }) => (
                                <MuiTextField
                                    {...field}
                                    size="small"
                                    type="text"
                                    label="CEP"
                                    placeholder="CEP"
                                    className={`col-span-4 xs:col-span-12 rounded-md`}
                                />
                            )}
                        />
                        <Controller
                            name="document"
                            control={control}
                            render={({ field }) => (
                                <MuiTextField
                                    {...field}
                                    size="small"
                                    type="text"
                                    label="CNPJ"
                                    placeholder="CNPJ"
                                    className={`col-span-4 xs:col-span-12 rounded-md`}
                                />
                            )}
                        />
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <MuiTextField
                                    {...field}
                                    size="small"
                                    type="text"
                                    label="Telefone"
                                    placeholder="Telefone"
                                    className={`col-span-4 xs:col-span-12 rounded-md`}
                                />
                            )}
                        />
                    </div>
                    <div className="mt-4 flex justify-end gap-4">
                        <Button
                            variant="outlined"
                            type="reset"
                            onClick={() => {
                                console.log('Form reset');
                                reset();
                            }}
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

            <div className={`flex flex-col gap-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-2xl p-6 mb-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Tema
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Escolha entre o modo claro ou escuro para a interface.
                </p>

                <Button 
                    className={`mt-4 px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ease-in-out border 
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
    )
}