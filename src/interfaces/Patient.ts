export interface Patient {
    id: number;
    tenantId: number;
    name: string;
    nameSecond: string;
    nameCalledBy: string;
    motherName: string;
    document: string;
    birthDate: string;
    gender: number;
    phone: string;
    email: string;
    active: number;
    createdAt: string;
    updatedAt: string;
}