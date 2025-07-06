import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Flex
} from '@chakra-ui/react'
import { FaChevronDown, FaGlobe, FaCheck } from 'react-icons/fa'
import { useLanguage } from '../../hooks/useLanguage'
import { getAvailableLanguages, languageConfig } from '../../data/languages'

const LanguageSelector = ({ size = 'sm', variant = 'ghost' }) => {
  const { currentLanguage, changeLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const availableLanguages = getAvailableLanguages()
  const currentLangConfig = languageConfig[currentLanguage]
  const menuRef = useRef(null)

  console.log('Available languages:', availableLanguages)
  console.log('Current language config:', currentLangConfig)
  console.log('Is open:', isOpen)

  const handleToggle = () => {
    console.log('Button clicked, current isOpen:', isOpen)
    setIsOpen(!isOpen)
  }

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode)
    setIsOpen(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <Box position="relative" ref={menuRef}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          rightIcon={
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaChevronDown />
            </motion.div>
          }
          size={size}
          variant="outline"
          onClick={handleToggle}
          bg={isOpen ? 'blue.100' : 'white'}
          borderColor={isOpen ? 'blue.400' : 'gray.200'}
          borderWidth="2px"
          boxShadow={isOpen ? `0 0 0 3px rgba(66, 153, 225, 0.15)` : 'md'}
          _hover={{
            bg: 'blue.50',
            borderColor: 'blue.300',
            transform: 'translateY(-1px)',
            boxShadow: 'lg'
          }}
          _active={{
            bg: 'blue.100',
            borderColor: 'blue.500'
          }}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          borderRadius="xl"
          px={4}
          py={2}
          minW="140px"
          h="auto"
        >
          <HStack spacing={3}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="24px"
              h="24px"
              borderRadius="full"
              bg="gray.100"
              fontSize="sm"
            >
              {currentLangConfig?.flag || <FaGlobe />}
            </Box>
            <VStack spacing={0} align="start">
              <Text 
                fontWeight="600" 
                fontSize="sm" 
                color="gray.700"
                lineHeight="1.2"
                display={{ base: 'none', md: 'block' }}
              >
                {currentLangConfig?.code.toUpperCase()}
              </Text>
              <Text 
                fontSize="xs" 
                color="gray.500"
                lineHeight="1"
                display={{ base: 'none', lg: 'block' }}
              >
                {currentLangConfig?.name}
              </Text>
            </VStack>
          </HStack>
        </Button>
      </motion.div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Box
              position="absolute"
              top="100%"
              left={0}
              bg="white"
              borderColor="gray.200"
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.1)"
              py={3}
              minW="280px"
              zIndex={9999}
              mt={2}
              overflow="hidden"
            >
              {availableLanguages.map((lang, index) => (
                <motion.div
                  key={lang.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "rgba(66, 153, 225, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Box
                    px={5}
                    py={4}
                    cursor="pointer"
                    bg={currentLanguage === lang.code ? 'blue.50' : 'transparent'}
                    borderLeft={currentLanguage === lang.code ? '4px solid' : '4px solid transparent'}
                    borderLeftColor={currentLanguage === lang.code ? 'blue.500' : 'transparent'}
                    _hover={{
                      bg: currentLanguage === lang.code ? 'blue.100' : 'gray.50',
                      transform: 'translateX(4px)'
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    onClick={() => handleLanguageChange(lang.code)}
                    position="relative"
                  >
                    <Flex align="center" justify="space-between" w="full">
                      <HStack spacing={4} flex={1}>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          w="36px"
                          h="36px"
                          borderRadius="full"
                          bg="gray.100"
                          fontSize="lg"
                          border="2px solid"
                          borderColor={currentLanguage === lang.code ? 'blue.300' : 'gray.200'}
                          transition="all 0.3s"
                        >
                          {lang.flag}
                        </Box>
                        <VStack align="start" spacing={1} flex={1}>
                          <Text 
                            fontSize="md" 
                            fontWeight="600" 
                            color={currentLanguage === lang.code ? 'blue.700' : 'gray.900'}
                            lineHeight="1.2"
                          >
                            {lang.name}
                          </Text>
                          <Text 
                            fontSize="sm" 
                            color={currentLanguage === lang.code ? 'blue.600' : 'gray.600'}
                            fontWeight="400"
                            lineHeight="1"
                          >
                            {lang.nativeName}
                          </Text>
                        </VStack>
                      </HStack>
                      {currentLanguage === lang.code && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, type: "spring" }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            w="24px"
                            h="24px"
                            bg="blue.500"
                            borderRadius="full"
                            color="white"
                            fontSize="xs"
                          >
                            <FaCheck />
                          </Box>
                        </motion.div>
                      )}
                    </Flex>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default LanguageSelector
