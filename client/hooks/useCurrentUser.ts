import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { ClientService } from '@/services/client.service'
import { ClientResponse } from '@/types'

interface CurrentUser {
  keycloakId: string
  clientId: string
  profile: ClientResponse | null
}

export function useCurrentUser() {
  const { data: session, status } = useSession()
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        if (status === 'authenticated' && session?.user) {
          // In Keycloak, the user ID is stored in the 'sub' claim
          const keycloakId = (session.user as any).id || (session as any).token?.sub || session.user.email
          
          if (!keycloakId) {
            setError('No user identifier found in session')
            return
          }

          // Get client profile from backend
          const clientProfile = await ClientService.getClientProfileByKeycloakId(keycloakId)
          
          setCurrentUser({
            keycloakId,
            clientId: clientProfile.id,
            profile: clientProfile
          })
        } else if (status === 'unauthenticated') {
          setCurrentUser(null)
          setError('User not authenticated')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user profile')
        setCurrentUser(null)
      } finally {
        setLoading(false)
      }
    }

    if (status !== 'loading') {
      fetchCurrentUser()
    }
  }, [session, status])

  return {
    currentUser,
    loading: loading || status === 'loading',
    error,
    isAuthenticated: status === 'authenticated' && currentUser !== null,
    keycloakId: currentUser?.keycloakId,
    clientId: currentUser?.clientId,
    profile: currentUser?.profile,
  }
}