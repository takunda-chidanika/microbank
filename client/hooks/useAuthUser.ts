import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useUserStore } from '@/store/userStore'

/**
 * Custom hook that integrates NextAuth session with Zustand user store
 * Automatically fetches and stores client profile when user logs in
 */
export function useAuthUser() {
  const { data: session, status } = useSession()
  
  // Use direct store access to avoid infinite loop issues
  const keycloakId = useUserStore((state) => state.keycloakId)
  const clientId = useUserStore((state) => state.clientId)
  const profile = useUserStore((state) => state.profile)
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const isLoading = useUserStore((state) => state.isLoading)
  const error = useUserStore((state) => state.error)
  
  // Action functions
  const fetchClientProfile = useUserStore((state) => state.fetchClientProfile)
  const clearUser = useUserStore((state) => state.clearUser)
  const setError = useUserStore((state) => state.setError)

  useEffect(() => {
    const handleAuthState = async () => {
      if (status === 'loading') {
        // NextAuth is still loading, do nothing
        return
      }

      if (status === 'unauthenticated') {
        // User is not authenticated, clear store
        console.log('🔐 User unauthenticated, clearing store')
        clearUser()
        return
      }

      if (status === 'authenticated' && session?.user) {
        // Extract Keycloak ID from session
        const keycloakIdFromSession = getKeycloakIdFromSession(session)
        
        if (!keycloakIdFromSession) {
          console.error('❌ No Keycloak ID found in session')
          setError('No user identifier found in session')
          return
        }

        console.log('🔍 Session comparison:', {
          'Current stored Keycloak ID': keycloakId,
          'Session Keycloak ID': keycloakIdFromSession,
          'Are they equal?': keycloakId === keycloakIdFromSession,
          'Is authenticated?': isAuthenticated
        })

        // Check if we already have this user's data  
        if (keycloakId === keycloakIdFromSession && isAuthenticated) {
          console.log('✅ User data already loaded for:', keycloakId)
          return
        }

        // Fetch fresh client profile
        console.log('🔄 Fetching client profile for authenticated user:', keycloakIdFromSession)
        console.log('🔄 API call will be: /clients/profile/keycloak/' + keycloakIdFromSession)
        await fetchClientProfile(keycloakIdFromSession)
      }
    }

    handleAuthState()
  }, [session, status, keycloakId, fetchClientProfile, clearUser, setError])

  return {
    // User data
    keycloakId,
    clientId,
    profile,
    
    // Auth status
    isAuthenticated: isAuthenticated && status === 'authenticated',
    isLoading: isLoading || status === 'loading',
    error,
    
    // Session data
    session,
    sessionStatus: status,
    
    // Actions (individual functions to avoid object creation)
    fetchClientProfile,
    clearUser,
    setError,
  }
}

/**
 * Extract Keycloak ID from NextAuth session
 * The Keycloak ID should be the 'sub' claim from the JWT token, NOT the email
 */
function getKeycloakIdFromSession(session: any): string | null {
  console.log('🔍 Extracting Keycloak ID from session:', session)
  
  // Priority order: JWT sub claim is the actual Keycloak user ID
  const possibleKeycloakIds = [
    session?.accessToken,          // Full access token for parsing
    session?.token?.sub,           // JWT sub claim (most reliable)
    (session as any)?.token?.sub,  // Type assertion fallback
    session?.user?.id,             // User ID (less reliable)
  ]

  // First, try to get from access token if it's a JWT
  const accessToken = session?.accessToken
  if (accessToken && typeof accessToken === 'string') {
    try {
      // Parse JWT token to get sub claim
      const tokenParts = accessToken.split('.')
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]))
        console.log('🔍 JWT payload:', payload)
        if (payload.sub) {
          console.log('✅ Found Keycloak ID from JWT sub:', payload.sub)
          return payload.sub
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to parse JWT token:', error)
    }
  }

  // Fallback to other possible locations
  for (const id of possibleKeycloakIds.slice(1)) { // Skip accessToken since we already processed it
    if (id && typeof id === 'string' && id.trim().length > 0) {
      // Make sure it's not an email (Keycloak IDs are usually UUIDs)
      if (!id.includes('@')) {
        console.log('✅ Found Keycloak ID from session property:', id)
        return id.trim()
      }
    }
  }

  console.error('❌ No valid Keycloak ID found in session')
  return null
}

/**
 * Hook for components that only need user data (optimized)
 */
export function useUserProfile() {
  const keycloakId = useUserStore((state) => state.keycloakId)
  const clientId = useUserStore((state) => state.clientId)
  const profile = useUserStore((state) => state.profile)
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  
  return {
    keycloakId,
    clientId,
    profile,
    isAuthenticated,
  }
}

/**
 * Hook for checking authentication status
 */
export function useAuthStatus() {
  const { status } = useSession()
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const isLoading = useUserStore((state) => state.isLoading)
  const error = useUserStore((state) => state.error)
  
  return {
    isAuthenticated: isAuthenticated && status === 'authenticated',
    isLoading: isLoading || status === 'loading',
    error,
  }
}