export interface ClientResponse {
  id: string
  name: string
  email: string
  keycloakId: string
  createAt: string
  isBlacklisted: boolean
}

export interface CreateClientRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}