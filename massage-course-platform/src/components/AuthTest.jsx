import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
  Box,
  Button,
  VStack,
  HStack,
  Input,
  Text,
  Alert,
  Code,
  Divider,
  FormControl,
  FormLabel
} from '@chakra-ui/react'

const AuthTest = () => {
  const { user, isAuthenticated, isLoading, error, login, register, logout, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [mode, setMode] = useState('login') // 'login' or 'register'

  const handleLogin = async () => {
    try {
      await login({ email, password })
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  const handleRegister = async () => {
    try {
      await register({ 
        name, 
        email, 
        password, 
        password_confirmation: password 
      })
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setEmail('')
      setPassword('')
      setName('')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <Box p={6} maxW="md" mx="auto" borderWidth={1} borderRadius="lg" shadow="md">
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          Authentication Test
        </Text>
        
        {error && (
          <Alert status="error">
            {error}
            <Button size="sm" ml={2} onClick={clearError}>
              Clear
            </Button>
          </Alert>
        )}

        {isAuthenticated ? (
          <VStack spacing={3} align="stretch">
            <Alert status="success">
              ✅ Authenticated successfully!
            </Alert>
            
            <Box>
              <Text fontWeight="semibold">User Data:</Text>
              <Code p={3} display="block" whiteSpace="pre-wrap">
                {JSON.stringify(user, null, 2)}
              </Code>
            </Box>
            
            <Button 
              colorScheme="red" 
              onClick={handleLogout}
              isLoading={isLoading}
            >
              Logout
            </Button>
          </VStack>
        ) : (
          <VStack spacing={3} align="stretch">
            <HStack>
              <Button 
                size="sm" 
                variant={mode === 'login' ? 'solid' : 'outline'}
                onClick={() => setMode('login')}
              >
                Login
              </Button>
              <Button 
                size="sm" 
                variant={mode === 'register' ? 'solid' : 'outline'}
                onClick={() => setMode('register')}
              >
                Register
              </Button>
            </HStack>

            <Divider />

            {mode === 'register' && (
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <Button 
              colorScheme="blue" 
              onClick={mode === 'login' ? handleLogin : handleRegister}
              isLoading={isLoading}
              isDisabled={!email || !password || (mode === 'register' && !name)}
            >
              {mode === 'login' ? 'Login' : 'Register'}
            </Button>
          </VStack>
        )}

        <Divider />
        
        <Box fontSize="sm" color="gray.600">
          <Text fontWeight="semibold">Authentication Status:</Text>
          <Text>• Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</Text>
          <Text>• Loading: {isLoading ? '⏳ Yes' : '✅ No'}</Text>
          <Text>• Token in Storage: {localStorage.getItem('auth_token') ? '✅ Yes' : '❌ No'}</Text>
        </Box>
      </VStack>
    </Box>
  )
}

export default AuthTest
