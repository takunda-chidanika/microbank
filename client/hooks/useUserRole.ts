import { useSession } from 'next-auth/react'
import { getUserRoles } from '@/lib/jwt-utils'

export interface UserRole {
  isAdmin: boolean
  isUser: boolean
  roles: string[]
  hasRole: (role: string) => boolean
}

export function useUserRole(): UserRole {
  const { data: session } = useSession()
  
  const roles = session?.accessToken 
    ? getUserRoles(session.accessToken, 'microbank-api')
    : []
  
  const isAdmin = roles.includes('ROLE_ADMIN')
  // Users are considered regular users if they have a session but are not admin
  // This handles cases where users don't have explicit ROLE_USER
  const isUser = !!(session && !isAdmin)
  
  const hasRole = (role: string): boolean => {
    return roles.includes(role)
  }
  
  return {
    isAdmin,
    isUser,
    roles,
    hasRole
  }
}