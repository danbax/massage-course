import { useState, useEffect } from 'react'
import api from '../lib/api'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useCourse } from '../hooks/useCourse'
import { useLanguage } from '../hooks/useLanguage'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  Center,
  Badge,
  Spinner,
  Image
} from '@chakra-ui/react'
import { 
  FaAward,
  FaDownload,
  FaCheck,
  FaCertificate,
  FaStar,
  FaGraduationCap
} from 'react-icons/fa'

const Certificate = () => {
  const { user, token } = useAuth()
  const { getCompletedLessons } = useCourse()
  const { t } = useLanguage()
  const [isEligible, setIsEligible] = useState(false)
  const [hasCertificate, setHasCertificate] = useState(false)
  const [certificate, setCertificate] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const completedLessons = getCompletedLessons()

  useEffect(() => {
    if (token) {
      checkEligibility()
    } else {
      setIsLoading(false)
    }
  }, [user, token])

  useEffect(() => {
    console.log('Certificate component state:', {
      isLoading,
      isEligible,
      hasCertificate,
      completedLessons,
      token: !!token,
      user: !!user
    })
  }, [isLoading, isEligible, hasCertificate, completedLessons, token, user])

  const checkEligibility = async () => {
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      
      const data = await api.get('/certificates/eligibility')
      console.log('Eligibility response:', data)
      setIsEligible(data.eligible)
      setHasCertificate(data.has_certificate)

      if (data.has_certificate) {
        await fetchCertificate()
      }
    } catch (error) {
      console.error('Error checking eligibility:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCertificate = async () => {
    try {
      const data = await api.get('/certificates')
      if (data.certificates && data.certificates.length > 0) {
        setCertificate(data.certificates[0])
      }
    } catch (error) {
      console.error('Error fetching certificate:', error)
    }
  }

  const generateCertificate = async () => {
    if (!token) return

    try {
      setIsGenerating(true)
      
      const data = await api.post('/certificates/generate')
      setCertificate(data.certificate)
      setHasCertificate(true)
      if (data.message === 'Certificate already exists') {
        toast.info('Certificate already exists! Downloading now...')
      } else {
        toast.success('Certificate generated successfully! Downloading now...')
      }
      setTimeout(() => {
        downloadCertificatePDF()
      }, 2000)
    } catch (error) {
      console.error('Error generating certificate:', error)
      toast.error('Failed to generate certificate')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadCertificatePDF = async () => {
    console.log('downloadCertificatePDF called', { hasCertificate, user: !!user })
    
    if (!hasCertificate || !user) {
      console.log('Download blocked:', { hasCertificate, hasUser: !!user })
      return
    }

    try {
      setIsDownloading(true)
      
      const certificatePreview = document.querySelector('[data-certificate-preview]')
      console.log('Certificate preview found:', !!certificatePreview)
      
      if (!certificatePreview) {
        toast.error('Certificate preview not found')
        return
      }

      const originalTransform = certificatePreview.style.transform
      const originalWidth = certificatePreview.style.width
      const originalHeight = certificatePreview.style.height
      
      certificatePreview.style.transform = 'scale(1)'
      certificatePreview.style.width = '1056px'
      certificatePreview.style.height = '816px'
      
      await new Promise(resolve => setTimeout(resolve, 100))

      console.log('Generating canvas from certificate preview...')
      const canvas = await html2canvas(certificatePreview, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 1056,
        height: 816
      })

      certificatePreview.style.transform = originalTransform
      certificatePreview.style.width = originalWidth
      certificatePreview.style.height = originalHeight

      console.log('Canvas generated, creating PDF...')
      const pdf = new jsPDF('landscape', 'mm', 'a4')
      const imgWidth = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight)
      
      const fileName = `Certificate_${user.name.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`
      console.log('Downloading PDF:', fileName)
      pdf.save(fileName)
      
      toast.success('Certificate downloaded successfully!')
    } catch (error) {
      console.error('Error downloading certificate:', error)
      toast.error('Failed to download certificate')
    } finally {
      setIsDownloading(false)
    }
  }

  const CertificateTemplate = () => {
    const today = new Date()
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return (
      <Box
        width="1056px"
        height="816px"
        bg="white"
        position="relative"
        margin="0 auto"
        boxShadow="0 4px 20px rgba(0,0,0,0.1)"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgGradient="linear(45deg, #f7fafc 0%, #edf2f7 100%)"
        />
        
        <Box
          position="absolute"
          top="20px"
          left="20px"
          right="20px"
          bottom="20px"
          border="3px solid"
          borderColor="blue.500"
          borderRadius="lg"
        />
        
        <Box
          position="absolute"
          top="30px"
          left="30px"
          right="30px"
          bottom="30px"
          border="1px solid"
          borderColor="blue.300"
          borderRadius="md"
        />

        <VStack spacing={6} pt="60px" position="relative" zIndex={1}>
          <Box
            w="80px"
            h="80px"
            bg="blue.500"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 8px 20px rgba(59, 130, 246, 0.3)"
          >
            <Icon as={FaGraduationCap} w="40px" h="40px" color="white" />
          </Box>
          
          <VStack spacing={2}>
            <Text
              fontSize="36px"
              fontWeight="800"
              color="gray.800"
              letterSpacing="wider"
              textTransform="uppercase"
            >
              Certificate of Completion
            </Text>
            <Text fontSize="18px" color="blue.600" fontWeight="600">
              MASSAGE ACADEMY
            </Text>
          </VStack>
        </VStack>

        <VStack spacing={8} mt="40px" px="80px" position="relative" zIndex={1}>
          <Text fontSize="20px" color="gray.700" textAlign="center" lineHeight="1.6">
            This is to certify that
          </Text>
          
          <Box
            bg="blue.50"
            px="40px"
            py="20px"
            borderRadius="lg"
            border="2px solid"
            borderColor="blue.200"
            position="relative"
          >
            <Text
              fontSize="48px"
              fontWeight="700"
              color="blue.700"
              textAlign="center"
              letterSpacing="wide"
            >
              {user?.name || 'Student Name'}
            </Text>
            <Box
              position="absolute"
              bottom="-10px"
              left="50%"
              transform="translateX(-50%)"
              w="200px"
              h="2px"
              bg="blue.400"
            />
          </Box>
          
          <VStack spacing={6}>
            <Text fontSize="22px" color="gray.700" textAlign="center" lineHeight="1.6">
              has successfully completed the
            </Text>
            
            <Text
              fontSize="32px"
              fontWeight="700"
              color="gray.800"
              textAlign="center"
              letterSpacing="wide"
            >
              Professional Relaxation Massage Course
            </Text>
            
            <Text fontSize="18px" color="gray.600" textAlign="center">
              Academy Classic Massage Training Program
            </Text>
          </VStack>
        </VStack>

        <Flex
          position="absolute"
          bottom="60px"
          left="80px"
          right="80px"
          justify="space-between"
          align="end"
        >
          <VStack spacing={2}>
            <Text fontSize="16px" color="gray.600">
              Date of Completion
            </Text>
            <Text fontSize="18px" fontWeight="600" color="gray.800">
              {formattedDate}
            </Text>
            <Box w="150px" h="1px" bg="gray.400" />
          </VStack>
          
          <VStack spacing={2}>
            <Box
              w="120px"
              h="60px"
              bg="blue.100"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="2px solid"
              borderColor="blue.300"
            >
              <Icon as={FaAward} w="30px" h="30px" color="blue.600" />
            </Box>
            <Text fontSize="12px" color="gray.500" textAlign="center">
              Official Seal
            </Text>
          </VStack>
          
          <VStack spacing={2}>
            <Text fontSize="16px" color="gray.600">
              Massage Academy Director
            </Text>
            <Text fontSize="18px" fontWeight="600" color="gray.800">
              Daniel Bachnov
            </Text>
            <Box w="150px" h="1px" bg="gray.400" />
          </VStack>
        </Flex>

        <Text
          position="absolute"
          bottom="20px"
          right="30px"
          fontSize="10px"
          color="gray.400"
          fontFamily="mono"
        >
          Certificate #{certificate?.certificate_number || 'MA' + Date.now()}
        </Text>
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Container maxW="4xl" py={8}>
        <Center>
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text>Loading certificate information...</Text>
          </VStack>
        </Center>
      </Container>
    )
  }

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="6xl">
        <VStack spacing={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Center textAlign="center">
              <VStack spacing={4}>
                <HStack spacing={3}>
                  <Icon as={FaCertificate} w={8} h={8} color="blue.500" />
                  <Heading size="2xl" color="gray.900">
                    {t('certificates.title')}
                  </Heading>
                </HStack>
                <Text fontSize="xl" color="gray.600" maxW="2xl">
                  {t('certificates.subtitle')}
                </Text>
              </VStack>
            </Center>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Box
              bg="white"
              borderRadius="xl"
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.200"
              p={6}
              textAlign="center"
            >
              <VStack spacing={4}>
                {isEligible ? (
                  <>
                    <HStack spacing={2}>
                      <Icon as={FaCheck} color="green.500" />
                      <Badge colorScheme="green" fontSize="sm">
                        Eligible for Certificate
                      </Badge>
                    </HStack>
                    <Text color="gray.600">
                      Congratulations! You are eligible for your certificate.
                    </Text>
                  </>
                ) : (
                  <>
                    <Box 
                      status="info" 
                      borderRadius="lg"
                      bg="blue.50"
                      border="1px solid"
                      borderColor="blue.200"
                      p={4}
                    >
                      <HStack spacing={3}>
                        <Icon as={FaCheck} color="blue.500" />
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="600" color="blue.800">Complete all required lessons to earn your certificate</Text>
                          <Text fontSize="sm" color="blue.700">
                            Start watching lessons to unlock your official certificate of completion.
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  </>
                )}
              </VStack>
            </Box>
          </motion.div>

          {(completedLessons >= 1 || hasCertificate) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <VStack spacing={6}>
                {!hasCertificate ? (
                  <Button
                    size="lg"
                    colorScheme="blue"
                    leftIcon={<FaAward />}
                    onClick={generateCertificate}
                    isLoading={isGenerating}
                    loadingText="Generating & downloading..."
                    px={8}
                    py={6}
                    fontSize="lg"
                    borderRadius="xl"
                    boxShadow="lg"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'xl'
                    }}
                  >
                    Generate & Download Certificate
                  </Button>
                ) : (
                  <HStack spacing={4}>
                    <Button
                      size="lg"
                      colorScheme="green"
                      leftIcon={<FaDownload />}
                      onClick={downloadCertificatePDF}
                      isLoading={isDownloading}
                      loadingText={t('common.loading')}
                      px={8}
                      py={6}
                      fontSize="lg"
                      borderRadius="xl"
                      boxShadow="lg"
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'xl'
                      }}
                    >
                      {t('certificates.downloadCertificate')}
                    </Button>
                  </HStack>
                )}
              </VStack>
            </motion.div>
          )}

          {hasCertificate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <VStack spacing={6}>
                <Heading size="lg" color="gray.900">
                  Certificate Preview
                </Heading>
                
                <Box
                  data-certificate-preview
                  transform="scale(0.7)"
                  transformOrigin="center"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="2xl"
                >
                  <CertificateTemplate />
                </Box>
              </VStack>
            </motion.div>
          )}
        </VStack>
      </Container>
    </Box>
  )
}

export default Certificate