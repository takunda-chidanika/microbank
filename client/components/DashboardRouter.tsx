'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUserRole } from '@/hooks/useUserRole'
import AdminDashboard from '@/components/AdminDashboard'
import UserDashboard from '@/components/UserDashboard'

export default function DashboardRouter() {
  const { data: session, status } = useSession()
  const { isAdmin, isUser, roles } = useUserRole()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Debug role information
    console.log('🔍 Dashboard Router - User roles:', roles)
    console.log('👑 Is Admin:', isAdmin)
    console.log('👤 Is User (session && !admin):', isUser)
    console.log('📧 User email:', session?.user?.email)

    // Role-based routing
    if (isAdmin) {
      router.push('/admin')
    } else if (isUser) {
      router.push('/client')
    }
  }, [session, status, router, roles, isAdmin, isUser])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to signin
  }

  // Show loading while redirecting
  if (isAdmin || isUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Fallback for edge cases
  // This should rarely happen since isUser is true for any authenticated user who is not admin
  // But keeping as fallback for edge cases
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card max-w-md w-full mx-4 text-center">
        <div className="text-yellow-600 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Account Setup Required
        </h1>
        <p className="text-gray-600 mb-4">
          Your account needs to be properly configured. Please contact support.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Session: {session?.user?.email}<br />
          Roles: {roles.length > 0 ? roles.join(', ') : 'No specific roles assigned'}
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="btn btn-primary"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/auth/signin')}
            className="btn btn-secondary"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}