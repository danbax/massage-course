import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
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
  Image
} from '@chakra-ui/react'
import { FaArrowLeft } from 'react-icons/fa'

const TermsOfService = () => {
  const { t } = useLanguage()

  return (
    <Box minH="100vh" bg="gray.50">
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
              {t('legal.termsOfService.backToHome')}
            </Button>
          </Flex>
        </Container>
      </Box>

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
                  {t('legal.termsOfService.title')}
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  {t('legal.termsOfService.lastUpdated')}
                </Text>
                <Box h="1px" bg="gray.200" w="full" />
              </VStack>

              <VStack spacing={6} align="start" w="full">
                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.termsOfService.sections.acceptanceOfTerms.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    {t('legal.termsOfService.sections.acceptanceOfTerms.content')}
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.termsOfService.sections.descriptionOfService.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    {t('legal.termsOfService.sections.descriptionOfService.content')}
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.termsOfService.sections.userAccounts.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    {t('legal.termsOfService.sections.userAccounts.content')}
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    {t('legal.termsOfService.sections.userAccounts.points').map((point, index) => (
                      <Text key={index} color="gray.700">• {point}</Text>
                    ))}
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.termsOfService.sections.courseContent.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    {t('legal.termsOfService.sections.courseContent.content')}
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    {t('legal.termsOfService.sections.courseContent.points').map((point, index) => (
                      <Text key={index} color="gray.700">• {point}</Text>
                    ))}
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.termsOfService.sections.paymentRefunds.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    {t('legal.termsOfService.sections.paymentRefunds.content')}
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    {t('legal.termsOfService.sections.paymentRefunds.points').map((point, index) => (
                      <Text key={index} color="gray.700">• {point}</Text>
                    ))}
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.termsOfService.sections.certification.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    {t('legal.termsOfService.sections.certification.content')}
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.termsOfService.sections.userConduct.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    {t('legal.termsOfService.sections.userConduct.content')}
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    {t('legal.termsOfService.sections.userConduct.points').map((point, index) => (
                      <Text key={index} color="gray.700">• {point}</Text>
                    ))}
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.termsOfService.sections.privacy.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    {t('legal.termsOfService.sections.privacy.content')}
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.termsOfService.sections.liability.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    {t('legal.termsOfService.sections.liability.content')}
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.termsOfService.sections.termination.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    {t('legal.termsOfService.sections.termination.content')}
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.termsOfService.sections.changes.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    {t('legal.termsOfService.sections.changes.content')}
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.termsOfService.sections.governingLaw.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    {t('legal.termsOfService.sections.governingLaw.content')}
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.termsOfService.sections.contact.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    {t('legal.termsOfService.sections.contact.content')}
                  </Text>
                  <Button
                    as={Link}
                    to="/contact-support"
                    colorScheme="blue"
                    size="md"
                    borderRadius="lg"
                  >
                    {t('legal.termsOfService.contactSupport')}
                  </Button>
                </Box>

                <Box h="1px" bg="gray.200" w="full" />

                <Box>
                  <Text fontSize="sm" color="gray.500">
                    {t('legal.termsOfService.acceptanceNotice')}
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