import {TransactionType} from "@/types/enums";

export interface TransactionResponseDto {
    id: string;
    accountNumber: string;
    amount: string;
    type: TransactionType;
    createdAt: string;
}

export interface AccountTransactionResponseDto {
    accountNumber: string;
    balance: string;
    transactions: TransactionResponseDto[];
}

export interface CreateTransactionRequestDto {
    accountNumber: string;
    amount: string;
    type: TransactionType;
}