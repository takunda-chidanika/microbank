export interface ClientResponseDto {
    id: string;
    name: string;
    email: string;
    keycloakId: string;
    createAt: string;
    isBlacklisted: boolean;
}

export interface CreateClientRequestDto {
    name: string;
    email: string;
    password?: string;
}

export interface LoginRequestDto {
    email: string;
    password: string;
}