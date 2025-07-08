import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
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
  IconButton,
  Alert,
  Checkbox,
  Select
} from '@chakra-ui/react'
import { 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaFacebook, 
  FaArrowLeft 
} from 'react-icons/fa'

const Register = () => {
  const navigate = useNavigate()
  const { register: registerUser, isLoading, error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    try {
      clearError()
      await registerUser(data)
      toast.success('Registration successful! Welcome to Massage Academy.')
      navigate('/app/courses')
    } catch (error) {
      console.error('Registration error:', error)
      
      // Handle Laravel validation errors
      if (error.response?.status === 422 && error.response?.data?.errors) {
        Object.keys(error.response.data.errors).forEach(field => {
          setError(field, {
            type: 'server',
            message: error.response.data.errors[field][0]
          })
        })
      } else {
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
      }
    }
  }

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} registration will be implemented soon!`)
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
                    Join Massage Academy
                  </Heading>
                  <Text color="gray.600">
                    Start your professional massage therapy journey today
                  </Text>
                </VStack>

                {/* Error Alert */}
                {error && (
                  <Alert status="error" borderRadius="lg">
                    {error}
                  </Alert>
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

                {/* Registration Form */}
                <Box w="full">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing={4}>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                          Full Name *
                        </Text>
                        <Input
                          {...register('name', {
                            required: 'Full name is required',
                            minLength: {
                              value: 2,
                              message: 'Name must be at least 2 characters'
                            }
                          })}
                          placeholder="Enter your full name"
                          size="lg"
                          borderRadius="xl"
                          borderColor={errors.name ? "red.500" : "gray.300"}
                          _focus={{ borderColor: errors.name ? "red.500" : "blue.500", boxShadow: `0 0 0 1px ${errors.name ? "#e53e3e" : "#3182ce"}` }}
                        />
                        {errors.name && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {errors.name.message}
                          </Text>
                        )}
                      </Box>

                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                          Email Address *
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

                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                          Phone Number
                        </Text>
                        <Input
                          {...register('phone', {
                            pattern: {
                              value: /^[\+]?[1-9][\d]{0,15}$/,
                              message: 'Please enter a valid phone number'
                            }
                          })}
                          type="tel"
                          placeholder="Enter your phone number"
                          size="lg"
                          borderRadius="xl"
                          borderColor={errors.phone ? "red.500" : "gray.300"}
                          _focus={{ borderColor: errors.phone ? "red.500" : "blue.500", boxShadow: `0 0 0 1px ${errors.phone ? "#e53e3e" : "#3182ce"}` }}
                        />
                        {errors.phone && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {errors.phone.message}
                          </Text>
                        )}
                      </Box>

                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                          Current Profession
                        </Text>
                        <Select
                          {...register('profession')}
                          placeholder="Select your profession"
                          size="lg"
                          borderRadius="xl"
                          borderColor={errors.profession ? "red.500" : "gray.300"}
                          _focus={{ borderColor: errors.profession ? "red.500" : "blue.500", boxShadow: `0 0 0 1px ${errors.profession ? "#e53e3e" : "#3182ce"}` }}
                        >
                          <option value="healthcare">Healthcare Professional</option>
                          <option value="fitness">Fitness Trainer</option>
                          <option value="wellness">Wellness Practitioner</option>
                          <option value="student">Student</option>
                          <option value="career_change">Career Changer</option>
                          <option value="other">Other</option>
                        </Select>
                        {errors.profession && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {errors.profession.message}
                          </Text>
                        )}
                      </Box>

                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                          Date of Birth
                        </Text>
                        <Input
                          {...register('date_of_birth', {
                            validate: value => {
                              if (value) {
                                const birthDate = new Date(value)
                                const today = new Date()
                                const age = today.getFullYear() - birthDate.getFullYear()
                                if (age < 18) {
                                  return 'You must be at least 18 years old'
                                }
                              }
                              return true
                            }
                          })}
                          type="date"
                          size="lg"
                          borderRadius="xl"
                          borderColor={errors.date_of_birth ? "red.500" : "gray.300"}
                          _focus={{ borderColor: errors.date_of_birth ? "red.500" : "blue.500", boxShadow: `0 0 0 1px ${errors.date_of_birth ? "#e53e3e" : "#3182ce"}` }}
                        />
                        {errors.date_of_birth && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {errors.date_of_birth.message}
                          </Text>
                        )}
                      </Box>

                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                          Password *
                        </Text>
                        <Box position="relative" w="full">
                          <Input
                            {...register('password', {
                              required: 'Password is required',
                              minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters'
                              },
                              pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                              }
                            })}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a strong password"
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

                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                          Confirm Password *
                        </Text>
                        <Box position="relative" w="full">
                          <Input
                            {...register('password_confirmation', {
                              required: 'Please confirm your password',
                              validate: value => value === password || 'Passwords do not match'
                            })}
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            size="lg"
                            borderRadius="xl"
                            borderColor={errors.password_confirmation ? "red.500" : "gray.300"}
                            _focus={{ borderColor: errors.password_confirmation ? "red.500" : "blue.500", boxShadow: `0 0 0 1px ${errors.password_confirmation ? "#e53e3e" : "#3182ce"}` }}
                            pr="3rem"
                          />
                          <IconButton
                            icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            variant="ghost"
                            size="sm"
                            position="absolute"
                            right="0.5rem"
                            top="50%"
                            transform="translateY(-50%)"
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          />
                        </Box>
                        {errors.password_confirmation && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {errors.password_confirmation.message}
                          </Text>
                        )}
                      </Box>

                      <Box>
                        <Checkbox
                          {...register('terms', {
                            required: 'You must accept the terms and conditions'
                          })}
                          size="sm"
                        >
                          <Text fontSize="sm" color="gray.600">
                            I agree to the{' '}
                            <Text as="span" color="primary.500" fontWeight="600">
                              Terms of Service
                            </Text>{' '}
                            and{' '}
                            <Text as="span" color="primary.500" fontWeight="600">
                              Privacy Policy
                            </Text>
                          </Text>
                        </Checkbox>
                        {errors.terms && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {errors.terms.message}
                          </Text>
                        )}
                      </Box>

                      <Button
                        type="submit"
                        size="lg"
                        w="full"
                        bg="gradient-primary"
                        color="white"
                        borderRadius="xl"
                        isLoading={isLoading || isSubmitting}
                        loadingText="Creating account..."
                        _hover={{
                          transform: 'translateY(-1px)',
                          boxShadow: 'lg'
                        }}
                      >
                        Create Account
                      </Button>
                    </VStack>
                  </form>
                </Box>

                <VStack spacing={2} textAlign="center">
                  <Text fontSize="sm" color="gray.600">
                    Already have an account?{' '}
                    <Link to="/signin">
                      <Text as="span" color="primary.500" fontWeight="600">
                        Sign in here
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

export default Register
