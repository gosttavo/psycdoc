import { useDarkMode } from "../hooks/useDarkMode";
import { formTenantSchema, FormTenantSchema } from "../schemas/formTenantSchema";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    TextField as MuiTextField,
    Button,
} from '@mui/material';
import { useOpenTenant, useUpdateTenant } from "../hooks/useTenant";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { Tenant } from "../interfaces/Tenant";
import { useToast } from "../contexts/ToastContext";

export default function Settings() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const { isDarkMode } = useDarkMode();
    const {
        reset,
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<FormTenantSchema>({
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

    const { mutate: updateTenant } = useUpdateTenant();

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

    const { data } = useOpenTenant(user?.tenantId ?? 0);

    const onSubmitTenant = (data: FormTenantSchema) => {
        try {
            updateTenant(
                {
                    id: user?.tenantId ?? 0,
                    tenant: data as Tenant
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
            description: data?.description ?? '',
            email: data?.email ?? '',
            document: data?.document ?? '',
            addressLine1: data?.addressLine1 ?? '',
            addressLine2: data?.addressLine2 ?? '',
            addressCity: data?.addressCity ?? '',
            addressZipCode: data?.addressZipCode ?? ''
        })
    }, [data, reset]);

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Configurações
                </h1>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">   
                <div className={`flex flex-col flex-1 min-w-[300px] h-full gap-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-xl rounded-2xl p-6 mb-6 border`}>
                    <form
                        onSubmit={handleSubmit(onSubmitTenant)}
                    >
                        <div className="grid grid-cols-12 gap-4">
                            <h2 className={`col-span-12 text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                                Dados da clínica
                            </h2>
                            <input
                                type="hidden"
                                {...register('id', { valueAsNumber: true })}
                                defaultValue={user?.id}
                            />
                            {errors.id && <p> id {errors.id.message}</p>}
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
                                        className={`col-span-12 sm:col-span-4 rounded-md}`}
                                        slotProps={slotProps}
                                    />
                                )}
                            />
                            {errors.description && <p> description {errors.description.message}</p>}
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
                                        className={`col-span-12 sm:col-span-4 rounded-md`}
                                        slotProps={slotProps}
                                    />
                                )}
                            />
                            {errors.email && <p> email {errors.email.message}</p>}
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
                                        className={`col-span-12 sm:col-span-4 rounded-md`}
                                        slotProps={slotProps}
                                    />
                                )}
                            />
                            {errors.document && <p> document {errors.document.message}</p>}
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
                                        className={`col-span-12 sm:col-span-3 rounded-md`}
                                        slotProps={slotProps}
                                    />
                                )}
                            />
                            {errors.addressLine1 && <p> addressLine1 {errors.addressLine1.message}</p>}
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
                                        className={`col-span-12 sm:col-span-3 rounded-md`}
                                        slotProps={slotProps}
                                    />
                                )}
                            />
                            {errors.addressLine2 && <p> addressLine2 {errors.addressLine2.message}</p>}
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
                                        className={`col-span-12 sm:col-span-3 rounded-md`}
                                        slotProps={slotProps}
                                    />
                                )}
                            />
                            {errors.addressCity && <p> addressCity {errors.addressCity.message}</p>}
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
                                        className={`col-span-12 sm:col-span-3 rounded-md`}
                                        slotProps={slotProps}
                                    />
                                )}
                            />
                            {errors.addressZipCode && <p> addressZipCode {errors.addressZipCode.message}</p>}
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
                                        className={`col-span-12 sm:col-span-3 rounded-md`}
                                        slotProps={slotProps}
                                    />
                                )}
                            />
                            {errors.phone && <p> phone {errors.phone.message}</p>}
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
                
            
            </div>
        </div>
    )
}