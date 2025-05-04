import {z} from 'zod';

const formUserSchema = z.object({
    id: z.number().optional(),
    tenantId: z.number().min(1, 'Tenant ID is required'),
    name: z.string().min(1, 'Name is required'),
    nameSecond: z.string().optional(),
    nameCalledBy: z.string().optional(),
    motherName: z.string().optional(),
    document: z.string().optional(),
    documentCrm: z.string(),
    birthDate: z.string(),
    gender: z.number().min(1),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    active: z.boolean().optional(),
})

type FormUserSchema = z.infer<typeof formUserSchema>;

export {
    formUserSchema, 
    type FormUserSchema
};