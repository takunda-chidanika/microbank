import NextAuth from 'next-auth'
import { NextAuthOptions } from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.AUTH_KEYCLOAK_ID!,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, profile }) {
      // Initial sign in
      if (account) {
        console.log('🔐 JWT Callback - Account:', account)
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
        token.tokenType = account.token_type
        token.scope = account.scope
        
        // Add user info from profile
        if (profile) {
          token.profile = profile
        }
      }
      
      // Check if token is expired
      if (token.expiresAt && Date.now() < (token.expiresAt as number) * 1000) {
        console.log('🔐 JWT Callback - Token valid, expires at:', new Date((token.expiresAt as number) * 1000))
        return token
      }
      
      // Token has expired, try to refresh it
      if (token.refreshToken) {
        console.log('🔄 JWT Callback - Attempting token refresh')
        try {
          const response = await fetch(`${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: token.refreshToken as string,
              client_id: process.env.AUTH_KEYCLOAK_ID!,
              client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
            }),
          })
          
          const refreshedTokens = await response.json()
          
          if (!response.ok) {
            console.error('🔄 Token refresh failed:', refreshedTokens)
            throw refreshedTokens
          }
          
          console.log('✅ Token refreshed successfully')
          return {
            ...token,
            accessToken: refreshedTokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
          }
        } catch (error) {
          console.error('🔄 Error refreshing token:', error)
          return {
            ...token,
            error: 'RefreshAccessTokenError',
          }
        }
      }
      
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.expiresAt = token.expiresAt
      session.error = token.error
      
      console.log('🔐 Session Callback - Token present:', !!token.accessToken)
      
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }