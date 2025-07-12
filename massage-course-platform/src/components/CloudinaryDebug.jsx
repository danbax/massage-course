import React from 'react'
import { Box, Text, Code, VStack, Link, Button } from '@chakra-ui/react'
import { getCloudinaryVideoUrl, getCloudinaryThumbnailUrl } from '../config/cloudinary'

const CloudinaryDebug = ({ publicId }) => {
  const videoUrl = getCloudinaryVideoUrl(publicId)
  const thumbnailUrl = getCloudinaryThumbnailUrl(publicId)

  const testUrl = (url) => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
      <VStack spacing={3} align="stretch">
        <Text fontWeight="bold">Cloudinary Debug Info</Text>
        
        <Box>
          <Text fontSize="sm" color="gray.600">Input Public ID:</Text>
          <Code>{publicId || 'null'}</Code>
        </Box>
        
        <Box>
          <Text fontSize="sm" color="gray.600">Generated Video URL:</Text>
          <Code fontSize="xs" wordBreak="break-all">{videoUrl || 'null'}</Code>
          {videoUrl && (
            <Button size="sm" mt={2} onClick={() => testUrl(videoUrl)}>
              Test Video URL
            </Button>
          )}
        </Box>
        
        <Box>
          <Text fontSize="sm" color="gray.600">Generated Thumbnail URL:</Text>
          <Code fontSize="xs" wordBreak="break-all">{thumbnailUrl || 'null'}</Code>
          {thumbnailUrl && (
            <Button size="sm" mt={2} onClick={() => testUrl(thumbnailUrl)}>
              Test Thumbnail URL
            </Button>
          )}
        </Box>
      </VStack>
    </Box>
  )
}

export default CloudinaryDebug
