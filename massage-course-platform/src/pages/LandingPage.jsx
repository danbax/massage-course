import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import LanguageSelector from '../components/ui/LanguageSelector'
import iconImage from '../assets/icon.png'
import massageLaptop from '../assets/massage_laptop.png'
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  Grid,
  Image,
  VStack,
  HStack,
  IconButton,
  Badge,
  SimpleGrid,
  useBreakpointValue,
  Icon
} from '@chakra-ui/react'
import { 
  FaPlay, 
  FaGraduationCap, 
  FaClock, 
  FaUsers, 
  FaCheck,
  FaStar,
  FaQuoteLeft,
  FaArrowRight,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaShieldAlt,
  FaMedal,
  FaGlobe
} from 'react-icons/fa'

const LandingPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useLanguage()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleStartTrial = () => {
    navigate('/purchase')
  }

  const features = [
    {
      icon: FaPlay,
      title: t('landing.features.videoLessons.title'),
      description: t('landing.features.videoLessons.description'),
      color: 'primary',
      gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)'
    },
    {
      icon: FaGraduationCap,
      title: t('landing.features.certification.title'),
      description: t('landing.features.certification.description'),
      color: 'secondary',
      gradient: 'linear-gradient(135deg, #a855f7, #c084fc)'
    },
    {
      icon: FaClock,
      title: t('landing.features.lifetimeAccess.title'),
      description: t('landing.features.lifetimeAccess.description'),
      color: 'accent',
      gradient: 'linear-gradient(135deg, #22c55e, #4ade80)'
    },
    {
      icon: FaUsers,
      title: t('landing.features.resources.title'),
      description: t('landing.features.resources.description'),
      color: 'warning',
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)'
    }
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      content: "I love how he guides us to practice and asks the right questions to improve. Finally learned proper hand positioning after years of doing it wrong!",
      avatar: "SM",
      rating: 5
    },
    {
      name: "Mike T.",
      content: "It really changes everything when you use body weight instead of just your hands. My clients notice the difference and I'm way less tired after sessions.",
      avatar: "MT",
      rating: 5
    },
    {
      name: "Emma R.",
      content: "The way he explains trigger points made it click for me. I was struggling with this one client's shoulder issue for months and this technique solved it in one session.",
      avatar: "ER",
      rating: 5
    },
    {
      name: "David L.",
      content: "Best $200 I ever spent. I was about to quit massage therapy because my wrists were killing me. These techniques saved my career, honestly.",
      avatar: "DL",
      rating: 5
    },
    {
      name: "Jessica H.",
      content: "My income doubled after applying what I learned here. Clients are booking longer sessions and referring their friends. The deep tissue module is pure gold.",
      avatar: "JH",
      rating: 5
    },
    {
      name: "Carlos M.",
      content: "I thought I knew massage after 5 years in the field. This course showed me I was barely scratching the surface. Game changer for my practice.",
      avatar: "CM",
      rating: 5
    },
    {
      name: "Amanda K.",
      content: "Finally understanding fascia work changed how I approach every session. My regulars keep asking what I did differently - this is what I did differently!",
      avatar: "AK",
      rating: 5
    },
    {
      name: "Robert S.",
      content: "Used to take me 3-4 sessions to get results that I now achieve in one. My clients are amazed and I'm booked solid. This course literally transformed my business.",
      avatar: "RS",
      rating: 5
    },
    {
      name: "Lisa P.",
      content: "I was struggling with chronic pain clients until I learned these myofascial release techniques. Now I'm their go-to therapist and they refer everyone to me.",
      avatar: "LP",
      rating: 5
    }
  ]

  const itemsPerSlide = 3
  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide)
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const getCurrentTestimonials = () => {
    const startIndex = currentSlide * itemsPerSlide
    return testimonials.slice(startIndex, startIndex + itemsPerSlide)
  }

  const stats = [
    { number: "40+", label: t('landing.stats.videoLessons'), icon: FaPlay },
    { number: "15,000+", label: t('landing.stats.happyStudents'), icon: FaUsers },
    { number: "98%", label: t('landing.stats.successRate'), icon: FaMedal },
    { number: "24/7", label: t('landing.stats.courseAccess'), icon: FaShieldAlt }
  ]

  const pricingFeatures = [
    t('landing.features.videoLessons.title'),
    t('landing.features.certification.title'),
    t('landing.features.lifetimeAccess.title'),
    t('landing.features.resources.title')
  ]

  return (
    <Box bg="white" overflow="hidden">
      <Box
        as="nav"
        position="sticky"
        top={0}
        zIndex={1000}
        className="glass-effect"
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        <Container maxW="7xl" py={3}>
          <Flex justify="space-between" align="center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <HStack spacing={3}>
                <Box
                  position="relative"
                  className="floating-animation"
                >
                  <Image 
                    src={iconImage} 
                    alt={t('landing.brand.name')} 
                    w={12}
                    h={12}
                    borderRadius="2xl"
                    boxShadow="lg"
                  />
                  <Box
                    position="absolute"
                    top="-1"
                    right="-1"
                    w={4}
                    h={4}
                    bg="gradient-primary"
                    borderRadius="full"
                    border="2px solid white"
                  />
                </Box>
                <Box>
                  <Text fontSize="xl" fontWeight="800" color="gray.900" className="gradient-text">
                    {t('landing.brand.name')}
                  </Text>
                  <Text fontSize="xs" color="gray.500" fontWeight="500">
                    {t('landing.brand.tagline')}
                  </Text>
                </Box>
              </HStack>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <HStack spacing={4}>
                <LanguageSelector size="sm" variant="ghost" />
                <Button 
                  variant="outline" 
                  size="sm"
                  borderColor="gray.200"
                  onClick={() => navigate('/signin')}
                  _hover={{ 
                    borderColor: "primary.300",
                    bg: "primary.50",
                    transform: "translateY(-1px)"
                  }}
                  transition="all 0.2s"
                >
                  {t('common.signIn')}
                </Button>
              </HStack>
            </motion.div>
          </Flex>
        </Container>
      </Box>

      <Box 
        position="relative"
        bg="linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="15%"
          right="10%"
          w="200px"
          h="200px"
          bg="gradient-primary"
          borderRadius="full"
          opacity={0.1}
          className="floating-animation"
        />
        <Box
          position="absolute"
          bottom="10%"
          left="5%"
          w="150px"
          h="150px"
          bg="gradient-wellness"
          borderRadius="full"
          opacity={0.1}
          className="floating-animation"
          style={{ animationDelay: '1s' }}
        />
        <Container maxW="7xl" py={{ base: 8, md: 12 }}>
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 6, lg: 8 }} alignItems="center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <VStack align="start" spacing={{ base: 4, md: 6 }}>
                <Box>
                  <Badge 
                    colorScheme="primary" 
                    fontSize="xs" 
                    px={2} 
                    py={1} 
                    borderRadius="full"
                    mb={3}
                    bg="gradient-primary"
                    color="white"
                  >
                    🏆 {t('landing.badges.topCourse')}
                  </Badge>
                  <Heading
                    fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                    fontWeight="800"
                    color="gray.900"
                    lineHeight={{ base: "1.1", lg: "1" }}
                    letterSpacing="-0.03em"
                    className="text-balance"
                  >
                    <Box as="span" display="block">{t('landing.hero.title')}</Box>
                    <Box as="span" display="block" className="gradient-text">
                      {t('landing.hero.courseName')}
                    </Box>
                  </Heading>
                </Box>
                <Text 
                  fontSize={{ base: "md", md: "lg" }} 
                  color="gray.600" 
                  lineHeight="relaxed"
                  maxW="95%"
                  className="text-balance"
                >
                  {t('landing.hero.subtitle')}
                </Text>
                
                <HStack spacing={3} flexWrap="wrap">
                  <Button
                    size="md"
                    leftIcon={<FaPlay />}
                    onClick={handleStartTrial}
                    bg="gradient-primary"
                    color="white"
                    px={6}
                    py={4}
                    fontSize="md"
                    fontWeight="600"
                    borderRadius="xl"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'glow',
                      scale: 1.02
                    }}
                    _active={{
                      transform: 'translateY(-1px)',
                    }}
                    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    className="pulse-glow"
                  >
                    {t('landing.hero.enrollNow')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="md"
                    px={6}
                    py={4}
                    fontSize="md"
                    fontWeight="600"
                    borderRadius="xl"
                    borderColor="gray.300"
                    onClick={() => navigate('/learn-more')}
                    _hover={{
                      borderColor: "primary.400",
                      bg: "primary.50",
                      transform: 'translateY(-2px)',
                      boxShadow: 'md'
                    }}
                    transition="all 0.2s"
                    rightIcon={<FaArrowRight />}
                  >
                    {t('landing.hero.learnMore')}
                  </Button>
                </HStack>
                <Box pt={4}>
                  <HStack spacing={4} flexWrap="wrap">
                    <HStack spacing={2}>
                      <Icon as={FaShieldAlt} color="green.500" w={3} h={3} />
                      <Text fontSize="xs" color="gray.600" fontWeight="500">
                        {t('landing.hero.certifiedAccredited')}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Icon as={FaGlobe} color="blue.500" w={3} h={3} />
                      <Text fontSize="xs" color="gray.600" fontWeight="500">
                        {t('landing.hero.onlineCourse')}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Icon as={FaHeart} color="red.500" w={3} h={3} />
                      <Text fontSize="xs" color="gray.600" fontWeight="500">
                        {t('landing.hero.satisfaction')}
                      </Text>
                    </HStack>
                  </HStack>
                </Box>
              </VStack>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box position="relative">
                <Box
                  position="relative"
                  borderRadius="2xl"
                  overflow="hidden"
                  boxShadow="floating"
                  className="glass-effect"
                  p={2}
                >
                  <Image
                    src={massageLaptop}
                    alt={t('landing.hero.subtitle')}
                    borderRadius="xl"
                    w="full"
                    h={{ base: "250px", md: "300px" }}
                    objectFit="cover"
                    className="shimmer"
                  />
                  
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ 
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        '0 0 20px rgba(14, 165, 233, 0.3)',
                        '0 0 30px rgba(14, 165, 233, 0.6)',
                        '0 0 20px rgba(14, 165, 233, 0.3)'
                      ]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <IconButton
                      icon={<FaPlay />}
                      size="md"
                      w={12}
                      h={12}
                      borderRadius="full"
                      bg="white"
                      color="primary.500"
                      boxShadow="xl"
                      _hover={{ bg: 'primary.50', color: 'primary.600' }}
                      aria-label={t('landing.hero.playDemo')}
                    />
                  </motion.div>
                  <Box
                    position="absolute"
                    top={2}
                    right={2}
                    bg="white"
                    px={2}
                    py={1}
                    borderRadius="lg"
                    boxShadow="md"
                    className="glass-effect"
                  >
                    <HStack spacing={1}>
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} as={FaStar} color="yellow.400" w={2} h={2} />
                      ))}
                      <Text fontSize="xs" fontWeight="600" ml={1}>4.9</Text>
                    </HStack>
                  </Box>
                </Box>
                <SimpleGrid columns={2} spacing={3} mt={4}>
                  {stats.slice(0, 2).map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Box
                        bg="white"
                        p={3}
                        borderRadius="lg"
                        boxShadow="md"
                        textAlign="center"
                        className="glass-effect"
                      >
                        <Icon as={stat.icon} color="primary.500" w={6} h={6} mb={2} />
                        <Text fontSize="2xl" fontWeight="800" color="gray.900">
                          {stat.number}
                        </Text>
                        <Text fontSize="sm" color="gray.600" fontWeight="500">
                          {stat.label}
                        </Text>
                      </Box>
                    </motion.div>
                  ))}
                </SimpleGrid>
              </Box>
            </motion.div>
          </Grid>
        </Container>
      </Box>

      <Box py={20} bg="white" position="relative">
        <Container maxW="7xl">
          <VStack spacing={16}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <VStack spacing={4} textAlign="center">
                <Badge 
                  colorScheme="primary" 
                  fontSize="sm" 
                  px={3} 
                  py={1} 
                  borderRadius="full"
                  bg="primary.100"
                  color="primary.700"
                >
                  {t('landing.features.title')}
                </Badge>
                <Heading 
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} 
                  color="gray.900" 
                  fontWeight="800"
                  className="text-balance"
                >
                  {t('landing.features.worldClassTitle')}
                </Heading>
                <Text 
                  fontSize="xl" 
                  color="gray.600" 
                  maxW="2xl" 
                  className="text-balance"
                >
                  {t('landing.features.subtitle')}
                </Text>
              </VStack>
            </motion.div>
            <Grid 
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} 
              gap={8}
              w="full"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Box 
                    h="full" 
                    bg="white"
                    borderRadius="3xl"
                    boxShadow="lg"
                    border="2px solid"
                    borderColor="gray.50"
                    p={8}
                    textAlign="center"
                    position="relative"
                    overflow="hidden"
                    _hover={{ 
                      transform: 'translateY(-8px)', 
                      boxShadow: 'floating',
                      borderColor: 'primary.200'
                    }} 
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  >
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      h="4px"
                      bg={feature.gradient}
                      borderTopRadius="3xl"
                    />
                    <Box
                      w={20}
                      h={20}
                      bg={feature.gradient}
                      color="white"
                      borderRadius="2xl"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mx="auto"
                      mb={6}
                      className="pulse-glow"
                    >
                      <feature.icon size={32} />
                    </Box>
                    
                    <Heading size="lg" color="gray.900" mb={4} fontWeight="700">
                      {feature.title}
                    </Heading>
                    
                    <Text color="gray.600" lineHeight="relaxed-plus" fontSize="md">
                      {feature.description}
                    </Text>
                  </Box>
                </motion.div>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      <Box py={20} bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" position="relative">
        <Container maxW="7xl">
          <VStack spacing={16}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <VStack spacing={4} textAlign="center">
                <Badge 
                  colorScheme="secondary" 
                  fontSize="sm" 
                  px={3} 
                  py={1} 
                  borderRadius="full"
                  bg="secondary.100"
                  color="secondary.700"
                >
                  {t('landing.badges.successStories')}
                </Badge>
                <Heading 
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} 
                  color="gray.900" 
                  fontWeight="800"
                  className="text-balance"
                >
                  {t('landing.testimonials.title')}
                </Heading>
                <Text 
                  fontSize="xl" 
                  color="gray.600" 
                  maxW="2xl" 
                  className="text-balance"
                >
                  {t('landing.testimonials.subtitle')}
                </Text>
              </VStack>
            </motion.div>
            <Box position="relative" w="full">
              <Flex justify="space-between" align="center" mb={6}>
                <IconButton
                  aria-label={t('landing.testimonials.navigation.previous')}
                  onClick={prevSlide}
                  variant="ghost"
                  size="lg"
                  isRound
                  bg="white"
                  boxShadow="md"
                  _hover={{ bg: "gray.50", transform: "scale(1.05)" }}
                  transition="all 0.2s"
                >
                  <FaChevronLeft />
                </IconButton>
                
                <Text fontSize="sm" color="gray.500" fontWeight="500">
                  {t('landing.testimonials.navigation.pageInfo', { current: currentSlide + 1, total: totalSlides })}
                </Text>
                <IconButton
                  aria-label={t('landing.testimonials.navigation.next')}
                  onClick={nextSlide}
                  variant="ghost"
                  size="lg"
                  isRound
                  bg="white"
                  boxShadow="md"
                  _hover={{ bg: "gray.50", transform: "scale(1.05)" }}
                  transition="all 0.2s"
                >
                  <FaChevronRight />
                </IconButton>
              </Flex>
              <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} w="full">
                {getCurrentTestimonials().map((testimonial, index) => (
                  <motion.div
                    key={`${currentSlide}-${index}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Box
                      bg="white"
                      borderRadius="2xl"
                      p={6}
                      boxShadow="lg"
                      position="relative"
                      className="glass-effect"
                      h="full"
                      _hover={{ 
                        transform: 'translateY(-4px)',
                        boxShadow: 'xl'
                      }}
                      transition="all 0.3s"
                    >
                      <Icon 
                        as={FaQuoteLeft} 
                        color="primary.300" 
                        w={6} 
                        h={6} 
                        mb={4}
                        opacity={0.6}
                      />
                      
                      <Text 
                        color="gray.700" 
                        lineHeight="relaxed" 
                        mb={6}
                        fontStyle="italic"
                        fontSize="sm"
                      >
                        "{testimonial.content}"
                      </Text>
                      
                      <HStack spacing={3}>
                        <Box
                          w={10}
                          h={10}
                          bg="gradient-primary"
                          color="white"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontWeight="600"
                          fontSize="sm"
                        >
                          {testimonial.avatar}
                        </Box>
                        <Box flex={1}>
                          <Text fontWeight="600" color="gray.900" fontSize="sm">
                            {testimonial.name}
                          </Text>
                        </Box>
                        <HStack spacing={1}>
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Icon key={i} as={FaStar} color="yellow.400" w={3} h={3} />
                          ))}
                        </HStack>
                      </HStack>
                    </Box>
                  </motion.div>
                ))}
              </Grid>
              <Flex justify="center" mt={6} gap={2}>
                {[...Array(totalSlides)].map((_, index) => (
                  <Box
                    key={index}
                    w={3}
                    h={3}
                    borderRadius="full"
                    bg={currentSlide === index ? "primary.500" : "gray.300"}
                    cursor="pointer"
                    onClick={() => setCurrentSlide(index)}
                    transition="all 0.2s"
                    _hover={{ transform: "scale(1.2)" }}
                  />
                ))}
              </Flex>
            </Box>
          </VStack>
        </Container>
      </Box>

      <Box py={20} bg="white">
        <Container maxW="7xl">
          <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={8}>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <VStack spacing={4} textAlign="center">
                  <Box
                    w={16}
                    h={16}
                    bg="gradient-primary"
                    color="white"
                    borderRadius="2xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    className="pulse-glow"
                  >
                    <Icon as={stat.icon} w={8} h={8} />
                  </Box>
                  <Box>
                    <Text fontSize="4xl" fontWeight="800" color="gray.900" className="gradient-text">
                      {stat.number}
                    </Text>
                    <Text color="gray.600" fontWeight="500">
                      {stat.label}
                    </Text>
                  </Box>
                </VStack>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box py={20} bg="linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%)" position="relative">
        <Container maxW="4xl" textAlign="center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <VStack spacing={8} color="white">
              <VStack spacing={4}>
                <Badge 
                  bg="whiteAlpha.200" 
                  color="white"
                  fontSize="sm" 
                  px={3} 
                  py={1} 
                  borderRadius="full"
                >
                  {t('landing.badges.limitedOffer')}
                </Badge>
                <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} fontWeight="800">
                  {t('landing.pricing.title')}
                </Heading>
                <Text fontSize="xl" opacity={0.9} maxW="2xl" className="text-balance">
                  {t('landing.pricing.subtitle')}
                </Text>
              </VStack>
              
              <Box 
                maxW="lg" 
                mx="auto"
                bg="white"
                borderRadius="3xl"
                boxShadow="floating"
                p={12}
                color="gray.900"
              >
                <VStack spacing={6}>
                  <Box textAlign="center">
                    <Text fontSize="7xl" fontWeight="800" className="gradient-text" lineHeight={1}>
                      {t('landing.pricing.price')}
                    </Text>
                    <Text fontSize="xl" color="gray.600" fontWeight="500">
                      {t('landing.pricing.priceDescription')}
                    </Text>
                  </Box>
                  
                  <VStack spacing={4} align="start" w="full">
                    {pricingFeatures.map((feature, index) => (
                      <HStack key={index} spacing={3} align="center">
                        <Box 
                          color="green.500"
                          bg="green.50"
                          borderRadius="full"
                          p={1}
                        >
                          <FaCheck size={12} />
                        </Box>
                        <Text fontWeight="500">{feature}</Text>
                      </HStack>
                    ))}
                  </VStack>
                  
                  <Button 
                    size="lg" 
                    w="full"
                    bg="gradient-primary"
                    color="white"
                    py={6}
                    fontSize="lg"
                    fontWeight="600"
                    borderRadius="2xl"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'glow'
                    }}
                    transition="all 0.2s"
                    onClick={() => navigate('/purchase')}
                  >
                    {t('landing.pricing.enrollButton')}
                  </Button>
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    {t('landing.pricing.instantAccessIcon')} • {t('landing.pricing.supportIcon')}
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </motion.div>
        </Container>
      </Box>

      <Box bg="gray.900" color="white" py={16}>
        <Container maxW="7xl">
          <VStack spacing={8} textAlign="center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <HStack justify="center" spacing={3} mb={4}>
                <Image 
                  src={iconImage} 
                  alt={t('landing.brand.name')} 
                  w={12}
                  h={12}
                  borderRadius="2xl"
                />
                <Box textAlign="left">
                  <Text fontSize="xl" fontWeight="800">{t('landing.brand.name')}</Text>
                  <Text fontSize="sm" color="gray.400">{t('landing.footer.tagline')}</Text>
                </Box>
              </HStack>
            </motion.div>
            
            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Text color="gray.400" fontSize="sm">
                {t('landing.footer.copyright')}
              </Text>
              <HStack spacing={4} fontSize="sm">
                <Link to="/terms-of-service">
                  <Text color="gray.400" _hover={{ color: "white" }} transition="color 0.2s">
                    {t('landing.footer.termsOfService')}
                  </Text>
                </Link>
                <Text color="gray.600">•</Text>
                <Link to="/privacy-policy">
                  <Text color="gray.400" _hover={{ color: "white" }} transition="color 0.2s">
                    {t('landing.footer.privacyPolicy')}
                  </Text>
                </Link>
                <Text color="gray.600">•</Text>
                <Link to="/contact-support">
                  <Text color="gray.400" _hover={{ color: "white" }} transition="color 0.2s">
                    {t('landing.footer.contactSupport')}
                  </Text>
                </Link>
              </HStack>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage