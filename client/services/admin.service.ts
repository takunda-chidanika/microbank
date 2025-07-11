import { apiGet, apiPatch } from '@/lib/api'
import { ClientResponse } from '@/types'

export class AdminService {
  static async getAllClients(): Promise<ClientResponse[]> {
    return apiGet<ClientResponse[]>('/clients/admin')
  }

  static async blacklistClient(clientId: string): Promise<ClientResponse> {
    return apiPatch<ClientResponse>(`/clients/admin/${clientId}/blacklist`)
  }

  static async unblacklistClient(clientId: string): Promise<ClientResponse> {
    return apiPatch<ClientResponse>(`/clients/admin/${clientId}/unblacklist`)
  }
}