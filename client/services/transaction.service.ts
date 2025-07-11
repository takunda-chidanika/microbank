import { apiGet, apiPost } from '@/lib/api'
import { TransactionResponse, CreateTransactionRequest, AccountTransactionResponse } from '@/types'

export class TransactionService {
  static async createTransaction(data: CreateTransactionRequest): Promise<TransactionResponse> {
    return apiPost<TransactionResponse>('/banks/transactions', data)
  }

  static async getAllTransactions(): Promise<TransactionResponse[]> {
    return apiGet<TransactionResponse[]>('/banks/transactions')
  }

  static async getTransactionById(id: string): Promise<TransactionResponse> {
    return apiGet<TransactionResponse>(`/banks/transactions/${id}`)
  }

  static async getTransactionsByAccountNumber(accountNumber: string): Promise<TransactionResponse[]> {
    return apiGet<TransactionResponse[]>(`/banks/transactions/account/${accountNumber}`)
  }

  static async getAccountWithTransactions(accountNumber: string): Promise<AccountTransactionResponse> {
    return apiGet<AccountTransactionResponse>(`/banks/transactions/account/${accountNumber}/details`)
  }

  static async getTransactionsByDateRange(
    accountNumber: string,
    startDate: string,
    endDate: string
  ): Promise<TransactionResponse[]> {
    const params = new URLSearchParams({
      startDate,
      endDate,
    })
    return apiGet<TransactionResponse[]>(`/banks/transactions/account/${accountNumber}/date-range?${params}`)
  }
}