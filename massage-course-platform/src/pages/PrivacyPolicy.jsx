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

const PrivacyPolicy = () => {
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
              {t('legal.privacyPolicy.backToHome')}
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
                  {t('legal.privacyPolicy.title')}
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  {t('legal.privacyPolicy.lastUpdated')}
                </Text>
                <Box h="1px" bg="gray.200" w="full" />
              </VStack>

              <VStack spacing={6} align="start" w="full">
                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.privacyPolicy.sections.introduction.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    {t('legal.privacyPolicy.introduction')}
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.privacyPolicy.sections.informationCollection.title')}
                  </Heading>
                  
                  <Heading size="sm" color="gray.800" mb={2} mt={4}>
                    {t('legal.privacyPolicy.sections.informationCollection.providedInfo.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    {t('legal.privacyPolicy.sections.informationCollection.providedInfo.content')}
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    {t('legal.privacyPolicy.sections.informationCollection.providedInfo.points').map((point, index) => (
                      <Text key={index} color="gray.700">• {point}</Text>
                    ))}
                  </VStack>

                  <Heading size="sm" color="gray.800" mb={2} mt={4}>
                    {t('legal.privacyPolicy.sections.informationCollection.automaticInfo.title')}
                  </Heading>
                  <VStack align="start" spacing={2} pl={4}>
                    {t('legal.privacyPolicy.sections.informationCollection.automaticInfo.points').map((point, index) => (
                      <Text key={index} color="gray.700">• {point}</Text>
                    ))}
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.privacyPolicy.sections.howWeUse.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    {t('legal.privacyPolicy.sections.howWeUse.content')}
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    {t('legal.privacyPolicy.sections.howWeUse.points').map((point, index) => (
                      <Text key={index} color="gray.700">• {point}</Text>
                    ))}
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.privacyPolicy.sections.legalBasis.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    {t('legal.privacyPolicy.sections.legalBasis.content')}
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    {t('legal.privacyPolicy.sections.legalBasis.points').map((point, index) => (
                      <Text key={index} color="gray.700">• {point}</Text>
                    ))}
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.privacyPolicy.sections.sharing.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    {t('legal.privacyPolicy.sections.sharing.content')}
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    {t('legal.privacyPolicy.sections.sharing.points').map((point, index) => (
                      <Text key={index} color="gray.700">• {point}</Text>
                    ))}
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.privacyPolicy.sections.dataTransfers.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    {t('legal.privacyPolicy.sections.dataTransfers.content')}
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.privacyPolicy.sections.dataRetention.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    {t('legal.privacyPolicy.sections.dataRetention.content')}
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    {t('legal.privacyPolicy.sections.dataRetention.points').map((point, index) => (
                      <Text key={index} color="gray.700">• {point}</Text>
                    ))}
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.privacyPolicy.sections.yourRights.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    {t('legal.privacyPolicy.sections.yourRights.content')}
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    {t('legal.privacyPolicy.sections.yourRights.points').map((point, index) => (
                      <Text key={index} color="gray.700">• {point}</Text>
                    ))}
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.privacyPolicy.sections.cookies.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    {t('legal.privacyPolicy.sections.cookies.content')}
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    {t('legal.privacyPolicy.sections.cookies.points').map((point, index) => (
                      <Text key={index} color="gray.700">• {point}</Text>
                    ))}
                  </VStack>
                  <Text color="gray.700" lineHeight="tall" mt={3}>
                    {t('legal.privacyPolicy.sections.cookies.notice')}
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.privacyPolicy.sections.dataSecurity.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    {t('legal.privacyPolicy.sections.dataSecurity.content')}
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    {t('legal.privacyPolicy.sections.dataSecurity.points').map((point, index) => (
                      <Text key={index} color="gray.700">• {point}</Text>
                    ))}
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.privacyPolicy.sections.childrensPrivacy.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    {t('legal.privacyPolicy.sections.childrensPrivacy.content')}
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.privacyPolicy.sections.californiaRights.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    {t('legal.privacyPolicy.sections.californiaRights.content')}
                  </Text>
                  <VStack align="start" spacing={2} pl={4}>
                    {t('legal.privacyPolicy.sections.californiaRights.points').map((point, index) => (
                      <Text key={index} color="gray.700">• {point}</Text>
                    ))}
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.privacyPolicy.sections.policyChanges.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    {t('legal.privacyPolicy.sections.policyChanges.content')}
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" color="gray.900" mb={3}>
                    {t('legal.privacyPolicy.sections.contact.title')}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    {t('legal.privacyPolicy.sections.contact.content')}
                  </Text>
                  <Button
                    as={Link}
                    to="/contact-support"
                    colorScheme="blue"
                    size="md"
                    borderRadius="lg"
                  >
                    {t('legal.privacyPolicy.contactSupport')}
                  </Button>
                </Box>

                <Box h="1px" bg="gray.200" w="full" />

                <Box>
                  <Text fontSize="sm" color="gray.500">
                    {t('legal.privacyPolicy.complianceNote')}
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