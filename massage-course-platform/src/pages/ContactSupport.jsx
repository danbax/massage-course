import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { Box, Text } from '@chakra-ui/react'

const ContactSupport = () => {
  const { t } = useLanguage()

  return (
    <Box minH="100vh" bg="gray.50" p={8}>
      <Box bg="white" p={8} borderRadius="lg" maxW="4xl" mx="auto">
        <Text fontSize="2xl" fontWeight="bold" color="gray.900" mb={4}>
          {t('support.contactSupport')}
        </Text>
        <Text color="gray.600" mb={8}>
          {t('support.supportDescription')}
        </Text>
        
        <Box as="form" onSubmit={(e) => e.preventDefault()}>
          <Box mb={4}>
            <Text fontWeight="600" fontSize="sm" mb={2}>{t('support.fullName')}</Text>
            <Box 
              as="input" 
              type="text" 
              placeholder={t('support.fullNamePlaceholder')}
              w="full"
              p={3}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              _focus={{ borderColor: "blue.400", outline: "none" }}
            />
          </Box>
          
          <Box mb={4}>
            <Text fontWeight="600" fontSize="sm" mb={2}>{t('support.email')}</Text>
            <Box 
              as="input" 
              type="email" 
              placeholder={t('support.emailPlaceholder')}
              w="full"
              p={3}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              _focus={{ borderColor: "blue.400", outline: "none" }}
            />
          </Box>
          
          <Box mb={6}>
            <Text fontWeight="600" fontSize="sm" mb={2}>{t('support.message')}</Text>
            <Box 
              as="textarea" 
              placeholder={t('support.messagePlaceholder')}
              w="full"
              p={3}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              rows={5}
              _focus={{ borderColor: "blue.400", outline: "none" }}
            />
          </Box>
          
          <Box 
            as="button"
            type="submit"
            bg="blue.500"
            color="white"
            px={8}
            py={3}
            borderRadius="md"
            w="full"
            _hover={{ bg: "blue.600" }}
            cursor="pointer"
            border="none"
            fontSize="md"
            fontWeight="600"
          >
            {t('support.sendMessage')}
          </Box>
        </Box>
        
        <Box mt={8} textAlign="center">
          <Link to="/" style={{ color: "#3182ce", textDecoration: "underline" }}>
            {t('support.backToHome')}
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default ContactSupport