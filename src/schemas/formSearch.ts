import {z} from 'zod';
import { FormField } from '../components/Form';

const formSearchSchema = z.object({
    searchText: z
        .string()
        .min(1, 'Search is required')
        .max(100, 'Search must be less than 100 characters'),
});

const formFields: FormField[] = [
    {
        name: 'searchText',
        label: 'Search',
        type: 'text',
        defaultValue: '',
        textFieldProps: {
            placeholder: 'Search',
            required: true,
            autoComplete: 'off',
        },
    }
];

type FormSearchSchema = z.infer<typeof formSearchSchema>;

export {formSearchSchema, type FormSearchSchema, formFields};