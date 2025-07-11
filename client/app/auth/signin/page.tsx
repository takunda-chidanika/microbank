'use client'

import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function SignIn() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    checkSession()
  }, [router])

  const handleSignIn = () => {
    signIn('keycloak', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="card max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-600 mb-8">Access your MicroBank account</p>
          
          <button
            onClick={handleSignIn}
            className="btn btn-primary w-full mb-4"
          >
            Sign In with Keycloak
          </button>
          
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}