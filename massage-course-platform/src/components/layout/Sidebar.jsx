import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import iconImage from '../../assets/icon.png'
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Icon,
  Button
} from '@chakra-ui/react'
import { 
  FaHome, 
  FaPlayCircle, 
  FaVideo,
  FaChartLine,
  FaCertificate,
  FaUser,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa'

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/app', icon: FaHome },
    { name: 'Courses', href: '/app/courses', icon: FaPlayCircle },
    { name: 'Video', href: '/app/video/1', icon: FaVideo },
    { name: 'Progress', href: '/app/progress', icon: FaChartLine },
    { name: 'Certificates', href: '/app/certificates', icon: FaCertificate },
    { name: 'Profile', href: '/app/profile', icon: FaUser },
    { name: 'Settings', href: '/app/settings', icon: FaCog },
  ]

  if (!isOpen && isMobile) {
    return null
  }

  return (
    <Box
      w="320px"
      h="100vh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      position="fixed"
      left={0}
      top={0}
      zIndex={1000}
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Box p={6} borderBottom="1px solid" borderColor="gray.200">
        <HStack spacing={3}>
          <Image 
            src={iconImage} 
            alt="Massage Academy Logo" 
            w={10}
            h={10}
            borderRadius="xl"
          />
          <Box>
            <Text fontSize="lg" fontWeight="bold" color="gray.900">
              Massage Academy
            </Text>
            <Text fontSize="sm" color="gray.500">
              Professional Training
            </Text>
          </Box>
        </HStack>
      </Box>

      {/* Navigation */}
      <VStack spacing={2} p={4} flex={1} align="stretch">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            style={{ textDecoration: 'none' }}
            onClick={isMobile ? onClose : undefined}
          >
            {({ isActive }) => (
              <HStack
                spacing={3}
                px={4}
                py={3}
                borderRadius="lg"
                bg={isActive ? "blue.50" : "transparent"}
                color={isActive ? "blue.600" : "gray.600"}
                _hover={{ 
                  bg: "blue.50", 
                  color: "blue.600"
                }}
                transition="all 0.2s"
                cursor="pointer"
              >
                <Icon as={item.icon} w={5} h={5} />
                <Text fontWeight={isActive ? "600" : "500"} fontSize="sm">
                  {item.name}
                </Text>
              </HStack>
            )}
          </NavLink>
        ))}
      </VStack>

      {/* User Section */}
      {user && (
        <Box p={4} borderTop="1px solid" borderColor="gray.200">
          <HStack spacing={3} mb={3}>
            <Box
              w={10}
              h={10}
              bg="blue.500"
              color="white"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
            >
              {user.avatar || user.name?.charAt(0) || 'U'}
            </Box>
            <Box flex={1}>
              <Text fontSize="sm" fontWeight="600" color="gray.900">
                {user.name || 'User'}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {user.email || 'user@example.com'}
              </Text>
            </Box>
          </HStack>
          
          <Button
            leftIcon={<Icon as={FaSignOutAlt} />}
            size="sm"
            w="full"
            bg="red.50"
            color="red.700"
            _hover={{ bg: "red.100" }}
            borderRadius="lg"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default Sidebar
