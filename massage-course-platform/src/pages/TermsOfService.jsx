import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
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
  Image
} from '@chakra-ui/react'
import { FaArrowLeft } from 'react-icons/fa'

const TermsOfService = () => {
  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
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
              as={Link}
              to="/"
              size="sm"
            >
              Back to Home
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="4xl" py={12}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box bg="white" borderRadius="2xl" boxShadow="lg" p={8}>
            <VStack spacing={8} align="start">
              <VStack spacing={4} align="start" w="full">
                <Heading size="xl" color="gray.900">
                  Terms of Service
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Last updated: December 2024
                </Text>
                <Box h="1px" bg="gray.200" w="full" />
              </VStack>

              <VStack spacing={6} align="start" w="full">
                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    1. Acceptance of Terms
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    By accessing and using the Massage Academy platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    2. Description of Service
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    Massage Academy provides online massage therapy training courses, educational content, certification programs, and related services. The Service is accessible through our website and may include various interactive features, downloadable content, and assessment tools.
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    3. User Accounts and Registration
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    To access certain features of the Service, you must create an account. You agree to:
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    <Text color="gray.700">• Provide accurate, current, and complete information</Text>
                    <Text color="gray.700">• Maintain and update your account information</Text>
                    <Text color="gray.700">• Keep your login credentials secure and confidential</Text>
                    <Text color="gray.700">• Be responsible for all activities under your account</Text>
                    <Text color="gray.700">• Notify us immediately of any unauthorized use</Text>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    4. Course Content and Intellectual Property
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    All course content, including but not limited to videos, text, images, audio, software, and other materials, is protected by copyright and other intellectual property laws. You agree that:
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    <Text color="gray.700">• Content is for your personal, non-commercial use only</Text>
                    <Text color="gray.700">• You may not reproduce, distribute, or share course content</Text>
                    <Text color="gray.700">• Downloading content for offline viewing is permitted for personal use</Text>
                    <Text color="gray.700">• Reverse engineering or attempting to extract content is prohibited</Text>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    5. Payment and Refunds
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    Payment terms for our courses:
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    <Text color="gray.700">• All payments are processed securely through Stripe</Text>
                    <Text color="gray.700">• Prices are subject to change with notice</Text>
                    <Text color="gray.700">• 30-day money-back guarantee for all courses</Text>
                    <Text color="gray.700">• Refunds are processed within 5-7 business days</Text>
                    <Text color="gray.700">• Partial course completion may affect refund eligibility</Text>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    6. Certification and Professional Use
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    Our certifications are recognized within the massage therapy industry. However, professional licensure requirements vary by jurisdiction. You are responsible for verifying local licensing requirements and ensuring compliance with applicable regulations before practicing professionally.
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    7. User Conduct
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    You agree not to:
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    <Text color="gray.700">• Use the Service for any unlawful purpose</Text>
                    <Text color="gray.700">• Share account credentials with others</Text>
                    <Text color="gray.700">• Attempt to bypass security measures</Text>
                    <Text color="gray.700">• Interfere with the Service's operation</Text>
                    <Text color="gray.700">• Upload malicious content or code</Text>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    8. Privacy and Data Protection
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    Your privacy is important to us. Our Privacy Policy, which is incorporated into these Terms, explains how we collect, use, and protect your information. By using our Service, you consent to the collection and use of information as outlined in our Privacy Policy.
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    9. Limitation of Liability
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    To the fullest extent permitted by law, Massage Academy shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    10. Termination
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service ceases immediately.
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    11. Changes to Terms
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    We reserve the right to modify these Terms at any time. We will provide notice of significant changes via email or through the Service. Your continued use after such modifications constitutes acceptance of the updated Terms.
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    12. Governing Law
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where Massage Academy is incorporated, without regard to conflict of law principles.
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    13. Contact Information
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    If you have any questions about these Terms of Service, please contact us through our support portal.
                  </Text>
                  <Button
                    as={Link}
                    to="/contact-support"
                    colorScheme="blue"
                    size="md"
                    borderRadius="lg"
                  >
                    Contact Support
                  </Button>
                </Box>

                <Box h="1px" bg="gray.200" w="full" />

                <Box>
                  <Text fontSize="sm" color="gray.500">
                    By using Massage Academy, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                  </Text>
                </Box>
              </VStack>
            </VStack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}

export default TermsOfService
