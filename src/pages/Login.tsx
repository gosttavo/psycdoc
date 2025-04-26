import { GenericForm } from "../components/Form";
import { formFields, formLoginSchema, FormLoginSchema } from "../schemas/formLoginSchema";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert } from "@mui/material";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const handleSubmit = async (data: FormLoginSchema) => {
        try {
            console.log('Login attempt with:', data);
            login(data);
            navigate('/');
        } catch (error) {
            <Alert severity="error">E-mail ou senha inválidos.</Alert>
            console.error('Login failed:', error);
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