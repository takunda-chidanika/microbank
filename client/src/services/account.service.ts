import {
    AccountResponseDto,
    CreateAccountRequestDto,
} from '@/dtos/account.dto';
import {getStandardHeaders, handleApiResponse} from "@/services/api.utils";


const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080';
const ACCOUNTS_ENDPOINT = `${API_BASE_URL}/api/v1/banks/accounts`;


export const accountService = {

    async createAccount(request: CreateAccountRequestDto): Promise<AccountResponseDto> {
        const response = await fetch(ACCOUNTS_ENDPOINT, {
            method: 'POST',
            headers: getStandardHeaders(true),
            body: JSON.stringify(request),
        });
        return handleApiResponse<AccountResponseDto>(response);
    },

    async getAccountByClientId(clientId: string): Promise<AccountResponseDto> {
        const response = await fetch(`${ACCOUNTS_ENDPOINT}/client/${clientId}`, {
            method: 'GET',
            headers: getStandardHeaders(true),
        });
        return handleApiResponse<AccountResponseDto>(response);
    },

    async getAccountById(id: string): Promise<AccountResponseDto> {
        const response = await fetch(`${ACCOUNTS_ENDPOINT}/${id}`, {
            method: 'GET',
            headers: getStandardHeaders(true),
        });
        return handleApiResponse<AccountResponseDto>(response);
    },

    async getAccountByAccountNumber(accountNumber: string): Promise<AccountResponseDto> {
        const response = await fetch(`${ACCOUNTS_ENDPOINT}/number/${accountNumber}`, {
            method: 'GET',
            headers: getStandardHeaders(true),
        });
        return handleApiResponse<AccountResponseDto>(response);
    },

    async getAllAccounts(): Promise<AccountResponseDto[]> {
        const response = await fetch(ACCOUNTS_ENDPOINT, {
            method: 'GET',
            headers: getStandardHeaders(true),
        });
        return handleApiResponse<AccountResponseDto[]>(response);
    },

    async getAccountBalance(accountNumber: string): Promise<string> {
        const response = await fetch(`${ACCOUNTS_ENDPOINT}/balance/${accountNumber}`, {
            method: 'GET',
            headers: getStandardHeaders(true),
        });

        return handleApiResponse<string>(response);
    },
};