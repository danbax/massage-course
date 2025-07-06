import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Button
} from '@chakra-ui/react'
import { 
  FaBell,
  FaVideo,
  FaGlobe,
  FaShieldAlt
} from 'react-icons/fa'

const Settings = () => {
  const { currentLanguage, changeLanguage } = useLanguage()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    lessonReminders: true,
    autoplayNext: true,
    showSubtitles: false,
    hdQuality: true
  })

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const settingsSections = [
    {
      title: 'Notifications',
      icon: FaBell,
      color: 'blue',
      items: [
        {
          key: 'emailNotifications',
          title: 'Email Notifications',
          description: 'Receive course updates and announcements via email'
        },
        {
          key: 'pushNotifications',
          title: 'Push Notifications',
          description: 'Get notifications directly in your browser'
        },
        {
          key: 'lessonReminders',
          title: 'Lesson Reminders',
          description: 'Remind me to continue learning'
        }
      ]
    },
    {
      title: 'Video Preferences',
      icon: FaVideo,
      color: 'purple',
      items: [
        {
          key: 'autoplayNext',
          title: 'Autoplay Next Video',
          description: 'Automatically start the next lesson when current one ends'
        },
        {
          key: 'showSubtitles',
          title: 'Show Subtitles',
          description: 'Display subtitles for all video content'
        },
        {
          key: 'hdQuality',
          title: 'HD Quality',
          description: 'Play videos in high definition quality'
        }
      ]
    }
  ]

  return (
    <Container maxW="4xl">
      <VStack spacing={8} align="stretch">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <VStack spacing={2} align="start">
            <Heading size="xl" color="gray.900">
              Settings
            </Heading>
            <Text color="gray.600">
              Manage your account preferences and course settings
            </Text>
          </VStack>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Box
            bg="white"
            borderRadius="2xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.100"
          >
            <Box p={6}>
              <HStack spacing={3} mb={6}>
                <Box
                  w={10}
                  h={10}
                  bg="blue.100"
                  color="blue.600"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaGlobe} w={5} h={5} />
                </Box>
                <Heading size="md" color="gray.900">
                  Language & Region
                </Heading>
              </HStack>
              
              <VStack align="start" spacing={3}>
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  Interface Language
                </Text>
                <Box
                  position="relative"
                  maxW="xs"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.300"
                  bg="white"
                  cursor="pointer"
                  _hover={{ borderColor: "blue.300" }}
                  transition="all 0.2s"
                >
                  <Box
                    px={3}
                    py={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text fontSize="sm">
                      {currentLanguage === 'en' ? 'English' : 'Русский'}
                    </Text>
                    <Icon 
                      as={FaGlobe} 
                      w={4} 
                      h={4} 
                      color="gray.400"
                    />
                  </Box>
                  
                  <Box
                    as="select"
                    position="absolute"
                    top={0}
                    left={0}
                    w="full"
                    h="full"
                    opacity={0}
                    cursor="pointer"
                    value={currentLanguage}
                    onChange={(e) => changeLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="ru">Русский</option>
                  </Box>
                </Box>
              </VStack>
            </Box>
          </Box>
        </motion.div>

        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (sectionIndex + 2) * 0.1 }}
          >
            <Box
              bg="white"
              borderRadius="2xl"
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.100"
            >
              <Box p={6}>
                <HStack spacing={3} mb={6}>
                  <Box
                    w={10}
                    h={10}
                    bg={`${section.color}.100`}
                    color={`${section.color}.600`}
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={section.icon} w={5} h={5} />
                  </Box>
                  <Heading size="md" color="gray.900">
                    {section.title}
                  </Heading>
                </HStack>
                
                <VStack spacing={6} align="stretch">
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex + 2) * 0.1 + itemIndex * 0.05 }}
                    >
                      <HStack justify="space-between" py={3}>
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontWeight="medium" color="gray.900">
                            {item.title}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {item.description}
                          </Text>
                        </VStack>
                        
                        <Box
                          w="12"
                          h="6"
                          borderRadius="full"
                          bg={settings[item.key] ? "blue.500" : "gray.300"}
                          cursor="pointer"
                          position="relative"
                          transition="all 0.2s"
                          onClick={() => toggleSetting(item.key)}
                        >
                          <Box
                            w="5"
                            h="5"
                            borderRadius="full"
                            bg="white"
                            position="absolute"
                            top="0.5"
                            left={settings[item.key] ? "6" : "0.5"}
                            transition="all 0.2s"
                            boxShadow="sm"
                          />
                        </Box>
                      </HStack>
                    </motion.div>
                  ))}
                </VStack>
              </Box>
            </Box>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Box
            bg="white"
            borderRadius="2xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.100"
          >
            <Box p={6}>
              <HStack spacing={3} mb={6}>
                <Box
                  w={10}
                  h={10}
                  bg="green.100"
                  color="green.600"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaShieldAlt} w={5} h={5} />
                </Box>
                <Heading size="md" color="gray.900">
                  Security & Privacy
                </Heading>
              </HStack>
              
              <VStack spacing={4} align="stretch">
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  p={4}
                  h="auto"
                  borderRadius="xl"
                  _hover={{ bg: "gray.50" }}
                >
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium" color="gray.900">
                      Change Password
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Update your account password
                    </Text>
                  </VStack>
                </Button>
                
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  p={4}
                  h="auto"
                  borderRadius="xl"
                  _hover={{ bg: "gray.50" }}
                >
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium" color="gray.900">
                      Two-Factor Authentication
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Add an extra layer of security to your account
                    </Text>
                  </VStack>
                </Button>
                
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  p={4}
                  h="auto"
                  borderRadius="xl"
                  _hover={{ bg: "red.50" }}
                  color="red.700"
                >
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">
                      Delete Account
                    </Text>
                    <Text fontSize="sm" color="red.600">
                      Permanently delete your account and all data
                    </Text>
                  </VStack>
                </Button>
              </VStack>
            </Box>
          </Box>
        </motion.div>
      </VStack>
    </Container>
  )
}

export default Settings