import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
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
  Image
} from '@chakra-ui/react'
import iconImage from '../assets/icon.png'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/backend/api/password/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: data.email })
      })
      const result = await response.json()
      if (response.ok) {
        toast.success('Password reset link sent to your email.')
      } else {
        toast.error(result.message || 'Failed to send reset link.')
      }
    } catch (err) {
      toast.error('Network error. Please try again.')
    }
    setIsSubmitting(false)
  }

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)">
      <Box py={4} borderBottom="1px solid" borderColor="gray.200" bg="white">
        <Container maxW="7xl">
          <Flex justify="space-between" align="center">
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
            <Button
              variant="ghost"
              onClick={() => navigate('/signin')}
              size="sm"
            >
              Back to Sign In
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
                    Forgot Password
                  </Heading>
                  <Text color="gray.600">
                    Enter your email to receive a password reset link.
                  </Text>
                </VStack>
                <Box w="full">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing={4}>
                      <Box w="full">
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                          Email Address *
                        </Text>
                        <Input
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
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
                      <Button
                        type="submit"
                        size="lg"
                        w="full"
                        bg="linear-gradient(135deg, #0ea5e9, #a855f7)"
                        color="white"
                        borderRadius="xl"
                        isLoading={isSubmitting}
                        loadingText="Sending..."
                        _hover={{
                          transform: 'translateY(-1px)',
                          boxShadow: 'lg'
                        }}
                      >
                        Send Reset Link
                      </Button>
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

export default ForgotPassword
