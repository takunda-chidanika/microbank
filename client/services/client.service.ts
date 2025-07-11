import { apiGet, apiPost } from '@/lib/api'
import { ClientResponse, CreateClientRequest, LoginRequest } from '@/types'

export class ClientService {
  static async createClient(data: CreateClientRequest): Promise<ClientResponse> {
    return apiPost<ClientResponse>('/clients/register', data, false)
  }

  static async loginClient(data: LoginRequest): Promise<ClientResponse> {
    return apiPost<ClientResponse>('/clients/login', data, false)
  }

  static async getClientProfile(id: string): Promise<ClientResponse> {
    return apiGet<ClientResponse>(`/clients/profile/${id}`)
  }
}