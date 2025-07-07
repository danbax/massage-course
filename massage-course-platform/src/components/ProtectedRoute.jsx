import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Box, Spinner, VStack, Text } from '@chakra-ui/react'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <Box 
        minH="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        bg="gray.50"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="primary.500" thickness="4px" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Box>
    )
  }

  if (!isAuthenticated) {
    // Redirect to sign in page with return url
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
