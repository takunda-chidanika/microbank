'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="card max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-red-600 mb-4">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Error
          </h1>
          
          <p className="text-gray-600 mb-8">
            {error === 'Configuration' && 'There was a problem with the server configuration.'}
            {error === 'AccessDenied' && 'You were denied access to the application.'}
            {error === 'Verification' && 'The verification token was invalid.'}
            {!error && 'An unexpected error occurred during authentication.'}
          </p>
          
          <Link
            href="/auth/signin"
            className="btn btn-primary w-full mb-4"
          >
            Try Again
          </Link>
          
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