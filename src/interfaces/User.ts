export interface User {
    id: number;
    tenantId: number;
    name: string;
    nameSecond: string;
    nameCalledBy: string;
    document: string;
    documentCrm: string;
    birthDate: string;
    gender: number;
    phone: string;
    email: string;
    password?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}