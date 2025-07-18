import { useEffect, useState } from 'react'
import api from '../lib/api'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Icon,
  Circle,
  Spinner,
  HStack
} from '@chakra-ui/react'
import {
  FaCheckCircle,
  FaArrowRight,
  FaGraduationCap,
  FaPlay,
  FaClock,
  FaUsers,
  FaExclamationTriangle
} from 'react-icons/fa'
import { motion } from 'framer-motion'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(true)
  const [paymentVerified, setPaymentVerified] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const verifyPayment = async () => {
      if (!user) {
        navigate('/login')
        return
      }

      try {
        const data = await api.get('/payments/access')
        if (data.has_access) {
          setPaymentVerified(true)
        } else {
          setError('Payment verification pending. Please check your email or contact support.')
        }
      } catch (error) {
        console.error('Payment verification failed:', error)
        setError('Unable to verify payment. Please contact support.')
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [user, navigate])

  const handleContinueToCourse = () => {
    navigate('/app/courses')
  }

  if (isVerifying) {
    return (
      <Box bg="gray.50" minH="100vh" display="flex" alignItems="center">
        <Container maxW="md">
          <VStack spacing={6} textAlign="center">
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <VStack spacing={2}>
              <Heading size="lg" color="gray.800">
                Verifying Your Payment
              </Heading>
              <Text color="gray.600">
                Please wait while we confirm your payment...
              </Text>
            </VStack>
          </VStack>
        </Container>
      </Box>
    )
  }

  if (error) {
    return (
      <Box bg="gray.50" minH="100vh" display="flex" alignItems="center">
        <Container maxW="md">
          <VStack spacing={6}>
            <Box p={4} bg="orange.50" borderRadius="lg" border="1px solid" borderColor="orange.200" w="full">
              <HStack spacing={3} align="start">
                <Icon as={FaExclamationTriangle} color="orange.500" mt={1} />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="600" color="orange.800">Payment Verification Issue</Text>
                  <Text fontSize="sm" color="orange.700">{error}</Text>
                </VStack>
              </HStack>
            </Box>
            
            <VStack spacing={4} w="full">
              <Button
                colorScheme="blue"
                onClick={() => navigate('/purchase')}
                w="full"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/contact')}
                w="full"
              >
                Contact Support
              </Button>
            </VStack>
          </VStack>
        </Container>
      </Box>
    )
  }

  return (
    <Box bg="gray.50" minH="100vh" display="flex" alignItems="center">
      <Container maxW="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VStack spacing={8} textAlign="center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Circle size="24" bg="green.100">
                <Icon as={FaCheckCircle} boxSize="12" color="green.500" />
              </Circle>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <VStack spacing={4}>
                <Heading size="xl" color="gray.900">
                  🎉 Welcome to Massage Academy!
                </Heading>
                <Text fontSize="lg" color="gray.600" maxW="md">
                  Your payment was successful and you now have lifetime access to the 
                  Professional Relaxation Massage Therapy Course.
                </Text>
              </VStack>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Box
                bg="white"
                p={6}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="sm"
                w="full"
                maxW="md"
              >
                <VStack spacing={4}>
                  <Heading size="md" color="gray.800">
                    What's included in your course:
                  </Heading>
                  
                  <VStack spacing={3} w="full">
                    <HStack spacing={3} align="start" w="full">
                      <Icon as={FaPlay} color="blue.500" mt={1} />
                      <VStack align="start" spacing={0} flex={1}>
                        <Text fontWeight="600" fontSize="sm">40+ Video Lessons</Text>
                        <Text fontSize="xs" color="gray.600">
                          Professional massage techniques and theory
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <HStack spacing={3} align="start" w="full">
                      <Icon as={FaGraduationCap} color="blue.500" mt={1} />
                      <VStack align="start" spacing={0} flex={1}>
                        <Text fontWeight="600" fontSize="sm">Professional Certification</Text>
                        <Text fontSize="xs" color="gray.600">
                          Recognized certificate upon completion
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <HStack spacing={3} align="start" w="full">
                      <Icon as={FaClock} color="blue.500" mt={1} />
                      <VStack align="start" spacing={0} flex={1}>
                        <Text fontWeight="600" fontSize="sm">Lifetime Access</Text>
                        <Text fontSize="xs" color="gray.600">
                          Learn at your own pace, forever
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <HStack spacing={3} align="start" w="full">
                      <Icon as={FaUsers} color="blue.500" mt={1} />
                      <VStack align="start" spacing={0} flex={1}>
                        <Text fontWeight="600" fontSize="sm">Expert Support</Text>
                        <Text fontSize="xs" color="gray.600">
                          Get help when you need it
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <VStack spacing={4} w="full" maxW="md">
                <Button
                  size="lg"
                  colorScheme="blue"
                  rightIcon={<FaArrowRight />}
                  onClick={handleContinueToCourse}
                  w="full"
                  fontSize="lg"
                  py={6}
                >
                  Start Learning Now
                </Button>
                
                <Text fontSize="sm" color="gray.500">
                  You'll receive a confirmation email with your course access details.
                </Text>
              </VStack>
            </motion.div>
          </VStack>
        </motion.div>
      </Container>
    </Box>
  )
}

export default PaymentSuccess