export interface User {
    id: number;
    tenantId: number;
    name: string;
    nameSecond: string;
    nameCalledBy: string;
    motherName: string;
    document: string;
    documentCrp: string;
    birthDate: string;
    gender: number;
    phone: string;
    email: string;
    password?: string;
    active: number;
    createdAt: string;
    updatedAt: string;
}