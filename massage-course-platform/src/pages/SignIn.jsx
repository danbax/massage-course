import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
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
  FaArrowLeft 
} from 'react-icons/fa'

const SignIn = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      login({
        name: 'John Doe',
        email: formData.email,
        avatar: 'JD'
      })
      
      // Simple success notification
      alert('Welcome back! You have successfully signed in.')
      
      navigate('/app/courses')
      setIsLoading(false)
    }, 1000)
  }

  const handleSocialLogin = (provider) => {
    setIsLoading(true)
    
    setTimeout(() => {
      login({
        name: 'John Doe',
        email: `john.doe@${provider}.com`,
        avatar: 'JD'
      })
      
      // Simple success notification
      alert(`Welcome! You have successfully signed in with ${provider}.`)
      
      navigate('/app/courses')
      setIsLoading(false)
    }, 1000)
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
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                      <VStack spacing={2} align="start" w="full">
                        <Text fontSize="sm" fontWeight="medium" color="gray.700">
                          Email address *
                        </Text>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          size="lg"
                          borderRadius="xl"
                          borderColor="gray.300"
                          _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                        />
                      </VStack>

                      <VStack spacing={2} align="start" w="full">
                        <Text fontSize="sm" fontWeight="medium" color="gray.700">
                          Password *
                        </Text>
                        <Box position="relative" w="full">
                          <Input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            size="lg"
                            borderRadius="xl"
                            borderColor="gray.300"
                            _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
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
                      </VStack>

                      <Button
                        type="submit"
                        size="lg"
                        w="full"
                        bg="gradient-primary"
                        color="white"
                        borderRadius="xl"
                        isLoading={isLoading}
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
                    <Text as="span" color="primary.500" fontWeight="600" cursor="pointer">
                      Sign up here
                    </Text>
                  </Text>
                  <Text fontSize="sm" color="primary.500" fontWeight="600" cursor="pointer">
                    Forgot your password?
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
