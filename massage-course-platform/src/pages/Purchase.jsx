import { useState, useEffect, useRef } from 'react'
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
  Spinner,
  Progress,
  Circle
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
  FaCheckCircle,
  FaSpinner,
  FaTimes,
  FaInfoCircle
} from 'react-icons/fa'

import api from '../lib/api'
import ReactGA from 'react-ga4';
import toast from 'react-hot-toast'

import { useLocation } from 'react-router-dom'
const Purchase = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t, currentLanguage, changeLanguage } = useLanguage()
  const location = useLocation()
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const lang = params.get('lang')
    if (lang && lang !== currentLanguage) {
      changeLanguage(lang)
    }
  }, [location.search, currentLanguage, changeLanguage])
  
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentData, setPaymentData] = useState(null)
  const [paymentStep, setPaymentStep] = useState('form')
  const [showPaymentIframe, setShowPaymentIframe] = useState(false)
  const [isIframeLoading, setIsIframeLoading] = useState(false)
  const [iframeUrl, setIframeUrl] = useState("")
  const [iframePaymentId, setIframePaymentId] = useState(null)
  const [formData, setFormData] = useState({
    email: user?.email || '',
    first_name: user?.name?.split(' ')[0] || '',
    last_name: user?.name?.split(' ').slice(1).join(' ') || '',
    phone: user?.phone || ''
  })

  const iframeId = 'allpay-hosted-fields-iframe'
  const allpayRef = useRef(null)

  const plans = [
    {
      id: 'basic',
      name: 'Basic Course',
      price: 15,
      originalPrice: 39,
      period: 'one-time',
      features: [
        '20+ Video Lessons',
        'Basic Massage Techniques',
        'Course Materials',
        'Email Support',
        '6 Months Access'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Course',
      price: 20,
      originalPrice: 49,
      period: 'one-time',
      features: [
        '40+ Video Lessons',
        'Advanced Techniques',
        'Professional Certification',
        'Lifetime Access',
        'Expert Support',
        'Downloadable Resources'
      ],
      popular: true
    }
  ]

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

  useEffect(() => {
    if (!user) return
    
    setFormData(prev => ({
      ...prev,
      email: user.email || prev.email,
      first_name: user.name?.split(' ')[0] || prev.first_name,
      last_name: user.name?.split(' ').slice(1).join(' ') || prev.last_name,
      phone: user.phone || prev.phone
    }))
  }, [user])

  useEffect(() => {
    if (!showPaymentIframe || !iframeUrl) return

    const handleMessage = (event) => {
      if (event.origin !== 'https://allpay.to') return
      
      const { data } = event
      
      if (data.type === 'payment_success' || data.status === 'success') {
        toast.success('Payment success!')
        setShowPaymentIframe(false)
        startPaymentCheck(iframePaymentId)
        return
      }
      
      if (data.type === 'payment_error' || data.status === 'error') {
        if (!(data.message === 'Authentication token is required' && data.error === 'Unauthenticated')) {
          toast.error('Payment error: ' + (data.message || 'Unknown error'))
        }
        return
      }
      
      if (data.type === 'payment_cancelled' || data.status === 'cancelled') {
        toast.info('Payment was cancelled')
        setShowPaymentIframe(false)
        setIsPaymentModalOpen(false)
      }
    }
    
    window.addEventListener('message', handleMessage)
    
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [showPaymentIframe, iframeUrl, iframePaymentId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const initializeAllpay = () => {
    allpayRef.current = new AllpayPayment({
      iframeId: iframeId,
      onSuccess: function() {
        toast.success('Payment success!')
        setShowPaymentIframe(false)
        startPaymentCheck(iframePaymentId)
      },
      onError: function(error_n, error_msg) {
        if (!(error_msg === 'Unauthenticated' || error_n === 'Authentication token is required')) {
          toast.error('Payment error: ' + error_n + ' (' + error_msg + ')')
        }
      }
    })
  }

  const checkPaymentStatus = async (paymentId) => {
    try {
      const headers = {}
      if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`
      }

      const data = await api.get(`/payments/status?payment_id=${paymentId}`, {
        headers
      })
      return data
    } catch (error) {
      console.error('Payment check failed:', error)
      
      if (error.status === 404) {
        toast.error('Payment not found. Please try again.')
        return null
      }
      
      return null
    }
  }

  const startPaymentCheck = (paymentId) => {
    setIsCheckingPayment(true)

    let autologinDone = false;
    const interval = setInterval(async () => {
      // Check payment status as before
      const data = await checkPaymentStatus(paymentId)
      if (!data) return

      if (data.status === 'succeeded' && !autologinDone) {
        autologinDone = true;
        // Try to get autologin token from webhook endpoint
        try {
          const webhookRes = await api.post('/payments/allpay/webhook', {
            order_id: paymentData.order_id,
            status: '1',
            amount: paymentData.amount
          }, {
            headers: { 'X-Webhook-Secret': '875B3286184914E0AC9181080AB4ED30' }
          });
          if (webhookRes && webhookRes.token) {
            // Use Zustand auth store to log in
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_token', webhookRes.token);
            }
            if (typeof window !== 'undefined') {
              window.location.href = '/app/courses';
            }
            clearInterval(interval);
            setIsCheckingPayment(false);
            setPaymentStep('success');
            toast.success('Payment completed! Logging you in...');
            return;
          }
        } catch (err) {
          // fallback: just show success
          setPaymentStep('success');
          toast.success('Payment completed successfully!');
          setTimeout(() => {
            setIsPaymentModalOpen(false);
            navigate('/payment-success');
          }, 3000);
          clearInterval(interval);
          setIsCheckingPayment(false);
          return;
        }
      }

      if (data.status === 'failed' || data.status === 'cancelled') {
        clearInterval(interval);
        setIsCheckingPayment(false);
        setPaymentStep('form');
        toast.error('Payment was not completed. Please try again.');
        setIsPaymentModalOpen(false);
      }
    }, 3000);

    setTimeout(() => {
      clearInterval(interval);
      setIsCheckingPayment(false);
      if (paymentStep !== 'success') {
        setPaymentStep('form');
        setIsPaymentModalOpen(false);
        toast.info('Payment check timed out. Please check your payment status manually.');
      }
    }, 300000);
  }

  const handleManualCheck = async () => {
    if (!paymentData?.payment_id) {
      toast.error('No payment ID available')
      return
    }
    
    setIsCheckingPayment(true)
    
    try {
      const data = await checkPaymentStatus(paymentData.payment_id)
      
      if (!data) {
        // suppress toast for unauthenticated
        return
      }
      
      if (data.status === 'succeeded') {
        setPaymentStep('success')
        toast.success('Payment confirmed! Redirecting...')
        setTimeout(() => {
          setIsPaymentModalOpen(false)
          navigate('/payment-success')
        }, 2000)
        return
      }
      
      toast.info(`Payment status: ${data.status}`)
    } catch (error) {
      if (!(error?.message === 'Authentication token is required' && error?.error === 'Unauthenticated')) {
        toast.error('Failed to check payment status')
      }
    } finally {
      setIsCheckingPayment(false)
    }
  }

  const handlePurchase = async (e) => {
    e.preventDefault()
    ReactGA.event({
      category: 'PurchasePage',
      action: 'Click',
      label: 'Purchase Button',
      nonInteraction: false
    });
    setIsLoading(true)

    try {
      const selectedPlanData = plans.find(p => p.id === selectedPlan)
      
      const paymentRequestData = {
        provider: 'allpay',
        amount: selectedPlanData.price,
        plan: selectedPlan,
        user_data: {
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone
        }
      }

      const headers = {
        'Content-Type': 'application/json'
      }

      if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`
      }

      const paymentResponse = await api.post('/payments/intent', paymentRequestData, {
        headers
      })

      setPaymentData(paymentResponse)
      
      if (paymentResponse.user_created) {
        toast.success('Account created successfully!')
      }
      
      if (!paymentResponse.payment_url) {
        throw new Error('Invalid payment response - no payment URL')
      }
      
      setPaymentStep('payment')
      setIframeUrl(paymentResponse.payment_url)
      setIframePaymentId(paymentResponse.payment_id)
      setIsIframeLoading(true)
      setShowPaymentIframe(true)
      setIsPaymentModalOpen(true)

    } catch (error) {
      console.error('Purchase process failed:', error)
      if (!(error?.message === 'Authentication token is required' && error?.error === 'Unauthenticated')) {
        toast.error(error.message || 'Purchase failed. Please try again.')
      }
      setPaymentStep('form')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentExecute = () => {
    if (!allpayRef.current) {
      toast.error('Payment system not ready. Please try again.')
      return
    }
    
    allpayRef.current.pay()
  }

  const closeModal = () => {
    setIsPaymentModalOpen(false)
    setShowPaymentIframe(false)
  }

  const renderPaymentModal = () => {
    if (!isPaymentModalOpen) return null

    const getModalContent = () => {
      if (paymentStep === 'processing') {
        return (
          <VStack spacing={4}>
            <Progress size="lg" isIndeterminate colorScheme="blue" w="full" />
            <Text textAlign="center" color="gray.600">
              Setting up your payment with Allpay...
            </Text>
          </VStack>
        )
      }

      if (paymentStep === 'payment' && showPaymentIframe && iframeUrl) {
        return (
          <VStack spacing={4} w="full">
            <Box w="full" h="230px" borderRadius="lg" overflow="hidden" border="1px solid" borderColor="blue.200" position="relative">
              {isIframeLoading && (
                <Flex
                  position="absolute"
                  top={0}
                  left={0}
                  w="full"
                  h="230px"
                  align="center"
                  justify="center"
                  bg="whiteAlpha.900"
                  zIndex={2}
                >
                  <VStack spacing={3}>
                    <Spinner size="xl" color="blue.400" thickness="4px" speed="0.7s" />
                    <Text color="gray.600">Loading secure payment form...</Text>
                  </VStack>
                </Flex>
              )}
              <iframe
                id={iframeId}
                src={iframeUrl}
                title="Allpay Payment"
                width="100%"
                height="230px"
                style={{ border: 'none', display: isIframeLoading ? 'none' : 'block' }}
                allow="payment; camera; microphone; geolocation"
                sandbox="allow-scripts allow-forms allow-same-origin allow-top-navigation allow-popups"
                onLoad={() => {
                  setIsIframeLoading(false)
                  setTimeout(() => {
                    initializeAllpay()
                  }, 100)
                }}
                onError={() => {
                  setIsIframeLoading(false)
                  toast.error('Failed to load payment form')
                }}
              />
            </Box>

            <Button
              colorScheme="blue"
              size="lg"
              w="full"
              onClick={handlePaymentExecute}
              isLoading={isCheckingPayment || isIframeLoading}
              isDisabled={isCheckingPayment || isIframeLoading}
            >
              Pay
            </Button>

            <VStack spacing={3} w="full">
              <HStack spacing={2} justify="center">
                <Circle size="6" bg={isCheckingPayment ? 'blue.500' : 'gray.300'}>
                  {isCheckingPayment ? (
                    <Spinner size="xs" color="white" />
                  ) : (
                    <Text fontSize="xs" color="white">1</Text>
                  )}
                </Circle>
                <Text fontSize="sm" color={isCheckingPayment ? 'blue.600' : 'gray.500'}>
                  {isCheckingPayment ? 'Checking payment status...' : 'Complete payment above'}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        )
      }

      if (paymentStep === 'payment' && !showPaymentIframe) {
        return (
          <VStack spacing={4}>
            <Box p={4} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200" w="full">
              <HStack spacing={3} align="start">
                <FaInfoCircle style={{ color: '#3182CE', marginTop: '4px' }} />
                <VStack align="start" spacing={1} fontSize="sm">
                  <Text fontWeight="600" color="blue.800">
                    Complete payment in the window below
                  </Text>
                  <Text color="blue.700">
                    A secure payment window will appear here. Complete your payment below.
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </VStack>
        )
      }

      if (paymentStep === 'success') {
        return (
          <VStack spacing={6} textAlign="center">
            <Circle size="20" bg="green.100" display="flex" alignItems="center" justifyContent="center">
              <FaCheckCircle style={{ fontSize: '40px', color: '#38A169' }} />
            </Circle>
            <VStack spacing={2}>
              <Heading size="lg" color="green.600">Payment Successful!</Heading>
              <Text color="gray.600">
                Welcome to the Professional Massage Therapy Course!
              </Text>
            </VStack>
            <Box w="full" p={4} bg="green.50" borderRadius="lg" border="1px solid" borderColor="green.200">
              <VStack spacing={2}>
                <Text fontWeight="600" color="green.800">
                  🎉 You now have access to:
                </Text>
                <VStack spacing={1} fontSize="sm" color="green.700">
                  <Text>✓ Professional Video Lessons</Text>
                  <Text>✓ Downloadable Course Materials</Text>
                  <Text>✓ Professional Certification</Text>
                  <Text>✓ Expert Support Community</Text>
                </VStack>
              </VStack>
            </Box>
            <Text fontSize="sm" color="gray.500">
              Redirecting to success page in a few seconds...
            </Text>
          </VStack>
        )
      }

      return null
    }

    const getModalTitle = () => {
      if (paymentStep === 'processing') return 'Processing Payment...'
      if (paymentStep === 'payment') return 'Complete Your Payment'
      if (paymentStep === 'success') return 'Payment Successful!'
      return ''
    }

    const getModalIcon = () => {
      if (paymentStep === 'processing') return <Spinner size="sm" />
      if (paymentStep === 'payment') return <FaCreditCard style={{ color: '#3182CE' }} />
      if (paymentStep === 'success') return <FaCheckCircle style={{ color: '#38A169' }} />
      return null
    }

    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        zIndex={1000}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="2xl"
          maxW="lg"
          w="full"
          maxH="90vh"
          overflow="auto"
        >
          <Box p={6} borderBottom="1px solid" borderColor="gray.200">
            <Flex alignItems="center" justify="space-between">
              <HStack spacing={3}>
                {getModalIcon()}
                <Text fontSize="lg" fontWeight="600">
                  {getModalTitle()}
                </Text>
              </HStack>
              {paymentStep !== 'success' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={closeModal}
                >
                  <FaTimes style={{ color: '#4A5568' }} />
                </Button>
              )}
            </Flex>
          </Box>
          <Box p={6}>
            {getModalContent()}
          </Box>
        </Box>
      </Box>
    )
  }

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
              variant="ghost"
              onClick={() => navigate('/')}
              size="sm"
            >
              <HStack spacing={2}>
                <FaArrowLeft style={{ color: '#4A5568' }} />
                <Text>{t('common.backToHome')}</Text>
              </HStack>
            </Button>
          </Flex>
        </Container>
      </Box>

      <Container maxW="7xl" py={8}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={12}>
          <VStack spacing={8} align="stretch">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <VStack spacing={6} align="start">
                <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="full">
                  <HStack spacing={1}>
                    <FaHeart style={{ width: '12px', height: '12px', color: '#E53E3E' }} />
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
                          borderRadius="lg"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={feature.icon} w={5} h={5} color="blue.600" />
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
                            <FaStar key={i} style={{ width: '16px', height: '16px', color: '#F6E05E' }} />
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
                        <FaGift style={{ width: '12px', height: '12px', color: '#E53E3E' }} />
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
                            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
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
                              {plan.popular && <FaStar style={{ width: '16px', height: '16px', color: '#F6E05E' }} />}
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
                              <FaCheck style={{ width: '12px', height: '12px', color: '#38A169' }} />
                              <Text color="gray.600">{feature}</Text>
                            </HStack>
                          ))}
                        </VStack>
                      </Box>
                    ))}
                  </VStack>

                  <Box h="1px" bg="gray.200" w="full" my={2} />

                  <form onSubmit={handlePurchase}>
                    <VStack spacing={4}>
                      <Grid templateColumns="repeat(2, 1fr)" gap={3} w="full">
                        <VStack align="start" spacing={2}>
                          <Text fontSize="sm" fontWeight="medium">First Name *</Text>
                          <Input
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            placeholder="John"
                            required
                            borderRadius="lg"
                          />
                        </VStack>
                        <VStack align="start" spacing={2}>
                          <Text fontSize="sm" fontWeight="medium">Last Name *</Text>
                          <Input
                            name="last_name"
                            value={formData.last_name}
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
                        <Text fontSize="sm" fontWeight="medium">Phone *</Text>
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+972-50-123-4567"
                          required
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
                        bg={isLoading ? "gray.400" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}
                        color="white"
                        py={6}
                        fontSize="lg"
                        fontWeight="600"
                        borderRadius="xl"
                        isLoading={isLoading}
                        loadingText="Processing..."
                        spinner={<Spinner size="sm" color="white" />}
                        isDisabled={isLoading}
                        _hover={!isLoading ? {
                          transform: 'translateY(-2px)',
                          boxShadow: 'xl',
                          bg: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)"
                        } : {}}
                        _loading={{
                          bg: "gray.400",
                          color: "white",
                          cursor: "not-allowed"
                        }}
                      >
                        <HStack spacing={2}>
                          <FaCreditCard style={{ color: 'white' }} />
                          <Text>Start Learning Now</Text>
                        </HStack>
                      </Button>

                      <HStack spacing={2} justify="center" fontSize="xs" color="gray.500">
                        <FaLock style={{ color: '#A0AEC0' }} />
                        <Text>Secure payment via Allpay</Text>
                      </HStack>
                    </VStack>
                  </form>
                </VStack>
              </Box>
            </Box>
          </motion.div>
        </Grid>
      </Container>

      {renderPaymentModal()}
    </Box>
  )
}

export default Purchase