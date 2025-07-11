import { TransactionType } from './enums'

export interface TransactionResponse {
  id: string
  accountNumber: string
  amount: number
  type: TransactionType
  createdAt: string
}

export interface CreateTransactionRequest {
  accountNumber: string
  amount: number
  type: TransactionType
}

export interface AccountTransactionResponse {
  account: {
    id: string
    clientId: string
    accountNumber: string
    balance: number
  }
  transactions: TransactionResponse[]
}