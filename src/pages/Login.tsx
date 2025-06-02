import { formLoginSchema, FormLoginSchema } from "../schemas/formLoginSchema";
import { useLogin } from "../hooks/useLogin";
import { useToast } from "../contexts/ToastContext";
import { Button, TextField, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
    const { login: loginToContext } = useAuth();
    const { mutateAsync } = useLogin();
    const { showToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<FormLoginSchema>({
        resolver: zodResolver(formLoginSchema)
    })
    
    const onSubmit = async (data: FormLoginSchema) => {
        try {
            const result = await mutateAsync(data);
            
            if (result?.success) {
                loginToContext({ 
                    success: true, 
                    data: {
                        id: result.data.id,
                        email: result.data.email,
                        tenantId: result.data.tenantId
                    }
                });
            } else {
                showToast(
                    'Credenciais inválidas!',
                    'error'
                );
            }
        } catch (error) {
            showToast(
                'Erro ao realizar login, contate o suporte.',
                'error'
            );
            console.error(error);
        }
    };

    const slotProps = {
        input: {
            style: {
                color: '#000',
            },
        },
        root: {
            sx: {
                '& .MuiInputLabel-root': {
                    color: '#ccc',
                },
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#555',
                },
            }
        }
    }

    return (
        <div className="flex h-screen md:flex-row">
            <section className="hidden md:flex w-1/2 justify-center items-center bg-white">
                <img src="assets/doc.png" alt="A doctor picture" />
            </section>
            <section className="w-full flex flex-col md:w-1/2 justify-center items-center bg-gradient-to-b from-blue-700 to-blue-500">
                <p className="text-white text-5xl font-bold mb-6">
                    PsycDoc
                </p>
                <div className="bg-white rounded-lg p-4">
                    <Typography variant="h5" component="h2" className="mb-6 text-center">
                        Entrar
                    </Typography>
            
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            label="E-mail"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...register('email') }
                            slotProps={slotProps}
                            size="small"
                            type="email"
                            autoComplete="email"
                            className={`col-span-12 sm:col-span-6 rounded-md`}
                        />
                        <TextField
                            label="Senha"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...register('password') }
                            slotProps={slotProps}
                            size="small"
                            type="password"
                            autoComplete="current-password"
                            className={`col-span-12 sm:col-span-6 rounded-md`}
                        />
                        <div className="mt-6 flex">
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={isSubmitting}
                                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                {isSubmitting ? 'Salvando...' : 'Entrar'}
                            </Button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    )
}