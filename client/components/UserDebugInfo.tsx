'use client'

import { useAuthUser } from '@/hooks/useAuthUser'

/**
 * Debug component to display current user state from Zustand store
 * Remove this in production
 */
export default function UserDebugInfo() {
  const { 
    keycloakId, 
    clientId, 
    profile, 
    isAuthenticated, 
    isLoading, 
    error, 
    sessionStatus 
  } = useAuthUser()

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">🔐 User State Debug</h3>
      <div className="space-y-1">
        <p><strong>Session Status:</strong> {sessionStatus}</p>
        <p><strong>Is Authenticated:</strong> {String(isAuthenticated)}</p>
        <p><strong>Is Loading:</strong> {String(isLoading)}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
        <p><strong>Keycloak ID:</strong> {keycloakId || 'None'}</p>
        <p><strong>Client ID:</strong> {clientId || 'None'}</p>
        <p><strong>Profile Name:</strong> {profile?.name || 'None'}</p>
        <p><strong>Profile Email:</strong> {profile?.email || 'None'}</p>
      </div>
    </div>
  )
}