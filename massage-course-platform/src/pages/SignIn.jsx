import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
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
  FaArrowLeft,
  FaExclamationTriangle
} from 'react-icons/fa'

const SignIn = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, error, clearError } = useAuth()
  const { t } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)
  
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
      toast.success(t('auth.signIn.signInSuccess'))
      navigate(from, { replace: true })
    } catch (error) {
      console.error('Login error:', error)
      
      if (error.response?.status === 422 && error.response?.data?.errors) {
        Object.keys(error.response.data.errors).forEach(field => {
          setError(field, {
            type: 'server',
            message: error.response.data.errors[field][0]
          })
        })
      } else if (error.response?.status === 401) {
        toast.error(t('auth.signIn.invalidCredentials'))
      } else {
        toast.error(error.response?.data?.message || t('auth.signIn.signInFailed'))
      }
    }
  }

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login will be implemented soon!`)
  }

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)">
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
              {t('common.backToHome')}
            </Button>
          </Flex>
        </Container>
      </Box>

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
                    {t('auth.signIn.title')}
                  </Heading>
                  <Text color="gray.600">
                    {t('auth.signIn.subtitle')}
                  </Text>
                </VStack>

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
                    {t('auth.signIn.continueWithGoogle')}
                  </Button>
                </VStack>

                <HStack w="full">
                  <Box flex={1} h="1px" bg="gray.200" />
                  <Text fontSize="sm" color="gray.500" px={3}>
                    or
                  </Text>
                  <Box flex={1} h="1px" bg="gray.200" />
                </HStack>

                <Box w="full">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing={4}>
                      <Box w="full">
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                          {t('auth.signIn.emailLabel')} *
                        </Text>
                        <Input
                          {...register('email', {
                            required: t('auth.register.validation.emailRequired'),
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: t('auth.register.validation.emailInvalid')
                            }
                          })}
                          type="email"
                          placeholder={t('auth.signIn.emailPlaceholder')}
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
                          {t('auth.signIn.passwordLabel')} *
                        </Text>
                        <Box position="relative" w="full">
                          <Input
                            {...register('password', {
                              required: t('auth.register.validation.passwordRequired'),
                              minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                              }
                            })}
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('auth.signIn.passwordPlaceholder')}
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
                            aria-label={showPassword ? t('video.controls.hidePassword') : t('video.controls.showPassword')}
                          />
                        </Box>
                        {errors.password && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {errors.password.message}
                          </Text>
                        )}
                      </Box>

                      <Button
                        type="submit"
                        size="lg"
                        w="full"
                        bg="linear-gradient(135deg, #0ea5e9, #a855f7)"
                        color="white"
                        borderRadius="xl"
                        isLoading={isLoading || isSubmitting}
                        loadingText={t('auth.signIn.signingIn')}
                        _hover={{
                          transform: 'translateY(-1px)',
                          boxShadow: 'lg'
                        }}
                      >
                        {t('auth.signIn.signInButton')}
                      </Button>

                      <Box textAlign="center" w="full">
                        <Link to="/forgot-password">
                          <Text fontSize="sm" color="blue.500" fontWeight="600">
                            {t('auth.signIn.forgotPassword')}
                          </Text>
                        </Link>
                      </Box>
                    </VStack>
                  </form>
                </Box>
              </VStack>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}

export default SignIn