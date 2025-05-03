import { GenericForm } from "../components/Form";
import { formFields, formLoginSchema, FormLoginSchema } from "../schemas/formLoginSchema";
import { useAuth } from '../contexts/AuthContext';
import { useLogin } from "../hooks/useLogin";
import { useToast } from "../contexts/ToastContext";

export default function Login() {
    const { login: loginToContext } = useAuth();
    const { mutateAsync } = useLogin();
    const { showToast } = useToast();
    
    const handleSubmit = async (data: FormLoginSchema) => {
        try {
            const result = await mutateAsync(data);

            if (result?.success) {
                loginToContext({ success: result.success, userId: result.id });
            } else {
                showToast("Credenciais inválidas!", "error");
                throw new Error("Login inválido");
            }
        } catch (err: string | any) {
            showToast("Erro ao realizar login, contate o suporte.", "error");
            throw new Error("Login inválido");
        }
    };

    return (
        <div className="flex h-screen md:flex-row">
            <section className="hidden md:flex w-1/2 justify-center items-center bg-white">
                <img src="assets/doc.png" alt="A doctor picture" />
            </section>
            <section className="w-full flex flex-col md:w-1/2 justify-center items-center bg-gradient-to-b from-blue-700 to-blue-500">
                <p className="text-slate-300 text-5xl font-bold mb-6">
                    PsycDoc
                </p>
                <GenericForm<FormLoginSchema>
                    containerClassName="w-full max-w-sm p-4 bg-slate-200 rounded-lg shadow-md"
                    fieldsContainerClassName="w-full flex flex-col gap-4"
                    fields={formFields}
                    schema={formLoginSchema}
                    onSubmit={handleSubmit}
                    formTitle="Entrar"
                    submitButtonText="Entrar"
                />
            </section>
        </div>
    )
}