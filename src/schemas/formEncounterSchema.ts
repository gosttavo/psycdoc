import {z} from 'zod';

const formInitEncounterSchema = z.object({
    patient: z.number().min(1, 'Patient is required'),
    status: z.number().min(1, 'Status is required'),
})

type FormInitEncounterSchema = z.infer<typeof formInitEncounterSchema>;

export {
    formInitEncounterSchema, 
    type FormInitEncounterSchema
};