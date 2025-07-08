import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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
            error: null 
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
          get().logout()
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