import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

/**
 * Hook to protect routes that require authentication
 * Automatically redirects to sign-in if not authenticated
 */
export const useAuthGuard = (redirectTo = '/signin') => {
  const { isAuthenticated, isLoading, validateSession } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoading) {
        if (!isAuthenticated) {
          // Store the attempted location for redirect after login
          navigate(redirectTo, { 
            state: { from: location },
            replace: true 
          })
        } else {
          // Validate session periodically for authenticated users
          await validateSession()
        }
      }
    }

    checkAuth()
  }, [isAuthenticated, isLoading, navigate, redirectTo, location, validateSession])

  return { isAuthenticated, isLoading }
}

/**
 * Hook to redirect authenticated users away from auth pages
 */
export const useGuestGuard = (redirectTo = '/dashboard') => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check if there's a redirect location from previous navigation
      const from = location.state?.from?.pathname || redirectTo
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, location])

  return { isAuthenticated, isLoading }
}

/**
 * Periodically validate the user session
 */
export const useSessionValidator = (intervalMs = 5 * 60 * 1000) => { // Default: 5 minutes
  const { isAuthenticated, validateSession } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(async () => {
      await validateSession()
    }, intervalMs)

    return () => clearInterval(interval)
  }, [isAuthenticated, validateSession, intervalMs])
}
