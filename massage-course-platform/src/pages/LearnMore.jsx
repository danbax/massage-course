import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
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

  const courseModules = [
    {
      title: "Let's Get This Party Started",
      lessons: 3,
      topics: ["Welcome to your massage journey", "What makes you awesome at this", "How this course works (no boring stuff!)", "Setting realistic expectations"]
    },
    {
      title: "The Stuff That Really, REALLY Matters",
      lessons: 10,
      topics: ["Choosing your massage table", "Oil vs cream debate", "Setting up your space", "Time management secrets", "Areas to avoid", "Body mechanics to save your career"]
    },
    {
      title: "Body Basics (The Non-Boring Version)",
      lessons: 7,
      topics: ["Anatomy that actually matters", "Muscles that cause trouble", "Bone landmarks for navigation", "Understanding nerves vs muscles", "Blood flow basics", "Fascia secrets"]
    },
    {
      title: "Techniques That Actually Work",
      lessons: 7,
      topics: ["Soft hands technique", "Effleurage mastery", "Petrissage (kneading)", "Compression power moves", "Friction detail work", "Putting it all together"]
    },
    {
      title: "The Full Body Massage Sequence",
      lessons: 8,
      topics: ["Starting with feet", "Leg work mastery", "Back massage magic", "Neck and head finale", "The smooth flip", "Front body techniques", "Perfect endings"]
    },
    {
      title: "Business & Career Options",
      lessons: 4,
      topics: ["Mobile vs studio vs employee", "Legal requirements", "Getting and keeping clients", "Taking care of yourself", "Pricing strategies"]
    },
    {
      title: "Essential Oils & Advanced Techniques",
      lessons: 4,
      topics: ["Essential oil safety", "Blending basics", "Professional oil use", "Chair massage", "Special populations", "Problem-solving"]
    },
    {
      title: "Real-World Problem Solving",
      lessons: 3,
      topics: ["Common client complaints", "Difficult situations", "Building your reputation", "Continuing education", "Advanced specializations"]
    }
  ]

  const benefits = [
    {
      icon: FaVideo,
      title: "40+ Professional Video Lessons",
      description: "Step-by-step demonstrations with expert instruction and detailed techniques"
    },
    {
      icon: FaCertificate,
      title: "Professional Certification",
      description: "Internationally recognized certificate upon successful completion"
    },
    {
      icon: FaClock,
      title: "Lifetime Access",
      description: "Learn at your own pace with unlimited access to all content forever"
    },
    {
      icon: FaDownload,
      title: "Complete Resource Library",
      description: "Downloadable guides, equipment recommendations, and practice materials"
    },
    {
      icon: FaUsers,
      title: "Career Path Guidance",
      description: "Mobile, home studio, or employee options - find what works for you"
    },
    {
      icon: FaHeart,
      title: "Body Mechanics Training",
      description: "Protect your hands and back for a long, sustainable career"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Licensed Massage Therapist",
      content: "This course completely transformed my massage technique. The step-by-step approach made everything so clear and easy to follow.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Wellness Center Owner",
      content: "I switched from IT to massage therapy using this course. The zero-to-hero approach really works - now I'm running my own practice!",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Mobile Therapist",
      content: "Perfect for beginners! The equipment advice alone saved me hundreds of dollars. I went from knowing nothing to booking clients daily.",
      rating: 5
    }
  ]

  return (
    <Box bg="white">
      {/* Header */}
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
                Back to Home
              </Button>
              <Button
                bg="gradient-primary"
                color="white"
                onClick={() => navigate('/purchase')}
                size="sm"
                _hover={{ transform: 'translateY(-1px)' }}
              >
                Purchase Course
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box py={16} bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)">
        <Container maxW="7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <VStack spacing={8} textAlign="center">
              <Badge colorScheme="primary" fontSize="sm" px={3} py={1} borderRadius="full">
                Complete Course Details
              </Badge>
              <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} fontWeight="800" color="gray.900" lineHeight={{ base: "1.2", md: "1.1" }}>
                From Zero to Hero
                <Text as="span" display="block" className="gradient-text">
                  Classic Massage Mastery
                </Text>
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="3xl">
                Learn everything you need to perform amazing classic massage. Complete course from beginner to professional level. 
                No boring theory - just practical techniques that actually work!
              </Text>
              
              <HStack spacing={8} pt={4}>
                <VStack>
                  <Text fontSize="3xl" fontWeight="800" color="primary.500">40+</Text>
                  <Text fontSize="sm" color="gray.600">Video Lessons</Text>
                </VStack>
                <VStack>
                  <Text fontSize="3xl" fontWeight="800" color="primary.500">46</Text>
                  <Text fontSize="sm" color="gray.600">Total Lessons</Text>
                </VStack>
                <VStack>
                  <Text fontSize="3xl" fontWeight="800" color="primary.500">8</Text>
                  <Text fontSize="sm" color="gray.600">Modules</Text>
                </VStack>
              </HStack>
            </VStack>
          </motion.div>
        </Container>
      </Box>

      {/* Course Modules */}
      <Box py={20} bg="white">
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} color="gray.900">
                Course Curriculum
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Our step-by-step approach ensures you master each technique before moving to the next level. 
                From complete beginner to confident professional.
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
                                {module.lessons} lessons
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

      {/* What You'll Get */}
      <Box py={20} bg="gray.50">
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} color="gray.900">
                What You'll Get
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Everything you need to become a certified massage therapist with confidence
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

      {/* Student Success Stories */}
      <Box py={20} bg="white">
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} color="gray.900">
                Student Success Stories
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Join thousands of successful massage therapists worldwide who started with our course
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

      {/* CTA Section */}
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
                  Ready to Start Your Journey?
                </Heading>
                <Text fontSize="lg" color="whiteAlpha.900" maxW="2xl">
                  Join thousands of professionals who have transformed their careers with our certification program
                </Text>
              </VStack>
              
              <VStack spacing={4}>
                <Text fontSize="6xl" fontWeight="800" color="white">$20</Text>
                <Text fontSize="lg" color="whiteAlpha.900">One-time payment • Lifetime access</Text>
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
                Purchase Course Now
              </Button>
            
            </VStack>
          </motion.div>
        </Container>
      </Box>
    </Box>
  )
}

export default LearnMore