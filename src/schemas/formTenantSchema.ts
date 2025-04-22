import {z} from 'zod';

const formTenantSchema = z.object({
    description: z
        .string()
        .min(1, 'Description is required')
        .max(100, 'Description must be less than 100 characters'),
    email: z
        .string()
        .email('Email is not valid')
        .min(1, 'Email is required')
        .max(100, 'Email must be less than 100 characters'),
    addressLine1: z
        .string()
        .min(1, 'Address Line 1 is required')
        .max(100, 'Address Line 1 must be less than 100 characters'),
    addressLine2: z
        .string()
        .optional(),
    addressCity: z
        .string()
        .min(1, 'City is required')
        .max(100, 'City must be less than 100 characters'),
    addressZipCode: z
        .string()
        .min(1, 'Zip Code is required')
        .max(10, 'Zip Code must be less than 10 characters'),
    document: z
        .string()
        .min(1, 'Document is required')
        .max(14, 'Document must be less than 14 characters'),
    phone: z
        .string()
        .min(1, 'Phone is required')
        .max(15, 'Phone must be less than 15 characters')
});

type FormTenantSchema = z.infer<typeof formTenantSchema>;

export {formTenantSchema, type FormTenantSchema};