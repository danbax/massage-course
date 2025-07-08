import { motion } from 'framer-motion'
import { useState } from 'react'
import { useProfile, useUpdateProfile, useUpdatePassword } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'
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
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Avatar,
  IconButton,
  Spinner,
  Alert,
  Flex,
  Divider,
  Badge
} from '@chakra-ui/react'
import { FaCamera, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  // Fetch profile data
  const { data: profile, isLoading, error } = useProfile()
  const updateProfileMutation = useUpdateProfile()
  const updatePasswordMutation = useUpdatePassword()

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile
  } = useForm({
    defaultValues: profile
  })

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch
  } = useForm()

  const password = watch('password')

  if (isLoading) {
    return (
      <Container maxW="4xl" py={8}>
        <Flex justify="center" align="center" minH="400px">
          <Spinner size="xl" />
        </Flex>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="error">
          <Alert.Icon />
          Failed to load profile. Please try again.
        </Alert>
      </Container>
    )
  }

  const onProfileSubmit = async (data) => {
    try {
      await updateProfileMutation.mutateAsync(data)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  const onPasswordSubmit = async (data) => {
    try {
      await updatePasswordMutation.mutateAsync(data)
      setIsChangingPassword(false)
      resetPassword()
      toast.success('Password updated successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password')
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      resetProfile(profile)
    }
    setIsEditing(!isEditing)
  }

  const handlePasswordToggle = () => {
    if (isChangingPassword) {
      resetPassword()
    }
    setIsChangingPassword(!isChangingPassword)
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Heading size="xl" color="gray.900">
            Profile Settings
          </Heading>
          <Text color="gray.600" mt={2}>
            Manage your account information and preferences
          </Text>
        </motion.div>

        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card.Root>
              <CardBody p={6}>
                <VStack align="stretch" spacing={6}>
                  <HStack justify="space-between">
                    <Heading size="md" color="gray.900">
                      Personal Information
                    </Heading>
                    <Button
                      size="sm"
                      leftIcon={isEditing ? <FaTimes /> : <FaEdit />}
                      variant={isEditing ? "ghost" : "outline"}
                      onClick={handleEditToggle}
                    >
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </HStack>

                  {/* Avatar Section */}
                  <VStack spacing={4}>
                    <Box position="relative">
                      <Avatar 
                        size="xl" 
                        src={profile?.avatar_url} 
                        name={profile?.name}
                      />
                      {isEditing && (
                        <IconButton
                          position="absolute"
                          bottom={0}
                          right={0}
                          size="sm"
                          borderRadius="full"
                          colorScheme="blue"
                          icon={<FaCamera />}
                          onClick={() => toast.info('Avatar upload will be implemented')}
                        />
                      )}
                    </Box>
                    <VStack spacing={1}>
                      <Text fontWeight="bold" fontSize="lg" color="gray.900">
                        {profile?.name}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {profile?.email}
                      </Text>
                      <Badge colorScheme="green" size="sm">
                        Member since {new Date(profile?.created_at).toLocaleDateString()}
                      </Badge>
                    </VStack>
                  </VStack>

                  <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                    <VStack spacing={4}>
                      <FormControl>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                          {...registerProfile('name', { required: 'Name is required' })}
                          defaultValue={profile?.name}
                          isReadOnly={!isEditing}
                          variant={isEditing ? "outline" : "filled"}
                        />
                        {profileErrors.name && (
                          <Text color="red.500" fontSize="sm">
                            {profileErrors.name.message}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                          {...registerProfile('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          defaultValue={profile?.email}
                          isReadOnly={!isEditing}
                          variant={isEditing ? "outline" : "filled"}
                        />
                        {profileErrors.email && (
                          <Text color="red.500" fontSize="sm">
                            {profileErrors.email.message}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl>
                        <FormLabel>Phone</FormLabel>
                        <Input
                          {...registerProfile('phone')}
                          defaultValue={profile?.phone}
                          isReadOnly={!isEditing}
                          variant={isEditing ? "outline" : "filled"}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Profession</FormLabel>
                        <Input
                          {...registerProfile('profession')}
                          defaultValue={profile?.profession}
                          isReadOnly={!isEditing}
                          variant={isEditing ? "outline" : "filled"}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Bio</FormLabel>
                        <Textarea
                          {...registerProfile('bio')}
                          defaultValue={profile?.bio}
                          isReadOnly={!isEditing}
                          variant={isEditing ? "outline" : "filled"}
                          rows={4}
                        />
                      </FormControl>

                      {isEditing && (
                        <Button
                          type="submit"
                          colorScheme="blue"
                          leftIcon={<FaSave />}
                          w="full"
                          isLoading={updateProfileMutation.isPending}
                          loadingText="Saving..."
                        >
                          Save Changes
                        </Button>
                      )}
                    </VStack>
                  </form>
                </VStack>
              </CardBody>
            </Card.Root>
          </motion.div>

          {/* Account Security */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <VStack spacing={6}>
              {/* Password Section */}
              <Card.Root w="full">
                <CardBody p={6}>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Heading size="md" color="gray.900">
                        Password & Security
                      </Heading>
                      <Button
                        size="sm"
                        leftIcon={isChangingPassword ? <FaTimes /> : <FaEdit />}
                        variant={isChangingPassword ? "ghost" : "outline"}
                        onClick={handlePasswordToggle}
                      >
                        {isChangingPassword ? 'Cancel' : 'Change Password'}
                      </Button>
                    </HStack>

                    {!isChangingPassword ? (
                      <VStack spacing={2} align="start">
                        <Text fontSize="sm" color="gray.600">
                          Password last updated: {new Date(profile?.password_updated_at || profile?.updated_at).toLocaleDateString()}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Keep your account secure with a strong password
                        </Text>
                      </VStack>
                    ) : (
                      <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                        <VStack spacing={4}>
                          <FormControl>
                            <FormLabel>Current Password</FormLabel>
                            <Input
                              type="password"
                              {...registerPassword('current_password', { 
                                required: 'Current password is required' 
                              })}
                            />
                            {passwordErrors.current_password && (
                              <Text color="red.500" fontSize="sm">
                                {passwordErrors.current_password.message}
                              </Text>
                            )}
                          </FormControl>

                          <FormControl>
                            <FormLabel>New Password</FormLabel>
                            <Input
                              type="password"
                              {...registerPassword('password', { 
                                required: 'New password is required',
                                minLength: {
                                  value: 8,
                                  message: 'Password must be at least 8 characters'
                                }
                              })}
                            />
                            {passwordErrors.password && (
                              <Text color="red.500" fontSize="sm">
                                {passwordErrors.password.message}
                              </Text>
                            )}
                          </FormControl>

                          <FormControl>
                            <FormLabel>Confirm New Password</FormLabel>
                            <Input
                              type="password"
                              {...registerPassword('password_confirmation', { 
                                required: 'Please confirm your password',
                                validate: value => value === password || 'Passwords do not match'
                              })}
                            />
                            {passwordErrors.password_confirmation && (
                              <Text color="red.500" fontSize="sm">
                                {passwordErrors.password_confirmation.message}
                              </Text>
                            )}
                          </FormControl>

                          <Button
                            type="submit"
                            colorScheme="blue"
                            leftIcon={<FaSave />}
                            w="full"
                            isLoading={updatePasswordMutation.isPending}
                            loadingText="Updating..."
                          >
                            Update Password
                          </Button>
                        </VStack>
                      </form>
                    )}
                  </VStack>
                </CardBody>
              </Card.Root>

              {/* Account Statistics */}
              <Card.Root w="full">
                <CardBody p={6}>
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md" color="gray.900">
                      Account Statistics
                    </Heading>
                    
                    <VStack spacing={3}>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">Courses Enrolled</Text>
                        <Text fontSize="sm" fontWeight="medium">1</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">Lessons Completed</Text>
                        <Text fontSize="sm" fontWeight="medium">{profile?.completed_lessons || 0}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">Certificates Earned</Text>
                        <Text fontSize="sm" fontWeight="medium">{profile?.certificates_count || 0}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">Study Time</Text>
                        <Text fontSize="sm" fontWeight="medium">
                          {Math.round((profile?.total_study_time || 0) / 60)}h
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card.Root>
            </VStack>
          </motion.div>
        </Grid>
      </VStack>
    </Container>
  )
}

export default Profile
