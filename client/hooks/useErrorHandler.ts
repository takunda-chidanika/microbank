'use client'

import { useState, useCallback } from 'react'
import { ApiError } from '@/types'

interface UseErrorHandlerReturn {
  error: string | null
  clearError: () => void
  handleError: (error: unknown) => void
  isApiError: (error: unknown) => error is ApiError
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const isApiError = useCallback((error: unknown): error is ApiError => {
    return error instanceof ApiError
  }, [])

  const handleError = useCallback((error: unknown) => {
    if (isApiError(error)) {
      // Handle API errors with proper messaging
      if (error.status === 401) {
        setError('Authentication required. Please sign in again.')
      } else if (error.status === 403) {
        setError('Access denied. You do not have permission to perform this action.')
      } else if (error.status === 404) {
        setError('The requested resource was not found.')
      } else if (error.status === 409) {
        setError(error.message || 'A conflict occurred. The resource may already exist.')
      } else if (error.status >= 500) {
        setError('A server error occurred. Please try again later.')
      } else {
        setError(error.message || 'An unexpected error occurred.')
      }
    } else if (error instanceof Error) {
      setError(error.message)
    } else {
      setError('An unexpected error occurred.')
    }
  }, [isApiError])

  return {
    error,
    clearError,
    handleError,
    isApiError,
  }
}