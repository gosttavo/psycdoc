export function mapEncounterStatus(status: number): string {
    switch (status) {
        case 0:
            return 'Agendado';
        case 1:
            return 'Iniciado';
        case 2:
            return 'Concluído';
        case 3:
            return 'Cancelado';
        case 4:
            return 'Faltante';
        default:
            return 'Agendado';
    }
};

export function mapPaidStatus(status: number): string {
    switch (status) {
        case 0:
            return 'Não pago';
        case 1:
            return 'Pago';
        default:
            return 'Não pago';
    }
};

export function mapGender(gender: number): string {
    switch (gender) {
        case 0:
            return 'Masculino';
        case 1:
            return 'Feminino';
        default:
            return 'Outro';
    }
};