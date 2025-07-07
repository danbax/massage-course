import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/auth'
import apiClient, { ApiError } from '../lib/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Start with true to check initial auth state
  const [error, setError] = useState(null)

  // Check if user is already authenticated on app start
  useEffect(() => {
    const checkAuthState = async () => {
      const token = apiClient.getAuthToken()
      if (token) {
        try {
          const response = await authApi.getCurrentUser()
          setUser(response.user)
          setIsAuthenticated(true)
        } catch (err) {
          // Token is invalid, remove it
          apiClient.removeAuthToken()
          setUser(null)
          setIsAuthenticated(false)
        }
      }
      setIsLoading(false)
    }

    checkAuthState()
  }, [])

  const login = async (credentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authApi.login(credentials)
      
      // Store token
      apiClient.setAuthToken(response.token)
      
      // Set user data
      setUser(response.user)
      setIsAuthenticated(true)
      
      return response
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Login failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authApi.register(userData)
      
      // Store token
      apiClient.setAuthToken(response.token)
      
      // Set user data
      setUser(response.user)
      setIsAuthenticated(true)
      
      return response
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Registration failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      // Call logout API if user is authenticated
      if (isAuthenticated) {
        await authApi.logout()
      }
    } catch (err) {
      // Even if logout API fails, we should still clear local state
      console.error('Logout API failed:', err)
    } finally {
      // Clear local auth state
      apiClient.removeAuthToken()
      setUser(null)
      setIsAuthenticated(false)
      setError(null)
      setIsLoading(false)
    }
  }

  const refreshToken = async () => {
    try {
      const response = await authApi.refreshToken()
      apiClient.setAuthToken(response.token)
      return response
    } catch (err) {
      // If refresh fails, logout user
      await logout()
      throw err
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      register,
      logout,
      refreshToken,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}