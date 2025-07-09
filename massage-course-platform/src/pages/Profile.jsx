import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import { profileApi } from '../api/auth'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Input,
  Textarea
} from '@chakra-ui/react'
import { FaCamera } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const { t } = useLanguage()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
    bio: '',
    country: '',
    city: ''
  })
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        profession: user.profession || '',
        bio: user.bio || '',
        country: user.country || '',
        city: user.city || ''
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await profileApi.updateProfile(formData)
      updateUser(response.profile)
      toast.success('Profile updated successfully! ✅')
    } catch (error) {
      toast.error(`Failed to update profile: ${error.response?.data?.message || error.message || 'An error occurred'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const formatMemberSince = (date) => {
    if (!date) return 'Recently joined'
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  const getDisplayLocation = () => {
    if (formData.city && formData.country) {
      return `${formData.city}, ${formData.country}`
    } else if (formData.country) {
      return formData.country
    } else if (formData.city) {
      return formData.city
    }
    return 'Location not specified'
  }

  return (
    <Container maxW="4xl">
      <Box>
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
              <Box display="flex" gap={6} alignItems="start">
                <Box position="relative">
                  {user?.avatar_url ? (
                    <Box
                      w="6rem"
                      h="6rem"
                      borderRadius="full"
                      bgImage={`url(${user.avatar_url})`}
                      bgSize="cover"
                      bgPosition="center"
                    />
                  ) : (
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
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Box>
                  )}
                  <Button
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
                    minW="auto"
                    w={8}
                    h={8}
                    p={0}
                  >
                    <FaCamera />
                  </Button>
                </Box>
                
                <Box flex={1}>
                  <Heading size="xl" color="gray.900" mb={2}>
                    {formData.name || 'User'}
                  </Heading>
                  <Text color="gray.600" mb={1}>
                    Member since {formatMemberSince(user?.created_at)}
                  </Text>
                  <Text color="gray.500">
                    {getDisplayLocation()}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>

        <Box
          bg="white"
          borderRadius="2xl"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.100"
          mt={8}
        >
          <Box p={8}>
            <Heading size="lg" color="gray.900" mb={6}>
              Personal Information
            </Heading>
            
            <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
              <Box>
                <Text fontWeight="medium" mb={2}>Full Name</Text>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  borderRadius="xl"
                  placeholder="Enter your full name"
                />
              </Box>
              
              <Box>
                <Text fontWeight="medium" mb={2}>Email Address</Text>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  borderRadius="xl"
                  placeholder="Enter your email"
                />
              </Box>
              
              <Box>
                <Text fontWeight="medium" mb={2}>Phone Number</Text>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  borderRadius="xl"
                  placeholder="Enter your phone number"
                />
              </Box>
              
              <Box>
                <Text fontWeight="medium" mb={2}>Profession</Text>
                <Input
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  borderRadius="xl"
                  placeholder="Enter your profession"
                />
              </Box>

              <Box>
                <Text fontWeight="medium" mb={2}>Country</Text>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  borderRadius="xl"
                  placeholder="Enter your country"
                />
              </Box>
              
              <Box>
                <Text fontWeight="medium" mb={2}>City</Text>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  borderRadius="xl"
                  placeholder="Enter your city"
                />
              </Box>
              
              <Box gridColumn={{ md: "span 2" }}>
                <Text fontWeight="medium" mb={2}>Bio</Text>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  borderRadius="xl"
                  resize="none"
                  placeholder="Tell us about yourself..."
                />
              </Box>
            </Box>
            
            <Box display="flex" justifyContent="flex-end" mt={8}>
              <Button 
                onClick={handleSave} 
                size="lg"
                isLoading={isSaving}
                loadingText="Saving..."
                colorScheme="blue"
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default Profile