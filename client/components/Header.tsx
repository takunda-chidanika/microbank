'use client'

import { signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/hooks/useUserRole'
import { ClientService } from '@/services/client.service'
import { useAuthUser } from '@/hooks/useAuthUser'

export default function Header() {
  const { session, profile, isAuthenticated, clearUser } = useAuthUser()
  const router = useRouter()
  const pathname = usePathname()
  const { isAdmin } = useUserRole()

  const handleSignOut = async () => {
    try {
      console.log('🔐 Starting logout process...')
      
      // 1. Clear Zustand store first
      clearUser()
      console.log('✅ Cleared Zustand user store')
      
      // 2. Clear any local storage data
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
        console.log('✅ Cleared local/session storage')
      }
      
      // 3. Call backend logout endpoint to clear server-side cookies
      try {
        await ClientService.logout()
        console.log('✅ Backend logout successful')
      } catch (backendError) {
        console.warn('⚠️ Backend logout failed, continuing with client logout:', backendError)
      }
      
      // 4. Sign out from NextAuth (this clears the session cookie and calls Keycloak logout)
      await signOut({ 
        redirect: false,
        callbackUrl: '/' 
      })
      console.log('✅ NextAuth signout successful')
      
      // 4. Force clear any remaining cookies
      if (typeof document !== 'undefined') {
        // Clear NextAuth cookies
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=")
          const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim()
          if (name.includes('next-auth') || name.includes('__Secure-next-auth') || name.includes('__Host-next-auth')) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
          }
        })
        console.log('✅ Cleared remaining cookies')
      }
      
      // 5. Redirect to home page
      router.push('/')
      
      // 6. Force a page reload to ensure everything is cleared
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          console.log('✅ Logout complete, reloading page')
          window.location.href = '/'
        }, 100)
      }
    } catch (error) {
      console.error('❌ Error during logout:', error)
      // Even if there's an error, try to redirect
      router.push('/')
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = '/'
        }, 100)
      }
    }
  }

  const isActiveLink = (path: string) => pathname === path

  return (
    <header className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3 hover-lift">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MicroBank
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-2">
            {isAdmin ? (
              <>
                <Link
                  href="/admin"
                  className={`nav-link ${isActiveLink('/admin') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin Panel
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/client"
                  className={`nav-link ${isActiveLink('/client') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                  Dashboard
                </Link>
                <Link
                  href="/accounts"
                  className={`nav-link ${isActiveLink('/accounts') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Accounts
                </Link>
                <Link
                  href="/transactions"
                  className={`nav-link ${isActiveLink('/transactions') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Transactions
                </Link>
              </>
            )}
          </nav>
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {profile?.name?.charAt(0) || session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {profile?.name || session?.user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {profile?.email || session?.user?.email}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSignOut}
              className="btn btn-secondary text-sm px-4 py-2 hover-lift"
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}