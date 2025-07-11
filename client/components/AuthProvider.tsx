'use client'

import { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { useAuthUser } from '@/hooks/useAuthUser'

interface AuthProviderProps {
  children: React.ReactNode
  session?: any
}

/**
 * Internal component that handles the auth sync logic
 * This must be inside SessionProvider to access useSession
 */
function AuthSyncHandler({ children }: { children: React.ReactNode }) {
  // This hook automatically syncs NextAuth with Zustand store
  const authUser = useAuthUser()

  useEffect(() => {
    // Log auth state changes for debugging
    console.log('🔐 Auth state changed:', {
      isAuthenticated: authUser.isAuthenticated,
      isLoading: authUser.isLoading,
      keycloakId: authUser.keycloakId,
      clientId: authUser.clientId,
      error: authUser.error,
    })
  }, [authUser.isAuthenticated, authUser.isLoading, authUser.keycloakId, authUser.clientId, authUser.error])

  return <>{children}</>
}

/**
 * Enhanced Auth Provider that combines NextAuth SessionProvider with Zustand user store
 * This provider automatically fetches and stores client details when user logs in
 */
export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider session={session}>
      <AuthSyncHandler>
        {children}
      </AuthSyncHandler>
    </SessionProvider>
  )
}