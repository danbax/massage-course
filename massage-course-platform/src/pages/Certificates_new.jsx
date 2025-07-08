import { motion } from 'framer-motion'
import { useCertificates, useGenerateCertificate } from '../hooks/useApi'
import { useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Badge,
  Spinner,
  Alert,
  Flex,
  Image
} from '@chakra-ui/react'
import { 
  FaTrophy,
  FaDownload,
  FaEye,
  FaCertificate,
  FaCalendar,
  FaShare,
  FaPlus
} from 'react-icons/fa'

const Certificates = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(null)
  
  // Fetch certificates data
  const { data: certificates, isLoading, error, refetch } = useCertificates()
  const generateMutation = useGenerateCertificate()

  if (isLoading) {
    return (
      <Container maxW="7xl" py={8}>
        <Flex justify="center" align="center" minH="400px">
          <Spinner size="xl" />
        </Flex>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxW="7xl" py={8}>
        <Alert status="error">
          <Alert.Icon />
          Failed to load certificates. Please try again.
        </Alert>
      </Container>
    )
  }

  const handleGenerateCertificate = async () => {
    try {
      await generateMutation.mutateAsync()
      refetch() // Refresh certificates list
    } catch (error) {
      console.error('Failed to generate certificate:', error)
    }
  }

  const handleDownload = (certificateId) => {
    // Trigger download
    window.open(`/api/certificates/${certificateId}/download`, '_blank')
  }

  const handleShare = (certificate) => {
    const shareUrl = `${window.location.origin}/certificates/verify/${certificate.verification_code}`
    navigator.clipboard.writeText(shareUrl)
    // Toast notification would be handled by the mutation
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Flex justify="space-between" align="center">
            <VStack align="start" spacing={2}>
              <Heading size="xl" color="gray.900">
                Your Certificates
              </Heading>
              <Text color="gray.600">
                Download and share your professional massage therapy certificates
              </Text>
            </VStack>
            
            <Button
              leftIcon={<FaPlus />}
              colorScheme="blue"
              onClick={handleGenerateCertificate}
              isLoading={generateMutation.isPending}
              loadingText="Generating..."
            >
              Generate Certificate
            </Button>
          </Flex>
        </motion.div>

        {certificates?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card.Root>
              <CardBody p={8} textAlign="center">
                <VStack spacing={4}>
                  <Box
                    w={16}
                    h={16}
                    bg="gray.100"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaCertificate} w={8} h={8} color="gray.400" />
                  </Box>
                  <VStack spacing={2}>
                    <Heading size="md" color="gray.900">
                      No Certificates Yet
                    </Heading>
                    <Text color="gray.600" maxW="md">
                      Complete the course to earn your professional massage therapy certificate. 
                      Your achievements will appear here once you finish all modules.
                    </Text>
                  </VStack>
                  <Button
                    leftIcon={<FaPlus />}
                    colorScheme="blue"
                    onClick={handleGenerateCertificate}
                    isLoading={generateMutation.isPending}
                    loadingText="Generating..."
                  >
                    Generate Certificate
                  </Button>
                </VStack>
              </CardBody>
            </Card.Root>
          </motion.div>
        ) : (
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
            {certificates.map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card.Root 
                  cursor="pointer"
                  _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                  onClick={() => setSelectedCertificate(certificate)}
                >
                  <CardBody p={0}>
                    {/* Certificate Preview */}
                    <Box 
                      h="200px" 
                      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      position="relative"
                      borderRadius="md"
                      mb={4}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <VStack spacing={2} color="white" textAlign="center">
                        <Icon as={FaTrophy} w={8} h={8} />
                        <Text fontWeight="bold" fontSize="lg">
                          Professional Certificate
                        </Text>
                        <Text fontSize="sm" opacity={0.9}>
                          Massage Therapy
                        </Text>
                      </VStack>
                      
                      <Badge
                        position="absolute"
                        top={3}
                        right={3}
                        colorScheme="green"
                        size="sm"
                      >
                        Verified
                      </Badge>
                    </Box>
                    
                    <Box p={4}>
                      <VStack align="stretch" spacing={3}>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold" color="gray.900">
                            {certificate.course_title || 'Professional Massage Course'}
                          </Text>
                          <HStack spacing={2} fontSize="sm" color="gray.500">
                            <Icon as={FaCalendar} w={3} h={3} />
                            <Text>
                              Issued {new Date(certificate.issued_at).toLocaleDateString()}
                            </Text>
                          </HStack>
                        </VStack>
                        
                        <VStack spacing={2}>
                          <Button
                            size="sm"
                            variant="ghost"
                            w="full"
                            leftIcon={<FaDownload />}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownload(certificate.id)
                            }}
                          >
                            Download PDF
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            w="full"
                            leftIcon={<FaShare />}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleShare(certificate)
                            }}
                          >
                            Share Certificate
                          </Button>
                        </VStack>
                        
                        <Text fontSize="xs" color="gray.400" textAlign="center">
                          Verification Code: {certificate.verification_code}
                        </Text>
                      </VStack>
                    </Box>
                  </CardBody>
                </Card.Root>
              </motion.div>
            ))}
          </Grid>
        )}

        {/* Certificate Detail Modal would go here */}
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setSelectedCertificate(null)}
          >
            <Box
              bg="white"
              borderRadius="xl"
              p={6}
              maxW="2xl"
              w="90%"
              maxH="90%"
              overflow="auto"
              onClick={(e) => e.stopPropagation()}
            >
              <VStack spacing={4}>
                <Heading size="lg">Certificate Details</Heading>
                <Text>Certificate ID: {selectedCertificate.id}</Text>
                <Text>Verification Code: {selectedCertificate.verification_code}</Text>
                <Text>Issued: {new Date(selectedCertificate.issued_at).toLocaleDateString()}</Text>
                
                <HStack spacing={4}>
                  <Button
                    leftIcon={<FaDownload />}
                    colorScheme="blue"
                    onClick={() => handleDownload(selectedCertificate.id)}
                  >
                    Download
                  </Button>
                  <Button
                    leftIcon={<FaShare />}
                    variant="outline"
                    onClick={() => handleShare(selectedCertificate)}
                  >
                    Share
                  </Button>
                  <Button variant="ghost" onClick={() => setSelectedCertificate(null)}>
                    Close
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </motion.div>
        )}
      </VStack>
    </Container>
  )
}

export default Certificates
