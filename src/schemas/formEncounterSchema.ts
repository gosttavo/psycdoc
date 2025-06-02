import {z} from 'zod';

const formInitEncounterSchema = z.object({
    id: z.number().optional(),
    tenantId: z.number(),
    patientId: z.number(),
    userId: z.number(),
    status: z.number(),
});

type FormInitEncounterSchema = z.infer<typeof formInitEncounterSchema>;

const formClinicalEncounterSchema = z.object({
    id: z.number().optional(),
    tenantId: z.number().optional(),
    userId: z.number().optional(),
    patientId: z.number().optional(),
    encounterDate: z.string().optional(),
    status: z.number().optional(),
    paid: z.number().optional(),
    contentHtml: z.string().optional(),
    contentText: z.string().optional(),
    gptResponse: z.string().optional(),
});

type FormClinicalEncounterSchema = z.infer<typeof formClinicalEncounterSchema>;

const formDeleteEncounterSchema = z.object({
    id: z.number()
});

type FormDeleteEncounterSchema = z.infer<typeof formDeleteEncounterSchema>;

const formAiIntegrationSchema = z.object({
    prompt: z.string().min(1, 'Prompt is required'),
});

type FormAiIntegrationSchema = z.infer<typeof formAiIntegrationSchema>;

export {
    formInitEncounterSchema, 
    type FormInitEncounterSchema,
    formClinicalEncounterSchema,
    type FormClinicalEncounterSchema,
    formDeleteEncounterSchema,
    type FormDeleteEncounterSchema,
    formAiIntegrationSchema,
    type FormAiIntegrationSchema
};