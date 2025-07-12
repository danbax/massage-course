import React from 'react'
import { Box, Text } from '@chakra-ui/react'

const CloudinaryVideo = ({ videoUrl, ...props }) => {
  console.log('Simple CloudinaryVideo loaded with:', videoUrl)
  
  return (
    <Box 
      width="100%" 
      height="400px" 
      bg="gray.100" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      {...props}
    >
      <Text>CloudinaryVideo Component Loaded</Text>
      <Text fontSize="sm" color="gray.600">Video URL: {videoUrl}</Text>
    </Box>
  )
}

export default CloudinaryVideo
