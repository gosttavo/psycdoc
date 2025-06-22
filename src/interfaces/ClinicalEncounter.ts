import { Patient } from "./Patient";
import { User } from "./User";

export interface ClinicalEncounter {
  id?: number;
  tenantId: number;
  userId: number;
  patientId: number;
  encounterDate: string;
  status: number;
  paid: number;
  contentHtml?: string;
  contentText?: string;
  gptResponse?: string;
  createdAt?: string;
  updatedAt?: string;
  patient?: Patient;
  user?: User;
}

export interface IAICardChat {
  clinicalEncounterId: number;
  onClose: () => void;
}

export interface IReportCard {
  patientId: number;
  patient?: Patient;
  onClose: () => void;
}