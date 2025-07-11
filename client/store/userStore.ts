import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ClientService } from '@/services/client.service'
import { ClientResponse } from '@/types'

export interface UserState {
  // User data
  keycloakId: string | null
  clientId: string | null
  profile: ClientResponse | null
  
  // State flags
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setUserData: (keycloakId: string, clientId: string, profile: ClientResponse) => void
  fetchClientProfile: (keycloakId: string) => Promise<void>
  clearUser: () => void
  reset: () => void
}

const initialState = {
  keycloakId: null,
  clientId: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      setUserData: (keycloakId: string, clientId: string, profile: ClientResponse) => {
        set({
          keycloakId,
          clientId,
          profile,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      },

      fetchClientProfile: async (keycloakId: string) => {
        const { setLoading, setError, setUserData } = get()
        
        try {
          setLoading(true)
          setError(null)
          
          console.log('🔄 Fetching client profile for Keycloak ID:', keycloakId)
          
          // Fetch client profile from backend using Keycloak ID
          const clientProfile = await ClientService.getClientProfileByKeycloakId(keycloakId)
          
          console.log('✅ Client profile fetched successfully:', clientProfile)
          
          // Store user data in Zustand
          setUserData(keycloakId, clientProfile.id, clientProfile)
          
        } catch (error: any) {
          console.error('❌ Error fetching client profile:', error)
          setError(error.message || 'Failed to fetch user profile')
          setLoading(false)
        }
      },

      clearUser: () => {
        set({
          keycloakId: null,
          clientId: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },

      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'microbank-user-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({
        // Only persist user data, not loading/error states
        keycloakId: state.keycloakId,
        clientId: state.clientId,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Reset loading/error states on rehydration
        if (state) {
          state.isLoading = false
          state.error = null
        }
      },
    }
  )
)

// Individual selectors to avoid infinite loop issues
export const useKeycloakId = () => useUserStore((state) => state.keycloakId)
export const useClientId = () => useUserStore((state) => state.clientId)
export const useProfile = () => useUserStore((state) => state.profile)
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated)
export const useIsLoading = () => useUserStore((state) => state.isLoading)
export const useUserError = () => useUserStore((state) => state.error)

// Action selectors
export const useFetchClientProfile = () => useUserStore((state) => state.fetchClientProfile)
export const useClearUser = () => useUserStore((state) => state.clearUser)
export const useSetUserData = () => useUserStore((state) => state.setUserData)
export const useSetLoading = () => useUserStore((state) => state.setLoading)
export const useSetError = () => useUserStore((state) => state.setError)
export const useResetUser = () => useUserStore((state) => state.reset)