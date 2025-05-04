import { Patient } from "./Patient";
import { User } from "./User";

export interface ClinicalEncounter {
    id?: number;
    tenantId: number;
    userId: number;
    patientId: number;
    encounterDate: string;
    status: number;
    paid: boolean;
    contentHtml: string;
    contentText: string;
    gptResponse: string;
    createdAt: string;
    updatedAt: string;
    patient?: Patient;
    user?: User;
  }