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
  SimpleGrid
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
  FaPaypal,
  FaStar,
  FaHeart,
  FaGift
} from 'react-icons/fa'
import toast from 'react-hot-toast'

const Purchase = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useLanguage()
  const [selectedPlan, setSelectedPlan] = useState('lifetime')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePurchase = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      login({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        avatar: formData.firstName.charAt(0) + formData.lastName.charAt(0)
      })
      
      toast.success(t('purchase.purchaseSuccess'))
      navigate('/app/courses')
      setIsLoading(false)
    }, 2000)
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
                            {t('purchase.save', { amount: plan.originalPrice - plan.price })}
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

                  <form onSubmit={handlePurchase}>
                    <VStack spacing={4}>
                      <Grid templateColumns="repeat(2, 1fr)" gap={3} w="full">
                        <VStack align="start" spacing={2}>
                          <Text fontSize="sm" fontWeight="medium">{t('purchase.firstName')} *</Text>
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
                          <Text fontSize="sm" fontWeight="medium">{t('purchase.lastName')} *</Text>
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
                        <Text fontSize="sm" fontWeight="medium">{t('common.email')} *</Text>
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

                      <VStack align="start" spacing={3} w="full">
                        <Text fontSize="sm" fontWeight="medium">{t('purchase.paymentMethod')}</Text>
                        <VStack spacing={2}>
                          <HStack 
                            w="full" 
                            p={3} 
                            borderRadius="lg" 
                            border="2px solid" 
                            borderColor={paymentMethod === 'card' ? 'blue.400' : 'gray.200'}
                            bg={paymentMethod === 'card' ? 'blue.50' : 'white'}
                            cursor="pointer"
                            onClick={() => setPaymentMethod('card')}
                          >
                            <Box
                              w={4}
                              h={4}
                              borderRadius="full"
                              border="2px solid"
                              borderColor={paymentMethod === 'card' ? "blue.500" : "gray.300"}
                              bg={paymentMethod === 'card' ? "blue.500" : "white"}
                              position="relative"
                            >
                              {paymentMethod === 'card' && (
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
                            <Icon as={FaCreditCard} />
                            <Text>{t('purchase.creditCard')}</Text>
                          </HStack>
                          <HStack 
                            w="full" 
                            p={3} 
                            borderRadius="lg" 
                            border="2px solid" 
                            borderColor={paymentMethod === 'paypal' ? 'blue.400' : 'gray.200'}
                            bg={paymentMethod === 'paypal' ? 'blue.50' : 'white'}
                            cursor="pointer"
                            onClick={() => setPaymentMethod('paypal')}
                          >
                            <Box
                              w={4}
                              h={4}
                              borderRadius="full"
                              border="2px solid"
                              borderColor={paymentMethod === 'paypal' ? "blue.500" : "gray.300"}
                              bg={paymentMethod === 'paypal' ? "blue.500" : "white"}
                              position="relative"
                            >
                              {paymentMethod === 'paypal' && (
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
                            <Icon as={FaPaypal} color="blue.500" />
                            <Text>{t('purchase.paypal')}</Text>
                          </HStack>
                        </VStack>
                      </VStack>

                      {paymentMethod === 'card' && (
                        <VStack spacing={3} w="full">
                          <VStack align="start" spacing={2} w="full">
                            <Text fontSize="sm" fontWeight="medium">{t('purchase.cardNumber')} *</Text>
                            <Input
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              placeholder="1234 5678 9012 3456"
                              required
                              borderRadius="lg"
                            />
                          </VStack>
                          <Grid templateColumns="repeat(2, 1fr)" gap={3} w="full">
                            <VStack align="start" spacing={2}>
                              <Text fontSize="sm" fontWeight="medium">{t('purchase.expiryDate')} *</Text>
                              <Input
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                placeholder="MM/YY"
                                required
                                borderRadius="lg"
                              />
                            </VStack>
                            <VStack align="start" spacing={2}>
                              <Text fontSize="sm" fontWeight="medium">{t('purchase.cvv')} *</Text>
                              <Input
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                placeholder="123"
                                required
                                borderRadius="lg"
                              />
                            </VStack>
                          </Grid>
                        </VStack>
                      )}

                      <Box w="full" p={4} bg="gray.50" borderRadius="lg">
                        <HStack justify="space-between" mb={2}>
                          <Text>{t('purchase.coursePrice')}:</Text>
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
                          <Text>{t('purchase.total')}:</Text>
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
                        loadingText={t('purchase.processing')}
                        leftIcon={<Icon as={FaShieldAlt} />}
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: 'xl'
                        }}
                      >
                        {t('purchase.completePurchase')}
                      </Button>

                      <HStack spacing={2} justify="center" fontSize="xs" color="gray.500">
                        <Icon as={FaLock} />
                        <Text>{t('purchase.securePayment')}</Text>
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