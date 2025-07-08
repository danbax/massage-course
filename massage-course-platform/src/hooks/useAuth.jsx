import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createContext, useContext, useEffect } from 'react'
import { authApi } from '../api/auth'
import apiClient from '../lib/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false, // Add flag to prevent multiple initializations

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.login(credentials)
          const { user, token } = response
          
          apiClient.setAuthToken(token)
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          })
          
          return response
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null
          })
          throw error
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.register(userData)
          const { user, token } = response
          
          apiClient.setAuthToken(token)
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          })
          
          return response
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          if (get().isAuthenticated) {
            await authApi.logout()
          }
        } catch (error) {
          console.error('Logout API failed:', error)
        } finally {
          apiClient.removeAuthToken()
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null,
            isInitialized: false // Reset initialization flag on logout
          })
        }
      },

      refreshToken: async () => {
        try {
          const response = await authApi.refresh()
          const { token } = response
          
          apiClient.setAuthToken(token)
          set({ token })
          
          return response
        } catch (error) {
          // Clear auth state without calling logout to prevent loops
          apiClient.removeAuthToken()
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          })
          throw error
        }
      },

      getCurrentUser: async () => {
        if (!get().token) return null
        
        set({ isLoading: true })
        try {
          const response = await authApi.getCurrentUser()
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          })
          return response.user
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            token: null 
          })
          apiClient.removeAuthToken()
          return null
        }
      },

      updateUser: (userData) => {
        set(state => ({ 
          user: { ...state.user, ...userData } 
        }))
      },

      clearError: () => set({ error: null }),

      initialize: async () => {
        // Prevent multiple initializations
        if (get().isInitialized) return
        
        set({ isLoading: true, isInitialized: true })
        
        const token = apiClient.getAuthToken()
        if (token) {
          set({ token })
          await get().getCurrentUser()
        } else {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

// Hook wrapper for easier usage
export const useAuth = () => {
  const store = useAuthStore()
  
  return {
    // State
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    isInitialized: store.isInitialized,
    
    // Actions
    login: store.login,
    register: store.register,
    logout: store.logout,
    refreshToken: store.refreshToken,
    getCurrentUser: store.getCurrentUser,
    updateUser: store.updateUser,
    clearError: store.clearError,
    initialize: store.initialize
  }
}

// Context for AuthProvider (optional, since Zustand provides global state)
const AuthContext = createContext()

// AuthProvider component for initialization and context
export const AuthProvider = ({ children }) => {
  const store = useAuthStore()

  useEffect(() => {
    // Initialize auth state on app start
    store.initialize()
  }, []) // Empty dependency array - only run once on mount

  return (
    <AuthContext.Provider value={store}>
      {children}
    </AuthContext.Provider>
  )
}

// Optional: Hook to use AuthContext (though useAuth is preferred)
export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}