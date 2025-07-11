'use client'

import { AuthProvider } from '@/components/AuthProvider'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
  session: any
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <AuthProvider session={session}>
      {children}
    </AuthProvider>
  )
}