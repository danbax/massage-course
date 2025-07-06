import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import {
  Box,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  Button,
  Badge,
  Image
} from '@chakra-ui/react'
import { FaBars, FaBell, FaSearch } from 'react-icons/fa'
import iconImage from '../../assets/icon.png'

const TopBar = ({ onMenuClick, sidebarOpen }) => {
  const { logout } = useAuth()
  const { t } = useLanguage()

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        bg="white"
        boxShadow="var(--shadow-md)"
        borderBottom="1px solid"
        borderColor="gray.200"
        px={6}
        py={4}
        className="glass-effect"
      >
        <Flex justify="space-between" align="center">
          <HStack spacing={4}>
            <IconButton
              icon={<FaBars />}
              onClick={onMenuClick}
              variant="ghost"
              colorScheme="gray"
              aria-label="Toggle menu"
              borderRadius="xl"
              _hover={{ 
                bg: "primary.50", 
                color: "primary.600",
                transform: "scale(1.05)"
              }}
              transition="all 0.2s"
            />
            
            <HStack spacing={3} display={{ base: "none", md: "flex" }}>
              <Box position="relative">
                <Image 
                  src={iconImage} 
                  alt="Online Massage Course Logo" 
                  boxSize="40px"
                  borderRadius="xl"
                  boxShadow="md"
                />
                <Box
                  position="absolute"
                  top="-1"
                  right="-1"
                  w={3}
                  h={3}
                  bg="gradient-primary"
                  borderRadius="full"
                  border="2px solid white"
                />
              </Box>
              <Box>
                <Heading
                  size="md"
                  color="gray.900"
                  fontWeight="800"
                  className="gradient-text"
                >
                  Massage Academy
                </Heading>
                <Box fontSize="xs" color="gray.500" fontWeight="500">
                  Professional Training Platform
                </Box>
              </Box>
            </HStack>
          </HStack>

          <HStack spacing={4}>
            <Box position="relative" maxW="300px" display={{ base: "none", md: "flex" }}>
              <Input 
                placeholder="Search lessons, topics..." 
                pl={12}
                pr={4}
                py={2}
                borderRadius="2xl"
                border="2px solid"
                borderColor="gray.200"
                bg="gray.50"
                _hover={{ 
                  borderColor: "primary.300",
                  bg: "white"
                }}
                _focus={{ 
                  borderColor: "primary.400",
                  bg: "white",
                  boxShadow: "var(--shadow-glow)"
                }}
                transition="all 0.2s"
              />
              <Box
                position="absolute"
                left={4}
                top="50%"
                transform="translateY(-50%)"
                pointerEvents="none"
                color="gray.400"
              >
                <FaSearch />
              </Box>
            </Box>

            <Box position="relative">
              <IconButton
                icon={<FaBell />}
                variant="ghost"
                colorScheme="gray"
                aria-label="Notifications"
                borderRadius="xl"
                _hover={{ 
                  bg: "primary.50", 
                  color: "primary.600",
                  transform: "scale(1.05)"
                }}
                transition="all 0.2s"
              />
              <Badge
                colorScheme="red"
                position="absolute"
                top="0"
                right="0"
                fontSize="xs"
                borderRadius="full"
                boxShadow="md"
                minW={5}
                h={5}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                3
              </Badge>
            </Box>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              borderRadius="xl"
              borderColor="gray.300"
              _hover={{ 
                borderColor: "red.300",
                bg: "red.50",
                color: "red.600",
                transform: "translateY(-1px)"
              }}
              transition="all 0.2s"
            >
              {t('auth.logout')}
            </Button>
          </HStack>
        </Flex>
      </Box>
    </motion.header>
  )
}

export default TopBar