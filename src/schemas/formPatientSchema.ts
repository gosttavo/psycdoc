import {z} from 'zod';

const formPatientSchema = z.object({
    id: z.number().optional(),
    tenantId: z.number().min(1, 'Tenant ID is required'),
    name: z.string().min(1, 'Name is required'),
    nameSecond: z.string().optional(),
    nameCalledBy: z.string().optional(),
    motherName: z.string().optional(),
    document: z.string().optional(),
    birthDate: z.string(),
    gender: z.number().min(1),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
})

type FormPatientSchema = z.infer<typeof formPatientSchema>;

export {
    formPatientSchema, 
    type FormPatientSchema
};