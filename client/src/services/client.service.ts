import {
    ClientResponseDto,
    CreateClientRequestDto, LoginRequestDto,
} from '@/dtos/client.dto';
import {getStandardHeaders, handleApiResponse} from "@/services/api.utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080';
const CLIENTS_ENDPOINT = `${API_BASE_URL}/api/v1/clients`;

export const clientService = {

    async registerClient(request: CreateClientRequestDto): Promise<ClientResponseDto> {
        const response = await fetch(`${CLIENTS_ENDPOINT}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });
        return handleApiResponse<ClientResponseDto>(response);
    },

    async loginClient(request: LoginRequestDto): Promise<ClientResponseDto> {
        const response = await fetch(`${CLIENTS_ENDPOINT}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });
        return handleApiResponse<ClientResponseDto>(response);
    },

    async fetchClientProfile(id: string): Promise<ClientResponseDto> {
        const response = await fetch(`${CLIENTS_ENDPOINT}/profile/${id}`, {
            method: 'GET',
            headers: getStandardHeaders(true),
        });
        return handleApiResponse<ClientResponseDto>(response);
    },
};