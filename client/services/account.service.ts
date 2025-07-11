import { apiGet, apiPost } from '@/lib/api'
import { AccountResponse, CreateAccountRequest } from '@/types'

export class AccountService {
  static async createAccount(data: CreateAccountRequest): Promise<AccountResponse> {
    return apiPost<AccountResponse>('/banks/accounts', data)
  }

  static async getAccountById(id: string): Promise<AccountResponse> {
    return apiGet<AccountResponse>(`/banks/accounts/${id}`)
  }

  static async getAccountByClientId(clientId: string): Promise<AccountResponse> {
    return apiGet<AccountResponse>(`/banks/accounts/client/${clientId}`)
  }

  static async getAccountByNumber(accountNumber: string): Promise<AccountResponse> {
    return apiGet<AccountResponse>(`/banks/accounts/number/${accountNumber}`)
  }

  static async getAllAccounts(): Promise<AccountResponse[]> {
    return apiGet<AccountResponse[]>('/banks/accounts')
  }

  static async getAccountBalance(accountNumber: string): Promise<number> {
    return apiGet<number>(`/banks/accounts/balance/${accountNumber}`)
  }
}