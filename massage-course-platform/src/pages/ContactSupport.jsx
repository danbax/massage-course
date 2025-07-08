import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
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
  VStack,
  HStack,
  Image,
  Input,
  Textarea,
  Select,
  Grid,
  Icon
} from '@chakra-ui/react'
import { 
  FaArrowLeft, 
  FaQuestionCircle,
  FaHeadset,
  FaBug,
  FaLightbulb,
  FaEnvelope
} from 'react-icons/fa'

const ContactSupport = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message')
      }

      toast.success('Your message has been sent successfully! We\'ll get back to you within 24 hours.')
      reset()
    } catch (error) {
      console.error('Contact form error:', error)
      toast.error('Failed to send message. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const supportTypes = [
    { value: 'general', label: 'General Question', icon: FaQuestionCircle },
    { value: 'technical', label: 'Technical Support', icon: FaHeadset },
    { value: 'billing', label: 'Billing & Payment', icon: FaEnvelope },
    { value: 'course', label: 'Course Content', icon: FaLightbulb },
    { value: 'bug', label: 'Bug Report', icon: FaBug },
    { value: 'feature', label: 'Feature Request', icon: FaLightbulb }
  ]

  return (
    <Box minH="100vh" bg="gray.50">
      <Box py={4} borderBottom="1px solid" borderColor="gray.200" bg="white">
        <Container maxW="7xl">
          <Flex justify="space-between" align="center">
            <Link to="/">
              <HStack gap={3}>
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
              as={Link}
              to="/"
              size="sm"
            >
              <FaArrowLeft />
              Back to Home
            </Button>
          </Flex>
        </Container>
      </Box>

      <Container maxW="6xl" py={12}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VStack gap={12}>
            <VStack gap={4} textAlign="center">
              <Heading size="xl" color="gray.900">
                Contact Support
              </Heading>
              <Text color="gray.600" fontSize="lg" maxW="2xl">
                We're here to help! Get in touch with our support team for any questions, 
                technical issues, or feedback about your learning experience.
              </Text>
            </VStack>

            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={12} w="full">
              <Box bg="white" borderRadius="2xl" boxShadow="lg" p={8}>
                <VStack gap={6} align="start">
                  <VStack gap={2} align="start" w="full">
                    <Heading size="md" color="gray.900">
                      Send us a Message
                    </Heading>
                    <Text color="gray.600">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </Text>
                  </VStack>

                  <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                    <VStack gap={4} w="full">
                      <VStack gap={2} w="full" align="start">
                        <Text color="gray.700" fontWeight="600" fontSize="sm">Full Name</Text>
                        <Input
                          {...register('name', { required: 'Name is required' })}
                          placeholder="Enter your full name"
                          borderRadius="lg"
                          bg="gray.50"
                          border="1px solid"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300" }}
                          _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #60A5FA" }}
                        />
                        {errors.name && (
                          <Text color="red.500" fontSize="sm">{errors.name.message}</Text>
                        )}
                      </VStack>

                      <VStack gap={2} w="full" align="start">
                        <Text color="gray.700" fontWeight="600" fontSize="sm">Email Address</Text>
                        <Input
                          type="email"
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          placeholder="Enter your email address"
                          borderRadius="lg"
                          bg="gray.50"
                          border="1px solid"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300" }}
                          _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #60A5FA" }}
                        />
                        {errors.email && (
                          <Text color="red.500" fontSize="sm">{errors.email.message}</Text>
                        )}
                      </VStack>

                      <VStack gap={2} w="full" align="start">
                        <Text color="gray.700" fontWeight="600" fontSize="sm">Subject</Text>
                        <Input
                          {...register('subject', { required: 'Subject is required' })}
                          placeholder="Brief description of your inquiry"
                          borderRadius="lg"
                          bg="gray.50"
                          border="1px solid"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300" }}
                          _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #60A5FA" }}
                        />
                        {errors.subject && (
                          <Text color="red.500" fontSize="sm">{errors.subject.message}</Text>
                        )}
                      </VStack>

                      <VStack gap={2} w="full" align="start">
                        <Text color="gray.700" fontWeight="600" fontSize="sm">Support Type</Text>
                        <Select
                          {...register('type', { required: 'Please select a support type' })}
                          placeholder="Select the type of support you need"
                          borderRadius="lg"
                          bg="gray.50"
                          border="1px solid"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300" }}
                          _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #60A5FA" }}
                        >
                          {supportTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </Select>
                        {errors.type && (
                          <Text color="red.500" fontSize="sm">{errors.type.message}</Text>
                        )}
                      </VStack>

                      <VStack gap={2} w="full" align="start">
                        <Text color="gray.700" fontWeight="600" fontSize="sm">Message</Text>
                        <Textarea
                          {...register('message', { 
                            required: 'Message is required',
                            minLength: { value: 10, message: 'Message must be at least 10 characters' }
                          })}
                          placeholder="Describe your question or issue in detail..."
                          rows={6}
                          borderRadius="lg"
                          bg="gray.50"
                          border="1px solid"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300" }}
                          _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #60A5FA" }}
                          resize="vertical"
                        />
                        {errors.message && (
                          <Text color="red.500" fontSize="sm">{errors.message.message}</Text>
                        )}
                      </VStack>

                      <Button
                        type="submit"
                        bg="blue.500"
                        color="white"
                        size="lg"
                        w="full"
                        borderRadius="lg"
                        isLoading={isSubmitting}
                        loadingText="Sending..."
                        _hover={{ bg: "blue.600", transform: "translateY(-1px)" }}
                        _active={{ transform: "translateY(0)" }}
                        transition="all 0.2s"
                      >
                        Send Message
                      </Button>
                    </VStack>
                  </form>
                </VStack>
              </Box>

              <VStack gap={8} align="start">
                <Box bg="white" borderRadius="2xl" boxShadow="lg" p={8} w="full">
                  <VStack gap={6} align="start">
                    <Heading size="md" color="gray.900">
                      How We Can Help
                    </Heading>

                    <VStack gap={4} w="full">
                      {supportTypes.map((type) => (
                        <HStack key={type.value} gap={4} w="full" p={4} bg="gray.50" borderRadius="lg">
                          <Box
                            w={10}
                            h={10}
                            bg="blue.500"
                            color="white"
                            borderRadius="lg"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <type.icon size={16} />
                          </Box>
                          <VStack align="start" gap={1} flex={1}>
                            <Text fontWeight="600" color="gray.900" fontSize="sm">{type.label}</Text>
                          </VStack>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>
                </Box>

                <Box bg="blue.50" borderRadius="2xl" p={6} w="full">
                  <VStack gap={4} align="start">
                    <Heading size="sm" color="gray.900">
                      Response Times
                    </Heading>
                    <VStack gap={2} align="start" fontSize="sm" color="gray.700">
                      <Text>• <strong>General Questions:</strong> Within 24 hours</Text>
                      <Text>• <strong>Technical Issues:</strong> Within 12 hours</Text>
                      <Text>• <strong>Billing Inquiries:</strong> Within 6 hours</Text>
                      <Text>• <strong>Course Content:</strong> Within 24 hours</Text>
                    </VStack>
                  </VStack>
                </Box>

                <Box bg="linear-gradient(to right, #3B82F6, #8B5CF6)" borderRadius="2xl" p={6} w="full" color="white">
                  <VStack gap={3} textAlign="center">
                    <FaQuestionCircle size="32" />
                    <Heading size="sm">Need Quick Answers?</Heading>
                    <Text fontSize="sm" opacity={0.9}>
                      Check out our FAQ section for instant solutions.
                    </Text>
                    <Button
                      variant="outline"
                      size="sm"
                      borderColor="whiteAlpha.300"
                      _hover={{ bg: "whiteAlpha.200" }}
                    >
                      View FAQ
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            </Grid>
          </VStack>
        </motion.div>
      </Container>
    </Box>
  )
}

export default ContactSupport