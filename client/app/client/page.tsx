'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUserRole } from '@/hooks/useUserRole'
import Layout from '@/components/Layout'
import UserDashboard from '@/components/UserDashboard'

export default function ClientPage() {
  const { data: session, status } = useSession()
  const { isAdmin, isUser } = useUserRole()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    // If user is admin, redirect to admin page
    if (isAdmin) {
      router.push('/admin')
      return
    }

    // If user is not a regular user, redirect to dashboard
    if (!isUser) {
      router.push('/dashboard')
      return
    }
  }, [session, status, router, isAdmin, isUser])

  if (status === 'loading') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    )
  }

  if (!session || !isUser) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <UserDashboard />
    </Layout>
  )
}