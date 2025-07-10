export interface AccountResponseDto {
    id: string;
    clientId: string;
    accountNumber: string;
    balance: string;
}

export interface CreateAccountRequestDto {
    clientId: string;
    initialBalance: string;
    authorisationCode: string;
}