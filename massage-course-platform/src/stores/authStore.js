import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '../api/auth'
import apiClient from '../lib/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),

      // Login action
      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authApi.login(credentials)
          const { user, token } = response
          
          // Store token in API client
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
            isLoading: false,
            error: error.message || 'Login failed'
          })
          throw error
        }
      },

      // Register action
      register: async (userData) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authApi.register(userData)
          const { user, token } = response
          
          // Store token in API client
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
            isLoading: false,
            error: error.message || 'Registration failed'
          })
          throw error
        }
      },

      // Logout action
      logout: async () => {
        try {
          set({ isLoading: true })
          
          // Call logout API if user is authenticated
          if (get().isAuthenticated) {
            await authApi.logout()
          }
        } catch (error) {
          console.error('Logout API call failed:', error)
          // Continue with local logout even if API call fails
        } finally {
          // Clear local state and token
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

      // Refresh token action
      refreshToken: async () => {
        try {
          const response = await authApi.refreshToken()
          const { token } = response
          
          apiClient.setAuthToken(token)
          set({ token })
          
          return response
        } catch (error) {
          // If refresh fails, logout user
          get().logout()
          throw error
        }
      },

      // Initialize authentication from stored token
      initializeAuth: async () => {
        const storedToken = apiClient.getAuthToken()
        
        if (!storedToken) {
          set({ isLoading: false })
          return
        }

        try {
          set({ isLoading: true })
          
          // Verify token by getting current user
          const response = await authApi.getCurrentUser()
          const { user } = response
          
          set({
            user,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error) {
          // Token is invalid, clear it
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

      // Update user profile
      updateUser: (userData) => {
        set(state => ({
          user: { ...state.user, ...userData }
        }))
      },

      // Forgot password
      forgotPassword: async (email) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authApi.forgotPassword(email)
          
          set({ isLoading: false })
          return response
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Failed to send reset email'
          })
          throw error
        }
      },

      // Reset password
      resetPassword: async (data) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authApi.resetPassword(data)
          
          set({ isLoading: false })
          return response
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Failed to reset password'
          })
          throw error
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export default useAuthStore
