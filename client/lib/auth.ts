import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const getSession = () => getServerSession(authOptions)

export const getCurrentUser = async () => {
  const session = await getSession()
  return session?.user
}

export const getAccessToken = async () => {
  const session = await getSession()
  return (session as any)?.accessToken
}