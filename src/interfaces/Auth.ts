export interface AuthLoginBody {
    email: string;
    password: string;
}

export interface AuthLoginResponse {
    success: boolean;
    data: {
        id: number;
        email: string;
        tenantId: number;
    };
}
