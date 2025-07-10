import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import iconImage from '../assets/icon.png'
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
  Icon,
  SimpleGrid,
  Badge
} from '@chakra-ui/react'
import { 
  FaPlay, 
  FaGraduationCap, 
  FaClock, 
  FaUsers, 
  FaCheck,
  FaStar,
  FaArrowLeft,
  FaArrowRight,
  FaBookOpen,
  FaVideo,
  FaCertificate,
  FaDownload,
  FaMobile,
  FaHeart
} from 'react-icons/fa'

const LearnMore = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const courseModules = t('learnMore.courseModules')

  const benefits = [
    {
      icon: FaVideo,
      title: t('learnMore.benefits.0.title'),
      description: t('learnMore.benefits.0.description')
    },
    {
      icon: FaCertificate,
      title: t('learnMore.benefits.1.title'),
      description: t('learnMore.benefits.1.description')
    },
    {
      icon: FaClock,
      title: t('learnMore.benefits.2.title'),
      description: t('learnMore.benefits.2.description')
    },
    {
      icon: FaDownload,
      title: t('learnMore.benefits.3.title'),
      description: t('learnMore.benefits.3.description')
    },
    {
      icon: FaUsers,
      title: t('learnMore.benefits.4.title'),
      description: t('learnMore.benefits.4.description')
    },
    {
      icon: FaHeart,
      title: t('learnMore.benefits.5.title'),
      description: t('learnMore.benefits.5.description')
    }
  ]

  const testimonials = [
    {
      name: t('learnMore.testimonials.0.name'),
      role: t('learnMore.testimonials.0.role'),
      content: t('learnMore.testimonials.0.content'),
      rating: 5
    },
    {
      name: t('learnMore.testimonials.1.name'),
      role: t('learnMore.testimonials.1.role'),
      content: t('learnMore.testimonials.1.content'),
      rating: 5
    },
    {
      name: t('learnMore.testimonials.2.name'),
      role: t('learnMore.testimonials.2.role'),
      content: t('learnMore.testimonials.2.content'),
      rating: 5
    }
  ]

  return (
    <Box bg="white">
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
            
            <HStack spacing={4}>
              <Button
                leftIcon={<FaArrowLeft />}
                variant="ghost"
                onClick={() => navigate('/')}
                size="sm"
              >
                {t('learnMore.backToHome')}
              </Button>
              <Button
                bg="gradient-primary"
                color="white"
                onClick={() => navigate('/purchase')}
                size="sm"
                _hover={{ transform: 'translateY(-1px)' }}
              >
                {t('learnMore.purchaseCourse')}
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Box py={16} bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)">
        <Container maxW="7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <VStack spacing={8} textAlign="center">
              <Badge colorScheme="primary" fontSize="sm" px={3} py={1} borderRadius="full">
                {t('learnMore.courseDetails')}
              </Badge>
              <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} fontWeight="800" color="gray.900" lineHeight={{ base: "1.2", md: "1.1" }}>
                {t('learnMore.title')}
                <Text as="span" display="block" className="gradient-text">
                  {t('learnMore.subtitle')}
                </Text>
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="3xl">
                {t('learnMore.description')}
              </Text>
              
              <HStack spacing={8} pt={4}>
                <VStack>
                  <Text fontSize="3xl" fontWeight="800" color="primary.500">40+</Text>
                  <Text fontSize="sm" color="gray.600">{t('learnMore.totalLessons')}</Text>
                </VStack>
                <VStack>
                  <Text fontSize="3xl" fontWeight="800" color="primary.500">46</Text>
                  <Text fontSize="sm" color="gray.600">{t('courses.totalLessons')}</Text>
                </VStack>
                <VStack>
                  <Text fontSize="3xl" fontWeight="800" color="primary.500">8</Text>
                  <Text fontSize="sm" color="gray.600">{t('learnMore.modules')}</Text>
                </VStack>
              </HStack>
            </VStack>
          </motion.div>
        </Container>
      </Box>

      <Box py={20} bg="white">
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} color="gray.900">
                {t('learnMore.courseCurriculum')}
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                {t('learnMore.curriculumDescription')}
              </Text>
            </VStack>

            <VStack spacing={6} w="full">
              {courseModules.map((module, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  style={{ width: '100%' }}
                >
                  <Box 
                    w="full" 
                    boxShadow="md" 
                    bg="white" 
                    borderRadius="xl" 
                    border="1px solid" 
                    borderColor="gray.200"
                    _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }} 
                    transition="all 0.2s"
                  >
                    <Box p={6}>
                      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6} alignItems="center">
                        <VStack align="start" spacing={4}>
                          <HStack spacing={4}>
                            <Box
                              w={12}
                              h={12}
                              bg="gradient-primary"
                              color="white"
                              borderRadius="xl"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontSize="lg"
                              fontWeight="700"
                            >
                              {index + 1}
                            </Box>
                            <VStack align="start" spacing={1}>
                              <Heading size="md" color="gray.900">
                                {module.title}
                              </Heading>
                              <Text fontSize="sm" color="gray.500">
                                {module.lessons} {t('course.lessons')}
                              </Text>
                            </VStack>
                          </HStack>
                          
                          <VStack spacing={2} align="start">
                            {module.topics.map((topic, topicIndex) => (
                              <HStack key={topicIndex} spacing={2} fontSize="sm" color="gray.600">
                                <Icon as={FaCheck} color="green.500" w={3} h={3} />
                                <Text>{topic}</Text>
                              </HStack>
                            ))}
                          </VStack>
                        </VStack>
                        
                        <VStack align="end">
                          <Icon as={FaPlay} color="primary.500" w={8} h={8} />
                        </VStack>
                      </Grid>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </VStack>
          </VStack>
        </Container>
      </Box>

      <Box py={20} bg="gray.50">
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} color="gray.900">
                {t('learnMore.whatYouGet')}
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                {t('learnMore.whatYouGetDescription')}
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Box 
                    h="full" 
                    textAlign="center" 
                    p={6} 
                    bg="white" 
                    borderRadius="xl" 
                    boxShadow="md" 
                    border="1px solid" 
                    borderColor="gray.200"
                  >
                    <VStack spacing={4}>
                        <Box
                          w={16}
                          h={16}
                          bg="gradient-primary"
                          color="white"
                          borderRadius="2xl"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={benefit.icon} w={8} h={8} />
                        </Box>
                        <Heading size="md" color="gray.900">
                          {benefit.title}
                        </Heading>
                        <Text color="gray.600" fontSize="sm" lineHeight="relaxed">
                          {benefit.description}
                        </Text>
                    </VStack>
                  </Box>
                </motion.div>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      <Box py={20} bg="white">
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} color="gray.900">
                {t('learnMore.studentSuccessStories')}
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                {t('learnMore.studentsDescription')}
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Box 
                    h="full" 
                    p={6} 
                    bg="white" 
                    borderRadius="xl" 
                    boxShadow="md" 
                    border="1px solid" 
                    borderColor="gray.200"
                  >
                    <VStack spacing={4} align="start">
                        <HStack spacing={1}>
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Icon key={i} as={FaStar} color="yellow.400" w={4} h={4} />
                          ))}
                        </HStack>
                        <Text color="gray.700" fontStyle="italic">
                          "{testimonial.content}"
                        </Text>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="600" color="gray.900">
                            {testimonial.name}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {testimonial.role}
                          </Text>
                        </VStack>
                    </VStack>
                  </Box>
                </motion.div>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      <Box py={20} bg="linear-gradient(135deg, #0ea5e9 0%, #1e40af 100%)" color="white">
        <Container maxW="4xl" textAlign="center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <VStack spacing={8}>
              <VStack spacing={4}>
                <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} color="white" fontWeight="800">
                  {t('learnMore.readyToStart')}
                </Heading>
                <Text fontSize="lg" color="whiteAlpha.900" maxW="2xl">
                  {t('learnMore.joinDescription')}
                </Text>
              </VStack>
              
              <VStack spacing={4}>
                <Text fontSize="6xl" fontWeight="800" color="white">$20</Text>
                <Text fontSize="lg" color="whiteAlpha.900">{t('learnMore.oneTimePayment')}</Text>
              </VStack>

              <Button
                size="lg"
                bg="white"
                color="blue.600"
                px={8}
                py={6}
                fontSize="lg"
                fontWeight="600"
                borderRadius="xl"
                rightIcon={<FaArrowRight />}
                onClick={() => navigate('/purchase')}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'xl',
                  bg: 'gray.50'
                }}
              >
                {t('learnMore.purchaseCourseNow')}
              </Button>
            
            </VStack>
          </motion.div>
        </Container>
      </Box>
    </Box>
  )
}

export default LearnMore