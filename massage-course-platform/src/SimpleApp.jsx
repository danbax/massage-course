import { Box, Text } from '@chakra-ui/react'

function SimpleApp() {
  return (
    <Box p={8} bg="blue.500" color="white">
      <Text fontSize="2xl" fontWeight="bold">
        Simple App is Working!
      </Text>
      <Text>
        This confirms Chakra UI v3 is working properly.
      </Text>
    </Box>
  )
}

export default SimpleApp
