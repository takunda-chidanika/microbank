import { getSession } from 'next-auth/react'
import { ApiError, ProblemDetail } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:9393'

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ProblemDetail | null = null
    try {
      errorData = await response.json()
    } catch (e) {
      errorData = {
        title: 'API Error',
        status: response.status,
        detail: response.statusText,
      }
    }
    throw new ApiError(
      errorData?.detail || `API error: ${response.status}`,
      response.status,
      errorData
    )
  }
  return response.json()
}

export async function getAuthHeaders(): Promise<HeadersInit> {
  const session = await getSession()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (session?.accessToken) {
    headers['Authorization'] = `Bearer ${session.accessToken}`
    console.log('🔐 Adding JWT token to request:', session.accessToken.substring(0, 20) + '...')
  } else {
    console.log('⚠️ No access token found in session')
  }

  return headers
}

// Enhanced API interceptor with detailed logging
export async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}, 
  requiresAuth = true
): Promise<T> {
  const headers = requiresAuth ? await getAuthHeaders() : { 'Content-Type': 'application/json' }
  
  const url = `${API_BASE_URL}${endpoint}`
  
  // Skip logging for registration and login endpoints to avoid issues
  const isPublicEndpoint = endpoint.includes('/register') || endpoint.includes('/login')
  
  if (!isPublicEndpoint) {
    console.log(`🚀 Making ${options.method || 'GET'} request to:`, url)
    console.log('📋 Request headers:', headers)
    
    if (options.body) {
      console.log('📦 Request body:', options.body)
    }
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  })
  
  if (!isPublicEndpoint) {
    console.log(`📨 Response status: ${response.status} ${response.statusText}`)
    
    if (!response.ok) {
      console.log('❌ API Error Response:', response)
      // Log response headers for debugging
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()))
    }
  }
  
  return handleApiResponse<T>(response)
}

export async function apiGet<T>(endpoint: string, requiresAuth = true): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' }, requiresAuth)
}

export async function apiPost<T>(endpoint: string, data: any, requiresAuth = true): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }, requiresAuth)
}

export async function apiPatch<T>(endpoint: string, data?: any, requiresAuth = true): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    ...(data && { body: JSON.stringify(data) }),
  }, requiresAuth)
}

export async function apiPut<T>(endpoint: string, data?: any, requiresAuth = true): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    ...(data && { body: JSON.stringify(data) }),
  }, requiresAuth)
}

export async function apiDelete<T>(endpoint: string, requiresAuth = true): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' }, requiresAuth)
}

// Debug function to check current session
export async function debugSession() {
  const session = await getSession()
  console.log('🔍 Current session:', session)
  
  if (session?.accessToken) {
    console.log('🔐 Access token present:', session.accessToken.substring(0, 50) + '...')
    console.log('⏰ Token expires at:', new Date((session as any).expiresAt * 1000))
  } else {
    console.log('❌ No access token in session')
  }
  
  return session
}