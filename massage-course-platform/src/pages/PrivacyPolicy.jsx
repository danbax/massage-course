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

const PrivacyPolicy = () => {
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
                  Privacy Policy
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Last updated: December 2024
                </Text>
                <Box h="1px" bg="gray.200" w="full" />
              </VStack>

              <VStack spacing={6} align="start" w="full">
                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    1. Introduction
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    Massage Academy ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our platform and services.
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    2. Information We Collect
                  </Heading>
                  
                  <Heading size="sm" color="gray.800" mb={2} mt={4}>
                    2.1 Information You Provide
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    We collect information you provide directly to us, including:
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    <Text color="gray.700">• Account registration information (name, email, password)</Text>
                    <Text color="gray.700">• Profile information (phone number, profession, experience level)</Text>
                    <Text color="gray.700">• Payment information (processed securely through Stripe)</Text>
                    <Text color="gray.700">• Course progress and assessment data</Text>
                    <Text color="gray.700">• Communications with our support team</Text>
                    <Text color="gray.700">• Feedback, reviews, and survey responses</Text>
                  </VStack>

                  <Heading size="sm" color="gray.800" mb={2} mt={4}>
                    2.2 Automatically Collected Information
                  </Heading>
                  <VStack align="start" spacing={2} pl={4}>
                    <Text color="gray.700">• Device information (IP address, browser type, operating system)</Text>
                    <Text color="gray.700">• Usage data (pages visited, time spent, features used)</Text>
                    <Text color="gray.700">• Log data (access times, error logs, performance metrics)</Text>
                    <Text color="gray.700">• Cookies and similar tracking technologies</Text>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    3. How We Use Your Information
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    We use your information for the following purposes:
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    <Text color="gray.700">• Providing and maintaining our educational services</Text>
                    <Text color="gray.700">• Processing payments and managing your account</Text>
                    <Text color="gray.700">• Tracking course progress and issuing certifications</Text>
                    <Text color="gray.700">• Sending course-related communications and updates</Text>
                    <Text color="gray.700">• Providing customer support and responding to inquiries</Text>
                    <Text color="gray.700">• Improving our platform and developing new features</Text>
                    <Text color="gray.700">• Ensuring platform security and preventing fraud</Text>
                    <Text color="gray.700">• Complying with legal obligations and regulations</Text>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    4. Legal Basis for Processing (GDPR)
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    Under the General Data Protection Regulation (GDPR), we process your data based on:
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    <Text color="gray.700">• <strong>Contract performance:</strong> To provide our educational services</Text>
                    <Text color="gray.700">• <strong>Legitimate interests:</strong> To improve our platform and prevent fraud</Text>
                    <Text color="gray.700">• <strong>Consent:</strong> For marketing communications (you can withdraw anytime)</Text>
                    <Text color="gray.700">• <strong>Legal obligation:</strong> To comply with applicable laws and regulations</Text>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    5. Information Sharing and Disclosure
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    We do not sell your personal information. We may share your information in the following circumstances:
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    <Text color="gray.700">• <strong>Service providers:</strong> Third-party vendors who assist in platform operations</Text>
                    <Text color="gray.700">• <strong>Payment processors:</strong> Stripe for secure payment processing</Text>
                    <Text color="gray.700">• <strong>Legal requirements:</strong> When required by law or to protect our rights</Text>
                    <Text color="gray.700">• <strong>Business transfers:</strong> In case of merger, acquisition, or sale of assets</Text>
                    <Text color="gray.700">• <strong>With consent:</strong> Any other sharing with your explicit permission</Text>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    6. International Data Transfers
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    Your information may be transferred to and processed in countries outside your residence. We ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission and adherence to Privacy Shield frameworks where applicable.
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    7. Data Retention
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    We retain your information for as long as necessary to provide our services and as required by law:
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    <Text color="gray.700">• Account data: Until account deletion or 3 years of inactivity</Text>
                    <Text color="gray.700">• Course progress: 7 years for certification verification</Text>
                    <Text color="gray.700">• Payment records: 7 years for tax and legal compliance</Text>
                    <Text color="gray.700">• Marketing data: Until you withdraw consent</Text>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    8. Your Rights and Choices
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    You have the following rights regarding your personal data:
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    <Text color="gray.700">• <strong>Access:</strong> Request a copy of your personal data</Text>
                    <Text color="gray.700">• <strong>Rectification:</strong> Correct inaccurate or incomplete data</Text>
                    <Text color="gray.700">• <strong>Erasure:</strong> Request deletion of your personal data</Text>
                    <Text color="gray.700">• <strong>Portability:</strong> Receive your data in a portable format</Text>
                    <Text color="gray.700">• <strong>Restriction:</strong> Limit how we process your data</Text>
                    <Text color="gray.700">• <strong>Objection:</strong> Object to certain types of processing</Text>
                    <Text color="gray.700">• <strong>Withdraw consent:</strong> For processing based on consent</Text>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    9. Cookies and Tracking Technologies
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    We use cookies and similar technologies to:
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    <Text color="gray.700">• Remember your login and preferences</Text>
                    <Text color="gray.700">• Analyze platform usage and performance</Text>
                    <Text color="gray.700">• Provide personalized content and recommendations</Text>
                    <Text color="gray.700">• Ensure platform security and prevent fraud</Text>
                  </VStack>
                  <Text color="gray.700" lineHeight="tall" mt={3}>
                    You can control cookies through your browser settings, but some platform features may not function properly if cookies are disabled.
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    10. Data Security
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    We implement appropriate technical and organizational measures to protect your data:
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    <Text color="gray.700">• Encryption of data in transit and at rest</Text>
                    <Text color="gray.700">• Regular security assessments and updates</Text>
                    <Text color="gray.700">• Access controls and authentication measures</Text>
                    <Text color="gray.700">• Employee training on data protection practices</Text>
                    <Text color="gray.700">• Incident response and breach notification procedures</Text>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    11. Children's Privacy
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will take steps to delete the information promptly.
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    12. California Privacy Rights (CCPA)
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    California residents have additional rights under the California Consumer Privacy Act:
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    <Text color="gray.700">• Right to know what personal information is collected</Text>
                    <Text color="gray.700">• Right to delete personal information</Text>
                    <Text color="gray.700">• Right to opt-out of the sale of personal information</Text>
                    <Text color="gray.700">• Right to non-discrimination for exercising CCPA rights</Text>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    13. Changes to This Privacy Policy
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    We may update this Privacy Policy periodically. We will notify you of any material changes via email or through our platform. Your continued use of our services after such modifications constitutes acceptance of the updated policy.
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    14. Contact Us
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    If you have questions about this Privacy Policy or want to exercise your rights, please contact us through our support portal.
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
                    This Privacy Policy complies with GDPR, CCPA, and other applicable data protection regulations. For specific questions about data protection in your jurisdiction, please contact our Data Protection Officer.
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

export default PrivacyPolicy
