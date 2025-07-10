import {
    AccountTransactionResponseDto,
    CreateTransactionRequestDto,
    TransactionResponseDto,
} from '@/dtos/transaction.dto';
import {getStandardHeaders, handleApiResponse} from "@/services/api.utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080';
const TRANSACTIONS_ENDPOINT = `${API_BASE_URL}/api/v1/banks/transactions`;

export const transactionService = {

    async getAllTransactions(): Promise<TransactionResponseDto[]> {
        const response = await fetch(TRANSACTIONS_ENDPOINT, {
            method: 'GET',
            headers: getStandardHeaders(true), // Requires authorization
        });
        return handleApiResponse<TransactionResponseDto[]>(response);
    },

    async createTransaction(request: CreateTransactionRequestDto): Promise<TransactionResponseDto> {
        const response = await fetch(TRANSACTIONS_ENDPOINT, {
            method: 'POST',
            headers: getStandardHeaders(true),
            body: JSON.stringify(request),
        });
        return handleApiResponse<TransactionResponseDto>(response);
    },

    async getTransactionsByAccountNumber(accountNumber: string): Promise<TransactionResponseDto[]> {
        const response = await fetch(`${TRANSACTIONS_ENDPOINT}/account/${accountNumber}`, {
            method: 'GET',
            headers: getStandardHeaders(true),
        });
        return handleApiResponse<TransactionResponseDto[]>(response);
    },

    async getAllTransactionsByAccountNumber(accountNumber: string): Promise<AccountTransactionResponseDto> {
        const response = await fetch(`${TRANSACTIONS_ENDPOINT}/account/${accountNumber}/details`, {
            method: 'GET',
            headers: getStandardHeaders(true),
        });
        return handleApiResponse<AccountTransactionResponseDto>(response);
    },

    async getTransactionById(transactionId: string): Promise<TransactionResponseDto> {
        const response = await fetch(`${TRANSACTIONS_ENDPOINT}/${transactionId}`, {
            method: 'GET',
            headers: getStandardHeaders(true),
        });
        return handleApiResponse<TransactionResponseDto>(response);
    },

    async getTransactionsByDateRange(
        accountNumber: string,
        startDate: string,
        endDate: string
    ): Promise<TransactionResponseDto[]> {
        const url = new URL(`${TRANSACTIONS_ENDPOINT}/account/${accountNumber}/date-range`);
        url.searchParams.append('startDate', startDate);
        url.searchParams.append('endDate', endDate);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: getStandardHeaders(true),
        });
        return handleApiResponse<TransactionResponseDto[]>(response);
    },
};