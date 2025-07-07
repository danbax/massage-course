import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import iconImage from '../assets/icon.png'
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  VStack,
  HStack,
  Image,
  IconButton
} from '@chakra-ui/react'
import { 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaFacebook, 
  FaArrowLeft,
  FaExclamationTriangle,
  FaCheck
} from 'react-icons/fa'

const SignIn = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm()

  const from = location.state?.from?.pathname || '/app/courses'

  const onSubmit = async (data) => {
    try {
      clearError()
      await login(data)
      toast.success('Welcome back! You have successfully signed in.')
      navigate(from, { replace: true })
    } catch (error) {
      console.error('Login error:', error)
      
      if (error.isValidationError && error.data.errors) {
        Object.keys(error.data.errors).forEach(field => {
          setError(field, {
            type: 'server',
            message: error.data.errors[field][0]
          })
        })
      } else {
        toast.error(error.message || 'Sign in failed. Please try again.')
      }
    }
  }

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login will be implemented soon!`)
  }

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)">
      {/* Header */}
      <Box py={4} borderBottom="1px solid" borderColor="gray.200" bg="white">
        <Container maxW="7xl">
          <Flex justify="space-between" align="center">
            <Link to="/">
              <HStack spacing={3}>
                <Image 
                  src={iconImage} 
                  alt="Massage Academy Logo" 
                  w={10}
                  h={10}
                  borderRadius="xl"
                />
                <Box>
                  <Text fontSize="lg" fontWeight="800" color="gray.900">
                    Massage Academy
                  </Text>
                </Box>
              </HStack>
            </Link>
            
            <Button
              leftIcon={<FaArrowLeft />}
              variant="ghost"
              onClick={() => navigate('/')}
              size="sm"
            >
              Back to Home
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="md" py={12}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box 
            boxShadow="xl" 
            borderRadius="2xl" 
            bg="white" 
            border="1px solid" 
            borderColor="gray.200"
          >
            <Box p={8}>
              <VStack spacing={8}>
                <VStack spacing={2} textAlign="center">
                  <Heading size="lg" color="gray.900">
                    Welcome Back
                  </Heading>
                  <Text color="gray.600">
                    Sign in to continue your massage therapy journey
                  </Text>
                </VStack>

                {/* Error Alert - Custom */}
                {error && (
                  <Box
                    bg="red.50"
                    border="1px solid"
                    borderColor="red.200"
                    borderRadius="lg"
                    p={4}
                    w="full"
                  >
                    <HStack spacing={3}>
                      <Box color="red.500">
                        <FaExclamationTriangle />
                      </Box>
                      <Text color="red.700" fontSize="sm">
                        {error}
                      </Text>
                    </HStack>
                  </Box>
                )}

                {/* Social Login */}
                <VStack spacing={3} w="full">
                  <Button
                    leftIcon={<FaGoogle />}
                    w="full"
                    variant="outline"
                    borderColor="gray.300"
                    _hover={{ bg: 'gray.50' }}
                    isLoading={isLoading}
                    onClick={() => handleSocialLogin('Google')}
                  >
                    Continue with Google
                  </Button>
                  <Button
                    leftIcon={<FaFacebook />}
                    w="full"
                    colorScheme="facebook"
                    isLoading={isLoading}
                    onClick={() => handleSocialLogin('Facebook')}
                  >
                    Continue with Facebook
                  </Button>
                </VStack>

                <HStack w="full">
                  <Box flex={1} h="1px" bg="gray.200" />
                  <Text fontSize="sm" color="gray.500" px={3}>
                    or
                  </Text>
                  <Box flex={1} h="1px" bg="gray.200" />
                </HStack>

                {/* Login Form */}
                <Box w="full">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing={4}>
                      <Box w="full">
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                          Email address *
                        </Text>
                        <Input
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Please enter a valid email address'
                            }
                          })}
                          type="email"
                          placeholder="Enter your email"
                          size="lg"
                          borderRadius="xl"
                          borderColor={errors.email ? "red.500" : "gray.300"}
                          _focus={{ borderColor: errors.email ? "red.500" : "blue.500", boxShadow: `0 0 0 1px ${errors.email ? "#e53e3e" : "#3182ce"}` }}
                        />
                        {errors.email && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {errors.email.message}
                          </Text>
                        )}
                      </Box>

                      <Box w="full">
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                          Password *
                        </Text>
                        <Box position="relative" w="full">
                          <Input
                            {...register('password', {
                              required: 'Password is required',
                              minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                              }
                            })}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            size="lg"
                            borderRadius="xl"
                            borderColor={errors.password ? "red.500" : "gray.300"}
                            _focus={{ borderColor: errors.password ? "red.500" : "blue.500", boxShadow: `0 0 0 1px ${errors.password ? "#e53e3e" : "#3182ce"}` }}
                            pr="3rem"
                          />
                          <IconButton
                            icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                            onClick={() => setShowPassword(!showPassword)}
                            variant="ghost"
                            size="sm"
                            position="absolute"
                            right="0.5rem"
                            top="50%"
                            transform="translateY(-50%)"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          />
                        </Box>
                        {errors.password && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {errors.password.message}
                          </Text>
                        )}
                      </Box>

                      <HStack justify="space-between" w="full">
                        {/* Custom Checkbox */}
                        <HStack 
                          spacing={2} 
                          cursor="pointer"
                          onClick={() => setRememberMe(!rememberMe)}
                        >
                          <Box
                            w={4}
                            h={4}
                            borderRadius="sm"
                            border="2px solid"
                            borderColor={rememberMe ? "blue.500" : "gray.300"}
                            bg={rememberMe ? "blue.500" : "white"}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            transition="all 0.2s"
                          >
                            {rememberMe && (
                              <Box color="white">
                                <FaCheck size={10} />
                              </Box>
                            )}
                          </Box>
                          <Text fontSize="sm" color="gray.600">
                            Remember me
                          </Text>
                        </HStack>
                        
                        <Link to="/forgot-password">
                          <Text fontSize="sm" color="blue.500" fontWeight="600">
                            Forgot password?
                          </Text>
                        </Link>
                      </HStack>

                      <Button
                        type="submit"
                        size="lg"
                        w="full"
                        bg="linear-gradient(135deg, #0ea5e9, #a855f7)"
                        color="white"
                        borderRadius="xl"
                        isLoading={isLoading || isSubmitting}
                        loadingText="Signing in..."
                        _hover={{
                          transform: 'translateY(-1px)',
                          boxShadow: 'lg'
                        }}
                      >
                        Sign In
                      </Button>
                    </VStack>
                  </form>
                </Box>

                <VStack spacing={2} textAlign="center">
                  <Text fontSize="sm" color="gray.600">
                    Don't have an account?{' '}
                    <Link to="/register">
                      <Text as="span" color="blue.500" fontWeight="600">
                        Sign up here
                      </Text>
                    </Link>
                  </Text>
                </VStack>
              </VStack>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}

export default SignIn