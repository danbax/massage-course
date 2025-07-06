import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Textarea,
  IconButton
} from '@chakra-ui/react'
import { FaCamera } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user } = useAuth()
  const { t } = useLanguage()
  
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate about massage therapy and helping others achieve wellness.',
    location: 'New York, NY'
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = () => {
    toast.success('Profile updated successfully! ✅')
  }

  return (
    <Container maxW="4xl">
      <VStack spacing={8} align="stretch">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Box
            bg="white"
            borderRadius="2xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.100"
          >
            <Box p={8}>
              <HStack spacing={6}>
                <Box position="relative">
                  <Box
                    w="6rem"
                    h="6rem"
                    borderRadius="full"
                    bg="linear-gradient(135deg, #0ea5e9, #a855f7)"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="2xl"
                    fontWeight="bold"
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </Box>
                  <IconButton
                    icon={<FaCamera />}
                    position="absolute"
                    bottom={0}
                    right={0}
                    size="sm"
                    borderRadius="full"
                    bg="white"
                    boxShadow="md"
                    border="2px solid"
                    borderColor="gray.100"
                    aria-label="Change avatar"
                  />
                </Box>
                
                <VStack align="start" flex={1} spacing={2}>
                  <Heading size="xl" color="gray.900">
                    {formData.firstName} {formData.lastName}
                  </Heading>
                  <Text color="gray.600">
                    Member since March 2024
                  </Text>
                  <Text color="gray.500">
                    {formData.location}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </Box>
        </motion.div>

        <Box
          bg="white"
          borderRadius="2xl"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.100"
        >
          <Box p={8}>
            <Heading size="lg" color="gray.900" mb={6}>
              Personal Information
            </Heading>
            
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
              <VStack align="start" spacing={2}>
                <Text fontWeight="medium">First Name</Text>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  borderRadius="xl"
                />
              </VStack>
              
              <VStack align="start" spacing={2}>
                <Text fontWeight="medium">Last Name</Text>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  borderRadius="xl"
                />
              </VStack>
              
              <VStack align="start" spacing={2}>
                <Text fontWeight="medium">Email Address</Text>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  borderRadius="xl"
                />
              </VStack>
              
              <VStack align="start" spacing={2}>
                <Text fontWeight="medium">Phone Number</Text>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  borderRadius="xl"
                />
              </VStack>
              
              <VStack align="start" spacing={2} gridColumn={{ md: "span 2" }}>
                <Text fontWeight="medium">Location</Text>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  borderRadius="xl"
                />
              </VStack>
              
              <VStack align="start" spacing={2} gridColumn={{ md: "span 2" }}>
                <Text fontWeight="medium">Bio</Text>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  borderRadius="xl"
                  resize="none"
                />
              </VStack>
            </Grid>
            
            <HStack justify="end" mt={8}>
              <Button onClick={handleSave} size="lg">
                Save Changes
              </Button>
            </HStack>
          </Box>
        </Box>
      </VStack>
    </Container>
  )
}

export default Profile