import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import iconImage from '../assets/icon.png'
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Image,
  Grid,
  Icon,
  Badge,
  Input,
  SimpleGrid,
  Spinner
} from '@chakra-ui/react'
import { 
  FaCheck,
  FaArrowLeft,
  FaPlay,
  FaGraduationCap,
  FaClock,
  FaUsers,
  FaShieldAlt,
  FaLock,
  FaCreditCard,
  FaStar,
  FaHeart,
  FaGift,
  FaExternalLinkAlt,
  FaFileInvoice
} from 'react-icons/fa'
import toast from 'react-hot-toast'

const Purchase = () => {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  const { t } = useLanguage()
  const [selectedPlan, setSelectedPlan] = useState('lifetime')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState(null)
  const [paymentId, setPaymentId] = useState(null)
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    phone: user?.phone || '',
    city: user?.city || '',
    address: user?.address || '',
    postalCode: user?.postal_code || '',
    taxId: user?.tax_id || ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRegisterAndPurchase = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let currentUser = user

      if (!currentUser) {
        const registerData = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          postal_code: formData.postalCode,
          tax_id: formData.taxId,
          password: Math.random().toString(36).slice(-8),
          password_confirmation: ''
        }
        registerData.password_confirmation = registerData.password

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerData)
        })

        if (!response.ok) {
          throw new Error('Registration failed')
        }

        const authData = await response.json()
        login(authData.user)
        currentUser = authData.user
        toast.success('Account created successfully!')
      }

      const paymentResponse = await fetch('/api/payments/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        }
      })

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json()
        throw new Error(errorData.message || 'Payment initialization failed')
      }

      const paymentData = await paymentResponse.json()
      
      setPaymentUrl(paymentData.payment_url)
      setPaymentId(paymentData.payment_id || paymentData.invoice_id)
      
      toast.success('Payment link created! Redirecting to Invoice4U...')
      
      setTimeout(() => {
        window.open(paymentData.payment_url, '_blank')
        setIsCheckingPayment(true)
        startPaymentCheck(paymentData.payment_id || paymentData.invoice_id)
      }, 1000)

    } catch (error) {
      console.error('Purchase process failed:', error)
      toast.error(error.message || 'Purchase failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const startPaymentCheck = (paymentId) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payments/${paymentId}/status`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        })

        if (!response.ok) return

        const data = await response.json()
        
        if (data.status === 'succeeded') {
          clearInterval(interval)
          setIsCheckingPayment(false)
          toast.success('Payment completed successfully!')
          navigate('/app/courses')
          return
        }
        
        if (data.status === 'failed' || data.status === 'cancelled') {
          clearInterval(interval)
          setIsCheckingPayment(false)
          toast.error('Payment was not completed. Please try again.')
          setPaymentUrl(null)
          setPaymentId(null)
        }
      } catch (error) {
        console.error('Payment check failed:', error)
      }
    }, 5000)

    setTimeout(() => {
      clearInterval(interval)
      setIsCheckingPayment(false)
    }, 300000)
  }

  const handleManualCheck = async () => {
    if (!paymentId) return
    
    setIsCheckingPayment(true)
    try {
      const response = await fetch(`/api/payments/${paymentId}/status`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })

      if (!response.ok) {
        toast.error('Failed to check payment status')
        return
      }

      const data = await response.json()
      
      if (data.status === 'succeeded') {
        toast.success('Payment confirmed! Redirecting...')
        navigate('/app/courses')
        return
      }
      
      toast.info(`Payment status: ${data.status}`)
    } catch (error) {
      toast.error('Failed to check payment status')
    } finally {
      setIsCheckingPayment(false)
    }
  }

  const features = [
    {
      icon: FaPlay,
      title: t('purchase.features.videoLessons.title'),
      description: t('purchase.features.videoLessons.description')
    },
    {
      icon: FaGraduationCap,
      title: t('purchase.features.certification.title'),
      description: t('purchase.features.certification.description')
    },
    {
      icon: FaClock,
      title: t('purchase.features.lifetimeAccess.title'),
      description: t('purchase.features.lifetimeAccess.description')
    },
    {
      icon: FaUsers,
      title: t('purchase.features.expertSupport.title'),
      description: t('purchase.features.expertSupport.description')
    }
  ]

  const testimonials = [
    {
      name: t('purchase.testimonials.sarah.name'),
      role: t('purchase.testimonials.sarah.role'),
      content: t('purchase.testimonials.sarah.content'),
      rating: 5
    },
    {
      name: t('purchase.testimonials.mike.name'),
      role: t('purchase.testimonials.mike.role'),
      content: t('purchase.testimonials.mike.content'),
      rating: 5
    }
  ]

  const plans = [
    {
      id: 'basic',
      name: t('purchase.plans.basic.name'),
      price: 15,
      originalPrice: 30,
      period: 'one-time',
      features: t('purchase.plans.basic.features'),
      popular: false
    },
    {
      id: 'lifetime',
      name: t('purchase.plans.lifetime.name'),
      price: 20,
      originalPrice: 50,
      period: 'one-time',
      features: t('purchase.plans.lifetime.features'),
      popular: true
    }
  ]

  return (
    <Box bg="white" minH="100vh">
      <Box py={4} borderBottom="1px solid" borderColor="gray.200" bg="white" position="sticky" top={0} zIndex={1000}>
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

      <Container maxW="7xl" py={8}>
        {paymentUrl && (
          <Box 
            status="info" 
            mb={6} 
            borderRadius="lg"
            bg="blue.50"
            border="1px solid"
            borderColor="blue.200"
            p={4}
          >
            <HStack spacing={3}>
              <Icon as={FaFileInvoice} color="blue.500" />
              <VStack align="start" spacing={2} flex={1}>
                <Text fontWeight="600" color="blue.800">Payment Link Created</Text>
                <Text fontSize="sm" color="blue.700">
                  Click the button below to complete your payment with Invoice4U.
                </Text>
                <HStack spacing={3}>
                  <Button
                    as="a"
                    href={paymentUrl}
                    target="_blank"
                    size="sm"
                    colorScheme="blue"
                    leftIcon={<FaExternalLinkAlt />}
                  >
                    Open Payment Link
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleManualCheck}
                    isLoading={isCheckingPayment}
                    leftIcon={<FaFileInvoice />}
                  >
                    Check Payment Status
                  </Button>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        )}

        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={12}>
          <VStack spacing={8} align="stretch">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <VStack spacing={6} align="start">
                <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="full">
                  <HStack spacing={1}>
                    <Icon as={FaHeart} w={3} h={3} />
                    <Text>{t('purchase.mostPopularCourse')}</Text>
                  </HStack>
                </Badge>
                
                <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.900">
                  {t('purchase.courseTitle')}
                </Heading>
                
                <Text fontSize="lg" color="gray.600" lineHeight="relaxed">
                  {t('purchase.courseDescription')}
                </Text>

                <HStack spacing={6} py={4}>
                  <VStack>
                    <Text fontSize="2xl" fontWeight="800" color="blue.500">40+</Text>
                    <Text fontSize="sm" color="gray.600">{t('landing.stats.videoLessons')}</Text>
                  </VStack>
                  <VStack>
                    <Text fontSize="2xl" fontWeight="800" color="blue.500">15k+</Text>
                    <Text fontSize="sm" color="gray.600">{t('landing.stats.happyStudents')}</Text>
                  </VStack>
                  <VStack>
                    <Text fontSize="2xl" fontWeight="800" color="blue.500">4.9</Text>
                    <Text fontSize="sm" color="gray.600">Rating</Text>
                  </VStack>
                </HStack>
              </VStack>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <VStack spacing={4} align="stretch">
                <Heading size="md" color="gray.900">{t('purchase.whatYouGet')}</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {features.map((feature, index) => (
                    <Box key={index} p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
                      <HStack spacing={3}>
                        <Box
                          w={10}
                          h={10}
                          bg="blue.100"
                          color="blue.600"
                          borderRadius="lg"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={feature.icon} w={5} h={5} />
                        </Box>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="600" color="gray.900" fontSize="sm">
                            {feature.title}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            {feature.description}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <VStack spacing={4} align="stretch">
                <Heading size="md" color="gray.900">{t('purchase.studentSuccessStories')}</Heading>
                <VStack spacing={4}>
                  {testimonials.map((testimonial, index) => (
                    <Box key={index} p={4} bg="gray.50" borderRadius="lg">
                      <VStack align="start" spacing={2}>
                        <HStack spacing={1}>
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Icon key={i} as={FaStar} color="yellow.400" w={4} h={4} />
                          ))}
                        </HStack>
                        <Text fontSize="sm" color="gray.700" fontStyle="italic">
                          "{testimonial.content}"
                        </Text>
                        <Text fontSize="xs" fontWeight="600" color="gray.900">
                          {testimonial.name} - {testimonial.role}
                        </Text>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </VStack>
            </motion.div>
          </VStack>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Box 
              bg="white" 
              borderRadius="2xl" 
              boxShadow="xl" 
              border="1px solid" 
              borderColor="gray.200"
              position="sticky"
              top="100px"
            >
              <Box p={6}>
                <VStack spacing={6} align="stretch">
                  <VStack spacing={3} textAlign="center">
                    <Badge colorScheme="red" fontSize="sm" px={3} py={1} borderRadius="full">
                      <HStack spacing={1}>
                        <Icon as={FaGift} w={3} h={3} />
                        <Text>{t('purchase.limitedTimeOffer')}</Text>
                      </HStack>
                    </Badge>
                    <Heading size="lg" color="gray.900">{t('purchase.choosePlan')}</Heading>
                  </VStack>

                  <VStack spacing={3}>
                    {plans.map((plan) => (
                      <Box
                        key={plan.id}
                        w="full"
                        p={4}
                        borderRadius="lg"
                        border="2px solid"
                        borderColor={selectedPlan === plan.id ? "blue.400" : "gray.200"}
                        bg={selectedPlan === plan.id ? "blue.50" : "white"}
                        position="relative"
                        cursor="pointer"
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {plan.popular && (
                          <Badge
                            position="absolute"
                            top="-8px"
                            left="50%"
                            transform="translateX(-50%)"
                            bg="gradient-primary"
                            color="white"
                            fontSize="xs"
                            px={2}
                            py={1}
                            borderRadius="full"
                          >
                            {t('purchase.mostPopular')}
                          </Badge>
                        )}
                        
                        <HStack justify="space-between">
                          <Box
                            w={4}
                            h={4}
                            borderRadius="full"
                            border="2px solid"
                            borderColor={selectedPlan === plan.id ? "blue.500" : "gray.300"}
                            bg={selectedPlan === plan.id ? "blue.500" : "white"}
                            position="relative"
                          >
                            {selectedPlan === plan.id && (
                              <Box
                                w={2}
                                h={2}
                                borderRadius="full"
                                bg="white"
                                position="absolute"
                                top="50%"
                                left="50%"
                                transform="translate(-50%, -50%)"
                              />
                            )}
                          </Box>
                          <VStack align="start" flex={1} spacing={1}>
                            <HStack>
                              <Text fontWeight="600" color="gray.900">{plan.name}</Text>
                              {plan.popular && <Icon as={FaStar} color="yellow.400" w={4} h={4} />}
                            </HStack>
                            <HStack spacing={2}>
                              <Text fontSize="2xl" fontWeight="800" color="gray.900">
                                ${plan.price}
                              </Text>
                              <Text fontSize="lg" textDecoration="line-through" color="gray.500">
                                ${plan.originalPrice}
                              </Text>
                            </HStack>
                          </VStack>
                          <Text fontSize="sm" color="green.600" fontWeight="600">
                            Save ${plan.originalPrice - plan.price}
                          </Text>
                        </HStack>
                        
                        <VStack align="start" spacing={1} mt={3} fontSize="sm">
                          {plan.features.map((feature, index) => (
                            <HStack key={index} spacing={2}>
                              <Icon as={FaCheck} color="green.500" w={3} h={3} />
                              <Text color="gray.600">{feature}</Text>
                            </HStack>
                          ))}
                        </VStack>
                      </Box>
                    ))}
                  </VStack>

                  <Box h="1px" bg="gray.200" w="full" my={2} />

                  <form onSubmit={handleRegisterAndPurchase}>
                    <VStack spacing={4}>
                      <Grid templateColumns="repeat(2, 1fr)" gap={3} w="full">
                        <VStack align="start" spacing={2}>
                          <Text fontSize="sm" fontWeight="medium">First Name *</Text>
                          <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="John"
                            required
                            borderRadius="lg"
                          />
                        </VStack>
                        <VStack align="start" spacing={2}>
                          <Text fontSize="sm" fontWeight="medium">Last Name *</Text>
                          <Input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Doe"
                            required
                            borderRadius="lg"
                          />
                        </VStack>
                      </Grid>

                      <VStack align="start" spacing={2} w="full">
                        <Text fontSize="sm" fontWeight="medium">Email *</Text>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          required
                          borderRadius="lg"
                        />
                      </VStack>

                      <VStack align="start" spacing={2} w="full">
                        <Text fontSize="sm" fontWeight="medium">Phone</Text>
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+972-50-123-4567"
                          borderRadius="lg"
                        />
                      </VStack>

                      <Grid templateColumns="repeat(2, 1fr)" gap={3} w="full">
                        <VStack align="start" spacing={2}>
                          <Text fontSize="sm" fontWeight="medium">City</Text>
                          <Input
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Tel Aviv"
                            borderRadius="lg"
                          />
                        </VStack>
                        <VStack align="start" spacing={2}>
                          <Text fontSize="sm" fontWeight="medium">Postal Code</Text>
                          <Input
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            placeholder="12345"
                            borderRadius="lg"
                          />
                        </VStack>
                      </Grid>

                      <VStack align="start" spacing={2} w="full">
                        <Text fontSize="sm" fontWeight="medium">Address</Text>
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="123 Main Street"
                          borderRadius="lg"
                        />
                      </VStack>

                      <VStack align="start" spacing={2} w="full">
                        <Text fontSize="sm" fontWeight="medium">Tax ID (Optional)</Text>
                        <Input
                          name="taxId"
                          value={formData.taxId}
                          onChange={handleInputChange}
                          placeholder="Israeli tax ID"
                          borderRadius="lg"
                        />
                      </VStack>

                      <Box w="full" p={4} bg="gray.50" borderRadius="lg">
                        <HStack justify="space-between" mb={2}>
                          <Text>Course Price:</Text>
                          <HStack>
                            <Text textDecoration="line-through" color="gray.500">
                              ${plans.find(p => p.id === selectedPlan)?.originalPrice}
                            </Text>
                            <Text fontWeight="600">
                              ${plans.find(p => p.id === selectedPlan)?.price}
                            </Text>
                          </HStack>
                        </HStack>
                        <HStack justify="space-between" fontSize="lg" fontWeight="700">
                          <Text>Total:</Text>
                          <Text color="green.600">
                            ${plans.find(p => p.id === selectedPlan)?.price}
                          </Text>
                        </HStack>
                      </Box>

                      <Button
                        type="submit"
                        size="lg"
                        w="full"
                        bg="gradient-primary"
                        color="white"
                        py={6}
                        fontSize="lg"
                        fontWeight="600"
                        borderRadius="xl"
                        isLoading={isLoading}
                        loadingText="Creating Payment..."
                        leftIcon={<Icon as={FaFileInvoice} />}
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: 'xl'
                        }}
                      >
                        {user ? 'Purchase Course' : 'Register & Purchase'}
                      </Button>

                      <HStack spacing={2} justify="center" fontSize="xs" color="gray.500">
                        <Icon as={FaLock} />
                        <Text>Secure payment via Invoice4U</Text>
                      </HStack>
                    </VStack>
                  </form>
                </VStack>
              </Box>
            </Box>
          </motion.div>
        </Grid>
      </Container>
    </Box>
  )
}

export default Purchase