import {z} from 'zod';
import { FormField } from '../components/Form';

const formLoginSchema = z.object({
    email: z
        .string()
        .email('Email is not valid')
        .min(1, 'Email is required')
        .max(100, 'Email must be less than 100 characters'),
    password: z
        .string()
        .min(1, 'Password is required')
        .max(100, 'Password must be less than 100 characters'),
    rememberMe: z.boolean().optional(),
});

const formFields: FormField[] = [
    {
        name: 'email',
        label: 'E-mail',
        type: 'email',
        defaultValue: '',
        textFieldProps: {
            placeholder: 'Email',
            required: true,
            autoComplete: 'email',
        },
    },
    {
        name: 'password',
        label: 'Senha',
        type: 'password',
        defaultValue: '',
        textFieldProps: {
            placeholder: 'Senha',
            required: true,
            autoComplete: 'current-password',
        },
    }
];

type FormLoginSchema = z.infer<typeof formLoginSchema>;

export {formLoginSchema, type FormLoginSchema, formFields};