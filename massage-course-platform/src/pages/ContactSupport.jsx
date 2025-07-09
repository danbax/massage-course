import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Text } from '@chakra-ui/react'

const ContactSupport = () => {
  return (
    <Box minH="100vh" bg="gray.50" p={8}>
      <Box bg="white" p={8} borderRadius="lg" maxW="4xl" mx="auto">
        <Text fontSize="2xl" fontWeight="bold" color="gray.900" mb={4}>
          Contact Support
        </Text>
        <Text color="gray.600" mb={8}>
          We're here to help! Get in touch with our support team.
        </Text>
        
        <Box as="form" onSubmit={(e) => e.preventDefault()}>
          <Box mb={4}>
            <Text fontWeight="600" fontSize="sm" mb={2}>Full Name</Text>
            <Box 
              as="input" 
              type="text" 
              placeholder="Enter your name"
              w="full"
              p={3}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              _focus={{ borderColor: "blue.400", outline: "none" }}
            />
          </Box>
          
          <Box mb={4}>
            <Text fontWeight="600" fontSize="sm" mb={2}>Email</Text>
            <Box 
              as="input" 
              type="email" 
              placeholder="Enter your email"
              w="full"
              p={3}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              _focus={{ borderColor: "blue.400", outline: "none" }}
            />
          </Box>
          
          <Box mb={6}>
            <Text fontWeight="600" fontSize="sm" mb={2}>Message</Text>
            <Box 
              as="textarea" 
              placeholder="Your message..."
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
            Send Message
          </Box>
        </Box>
        
        <Box mt={8} textAlign="center">
          <Link to="/" style={{ color: "#3182ce", textDecoration: "underline" }}>
            ← Back to Home
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default ContactSupport