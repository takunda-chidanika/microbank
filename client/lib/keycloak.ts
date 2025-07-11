interface KeycloakUser {
  username: string
  email: string
  firstName: string
  lastName: string
  password: string
}

interface KeycloakResponse {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  emailVerified: boolean
  enabled: boolean
}

export class KeycloakService {
  private static baseUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080'
  private static realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'microbank'
  private static clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'microbank-frontend'
  private static adminUser = process.env.KEYCLOAK_ADMIN_USER || 'admin'
  private static adminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin'

  static async getAdminToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/realms/master/protocol/openid-connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: 'admin-cli',
        username: this.adminUser,
        password: this.adminPassword,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get admin token')
    }

    const data = await response.json()
    return data.access_token
  }

  static async createUser(userData: KeycloakUser): Promise<KeycloakResponse> {
    const adminToken = await this.getAdminToken()
    
    const keycloakUserData = {
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      enabled: true,
      emailVerified: true,
      credentials: [{
        type: 'password',
        value: userData.password,
        temporary: false,
      }],
      realmRoles: ['USER'],
    }

    const response = await fetch(`${this.baseUrl}/admin/realms/${this.realm}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(keycloakUserData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.errorMessage || 'Failed to create user in Keycloak')
    }

    // Get the created user ID from the Location header
    const location = response.headers.get('Location')
    const userId = location?.split('/').pop()

    if (!userId) {
      throw new Error('Failed to get user ID from Keycloak response')
    }

    // Return the created user data
    return {
      id: userId,
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      emailVerified: true,
      enabled: true,
    }
  }

  static async getUserByEmail(email: string): Promise<KeycloakResponse | null> {
    const adminToken = await this.getAdminToken()
    
    const response = await fetch(`${this.baseUrl}/admin/realms/${this.realm}/users?email=${email}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return null
    }

    const users = await response.json()
    return users.length > 0 ? users[0] : null
  }
}