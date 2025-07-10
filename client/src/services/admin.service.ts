import { ClientResponseDto } from '@/dtos/client.dto';
import {getStandardHeaders, handleApiResponse} from "@/services/api.utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080';
const ADMIN_CLIENTS_ENDPOINT = `${API_BASE_URL}/api/v1/clients/admin`;

export const adminService = {
    async blacklistClient(clientId: string): Promise<ClientResponseDto> {
        const response = await fetch(`${ADMIN_CLIENTS_ENDPOINT}/${clientId}/blacklist`, {
            method: 'PATCH',
            headers: getStandardHeaders(true), // Include auth token
        });
        return handleApiResponse<ClientResponseDto>(response);
    },

    async unblacklistClient(clientId: string): Promise<ClientResponseDto> {
        const response = await fetch(`${ADMIN_CLIENTS_ENDPOINT}/${clientId}/unblacklist`, {
            method: 'PATCH',
            headers: getStandardHeaders(true), // Include auth token
        });
        return handleApiResponse<ClientResponseDto>(response);
    },

    async getAllClients(): Promise<ClientResponseDto[]> {
        const response = await fetch(ADMIN_CLIENTS_ENDPOINT, {
            method: 'GET',
            headers: getStandardHeaders(true), // Include auth token
        });
        return handleApiResponse<ClientResponseDto[]>(response);
    },
};