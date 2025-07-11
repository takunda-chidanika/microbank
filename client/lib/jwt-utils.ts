export interface JWTPayload {
  iss?: string
  sub?: string
  aud?: string | string[]
  exp?: number
  nbf?: number
  iat?: number
  jti?: string
  preferred_username?: string
  email?: string
  name?: string
  given_name?: string
  family_name?: string
  resource_access?: {
    [key: string]: {
      roles: string[]
    }
  }
  realm_access?: {
    roles: string[]
  }
  scope?: string
  [key: string]: any
}

export function parseJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error parsing JWT:', error)
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token)
  if (!payload || !payload.exp) return true
  
  const now = Math.floor(Date.now() / 1000)
  return payload.exp < now
}

export function getTokenExpirationTime(token: string): Date | null {
  const payload = parseJWT(token)
  if (!payload || !payload.exp) return null
  
  return new Date(payload.exp * 1000)
}

export function getUserRoles(token: string, resourceId = 'alibou-rest-api'): string[] {
  const payload = parseJWT(token)
  if (!payload) return []
  
  const roles: string[] = []
  
  // Get realm roles
  if (payload.realm_access?.roles) {
    roles.push(...payload.realm_access.roles)
  }
  
  // Get resource-specific roles
  if (payload.resource_access?.[resourceId]?.roles) {
    roles.push(...payload.resource_access[resourceId].roles)
  }
  
  return roles
}

export function debugToken(token: string) {
  const payload = parseJWT(token)
  if (!payload) {
    console.log('❌ Invalid JWT token')
    return
  }
  
  console.log('🔍 JWT Token Debug Info:')
  console.log('👤 Subject:', payload.sub)
  console.log('📧 Email:', payload.email)
  console.log('🏷️ Username:', payload.preferred_username)
  console.log('🕐 Issued At:', new Date((payload.iat || 0) * 1000).toLocaleString())
  console.log('⏰ Expires At:', new Date((payload.exp || 0) * 1000).toLocaleString())
  console.log('🏛️ Issuer:', payload.iss)
  console.log('👥 Audience:', payload.aud)
  console.log('🔒 Scope:', payload.scope)
  console.log('⚡ Expired:', isTokenExpired(token))
  
  // Roles
  const roles = getUserRoles(token)
  console.log('👑 Roles:', roles)
  
  // Full payload
  console.log('📋 Full Payload:', payload)
  
  return payload
}