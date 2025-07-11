export interface AccountResponse {
  id: string
  clientId: string
  accountNumber: string
  balance: number
}

export interface CreateAccountRequest {
  clientId: string
  initialBalance: number
  authorisationCode: string
}