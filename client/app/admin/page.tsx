'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useUserRole } from '@/hooks/useUserRole'
import Layout from '@/components/Layout'
import AdminDashboard from '@/components/AdminDashboard'
import { AdminService } from '@/services/admin.service'
import { ClientResponse } from '@/types'

export default function Admin() {
  const { data: session } = useSession()
  const router = useRouter()
  const { isAdmin, isUser } = useUserRole()

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    // If user is not admin, redirect to client page
    if (!isAdmin && isUser) {
      router.push('/client')
      return
    }

    // If user has no proper role, redirect to dashboard
    if (!isAdmin && !isUser) {
      router.push('/dashboard')
      return
    }
  }, [session, isAdmin, isUser, router])

  if (!isAdmin) {
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
      <AdminDashboard />
    </Layout>
  )
}