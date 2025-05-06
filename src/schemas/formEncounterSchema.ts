import {z} from 'zod';

const formInitEncounterSchema = z.object({
    id: z.number().optional(),
    patient: z.number().min(1, 'Patient is required'),
    status: z.number().min(1, 'Status is required'),
})

type FormInitEncounterSchema = z.infer<typeof formInitEncounterSchema>;

const formClinicalEncounterSchema = z.object({
    id: z.number().optional(),
    tenantId: z.number().min(1, 'Tenant is required'),
    userId: z.number().min(1, 'User is required'),
    patientId: z.number().min(1, 'Patient is required'),
    encounterDate: z.string().min(1, 'Encounter date is required'),
    status: z.number().optional(),
    paid: z.number().optional(),
    contentHtml: z.string().optional(),
    contentText: z.string().optional(),
    gptResponse: z.string().optional(),
})

type FormClinicalEncounterSchema = z.infer<typeof formClinicalEncounterSchema>;

const formDeleteEncounterSchema = z.object({
    id: z.number()
})

type FormDeleteEncounterSchema = z.infer<typeof formDeleteEncounterSchema>;

export {
    formInitEncounterSchema, 
    type FormInitEncounterSchema,
    formClinicalEncounterSchema,
    type FormClinicalEncounterSchema,
    formDeleteEncounterSchema,
    type FormDeleteEncounterSchema
};