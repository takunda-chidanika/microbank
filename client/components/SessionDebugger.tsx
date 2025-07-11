'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { debugSession } from '@/lib/api'
import { parseJWT, debugToken, isTokenExpired, getUserRoles } from '@/lib/jwt-utils'

export default function SessionDebugger() {
  const { data: session } = useSession()
  const [isVisible, setIsVisible] = useState(false)
  const [tokenInfo, setTokenInfo] = useState<any>(null)

  const handleDebug = async () => {
    await debugSession()
    
    if (session?.accessToken) {
      const info = debugToken(session.accessToken)
      setTokenInfo(info)
    }
  }

  const handleParseToken = () => {
    if (session?.accessToken) {
      const parsed = parseJWT(session.accessToken)
      console.log('Parsed JWT:', parsed)
      setTokenInfo(parsed)
    }
  }

  if (!session) return null

  const tokenExpired = session.accessToken ? isTokenExpired(session.accessToken) : false
  const userRoles = session.accessToken ? getUserRoles(session.accessToken) : []

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      
      {isVisible && (
        <div className="absolute bottom-16 right-0 bg-white p-4 rounded-lg shadow-xl border max-w-lg max-h-96 overflow-y-auto">
          <h3 className="font-semibold mb-2">🔍 Session Debug Info</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>User:</strong> {session.user?.name || session.user?.email}
            </div>
            <div>
              <strong>Access Token:</strong> {session.accessToken ? '✅ Present' : '❌ Missing'}
            </div>
            {session.accessToken && (
              <>
                <div>
                  <strong>Token Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${tokenExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {tokenExpired ? 'Expired' : 'Valid'}
                  </span>
                </div>
                <div>
                  <strong>User Roles:</strong> {userRoles.length > 0 ? userRoles.join(', ') : 'None'}
                </div>
                <div>
                  <strong>Token Preview:</strong> 
                  <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
                    {session.accessToken.substring(0, 50)}...
                  </div>
                </div>
              </>
            )}
            <div>
              <strong>Expires At:</strong> {(session as any).expiresAt ? new Date((session as any).expiresAt * 1000).toLocaleString() : 'N/A'}
            </div>
            
            {tokenInfo && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h4 className="font-semibold mb-2">JWT Payload:</h4>
                <div className="space-y-1 text-xs">
                  <div><strong>Subject:</strong> {tokenInfo.sub}</div>
                  <div><strong>Email:</strong> {tokenInfo.email}</div>
                  <div><strong>Username:</strong> {tokenInfo.preferred_username}</div>
                  <div><strong>Issuer:</strong> {tokenInfo.iss}</div>
                  <div><strong>Audience:</strong> {Array.isArray(tokenInfo.aud) ? tokenInfo.aud.join(', ') : tokenInfo.aud}</div>
                  <div><strong>Scope:</strong> {tokenInfo.scope}</div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={handleDebug}
              className="btn btn-primary text-sm px-3 py-1"
            >
              Debug Console
            </button>
            <button
              onClick={handleParseToken}
              className="btn btn-secondary text-sm px-3 py-1"
            >
              Parse Token
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="btn btn-secondary text-sm px-3 py-1"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}