import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Container, 
  Heading,
  Button,
  Icon,
  Grid
} from '@chakra-ui/react'
import { 
  FaWhatsapp, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPaperPlane 
} from 'react-icons/fa'

const ContactSupport = () => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted:', formData)
  }

  const contactMethods = [
    {
      icon: FaWhatsapp,
      title: t('support.whatsapp'),
      value: '+972503434677',
      href: 'https://wa.me/972503434677',
      color: 'green.500',
      bgColor: 'green.50'
    },
    {
      icon: FaEnvelope,
      title: t('support.email'),
      value: 'support@massagecourse.academy',
      href: 'mailto:support@massagecourse.academy',
      color: 'blue.500',
      bgColor: 'blue.50'
    },
    {
      icon: FaMapMarkerAlt,
      title: t('support.address'),
      value: t('support.addressValue'),
      href: 'https://maps.google.com/?q=Nahariya,Hazamir 88',
      color: 'purple.500',
      bgColor: 'purple.50'
    }
  ]

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="6xl">
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading size="2xl" color="gray.900">
              {t('support.contactSupport')}
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              {t('support.supportDescription')}
            </Text>
          </VStack>

          {/* Contact Methods */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} w="full">
            {contactMethods.map((method, index) => (
              <Box
                key={index}
                as="a"
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.200"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                  borderColor: method.color
                }}
                cursor="pointer"
              >
                <VStack spacing={4}>
                  <Box
                    w={16}
                    h={16}
                    bg={method.bgColor}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={method.icon} w={8} h={8} color={method.color} />
                  </Box>
                  <VStack spacing={2}>
                    <Text fontWeight="600" color="gray.900">
                      {method.title}
                    </Text>
                    <Text fontSize="sm" color="gray.600" wordBreak="break-word">
                      {method.value}
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            ))}
          </Grid>

          <Box w="full" h="1px" bg="gray.200" my={6} />

          {/* Contact Form */}
          <Box bg="white" p={8} borderRadius="xl" boxShadow="md" w="full" maxW="2xl">
            <VStack spacing={6}>
              <Heading size="lg" color="gray.900">
                {t('support.sendMessage')}
              </Heading>
              
              <Box as="form" onSubmit={handleSubmit} w="full">
                <VStack spacing={4}>
                  <Box w="full">
                    <Text fontWeight="600" fontSize="sm" mb={2} color="gray.700">
                      {t('support.fullName')}
                    </Text>
                    <Box 
                      as="input" 
                      name="name"
                      type="text" 
                      placeholder={t('support.fullNamePlaceholder')}
                      value={formData.name}
                      onChange={handleInputChange}
                      w="full"
                      p={3}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      _focus={{ borderColor: "blue.400", outline: "none" }}
                      required
                    />
                  </Box>
                  
                  <Box w="full">
                    <Text fontWeight="600" fontSize="sm" mb={2} color="gray.700">
                      {t('support.email')}
                    </Text>
                    <Box 
                      as="input" 
                      name="email"
                      type="email" 
                      placeholder={t('support.emailPlaceholder')}
                      value={formData.email}
                      onChange={handleInputChange}
                      w="full"
                      p={3}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      _focus={{ borderColor: "blue.400", outline: "none" }}
                      required
                    />
                  </Box>
                  
                  <Box w="full">
                    <Text fontWeight="600" fontSize="sm" mb={2} color="gray.700">
                      {t('support.message')}
                    </Text>
                    <Box 
                      as="textarea" 
                      name="message"
                      placeholder={t('support.messagePlaceholder')}
                      value={formData.message}
                      onChange={handleInputChange}
                      w="full"
                      p={3}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      rows={5}
                      _focus={{ borderColor: "blue.400", outline: "none" }}
                      required
                    />
                  </Box>
                  
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    w="full"
                    leftIcon={<Icon as={FaPaperPlane} />}
                  >
                    {t('support.sendMessageButton')}
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* Back to Home */}
          <Link to="/">
            <Button variant="ghost" colorScheme="blue">
              {t('support.backToHome')}
            </Button>
          </Link>
        </VStack>
      </Container>
    </Box>
  )
}

export default ContactSupport