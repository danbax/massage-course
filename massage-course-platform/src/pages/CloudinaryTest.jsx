import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Container, 
  Heading, 
  VStack, 
  Button, 
  Text, 
  Alert,
  SimpleGrid,
  Card,
  CardBody 
} from '@chakra-ui/react'
import CloudinaryVideoNew from '../components/CloudinaryVideoNew'
import CloudinaryDebug from '../components/CloudinaryDebug'
import { getCloudinaryVideoUrl, getCloudinaryThumbnailUrl, extractPublicIdFromUrl } from '../config/cloudinary'

const CloudinaryTest = () => {
  const [testResults, setTestResults] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Test video public IDs
  const testVideos = [
    'videos/1.1',
    'massage-course/lessons/lets-get-this-party-started/hey-welcome-to-the-course-1',
    'massage-course/lessons/lets-get-this-party-started/what-makes-you-awesome-at-this-2',
  ]

  const testCloudinaryIntegration = async () => {
    setIsLoading(true)
    const results = {}

    // Test URL generation
    testVideos.forEach(publicId => {
      results[publicId] = {
        standardUrl: getCloudinaryVideoUrl(publicId, 'standard'),
        highUrl: getCloudinaryVideoUrl(publicId, 'high'),
        mobileUrl: getCloudinaryVideoUrl(publicId, 'mobile'),
        thumbnailUrl: getCloudinaryThumbnailUrl(publicId),
        extractedId: extractPublicIdFromUrl(getCloudinaryVideoUrl(publicId))
      }
    })

    // Test backend connection
    try {
      const response = await fetch('/api/cloudinary/test', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      })
      const data = await response.json()
      results.backendTest = data
    } catch (error) {
      results.backendTest = { success: false, message: error.message }
    }

    setTestResults(results)
    setIsLoading(false)
  }

  return (
    <Container maxW="7xl">
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={4}>Cloudinary Integration Test</Heading>
          <Button 
            onClick={testCloudinaryIntegration} 
            isLoading={isLoading}
            colorScheme="blue"
            size="lg"
          >
            Test Cloudinary Integration
          </Button>
        </Box>

        {/* Debug Section */}
        <Box>
          <Heading size="md" mb={4}>Debug URLs</Heading>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
            {testVideos.map(publicId => (
              <CloudinaryDebug key={publicId} publicId={publicId} />
            ))}
          </SimpleGrid>
        </Box>

        {Object.keys(testResults).length > 0 && (
          <VStack spacing={6} align="stretch">
            {/* Backend Connection Test */}
            {testResults.backendTest && (
              <Box>
                <Heading size="md" mb={4}>Backend Connection Test</Heading>
                <Alert status={testResults.backendTest.success ? 'success' : 'error'}>
                  {testResults.backendTest.message}
                </Alert>
                {testResults.backendTest.config && (
                  <Box mt={4} p={4} bg="gray.50" borderRadius="md">
                    <Text fontSize="sm">
                      <strong>Cloud Name:</strong> {testResults.backendTest.config.cloud_name}<br/>
                      <strong>API Key:</strong> {testResults.backendTest.config.api_key}<br/>
                      <strong>Secure:</strong> {testResults.backendTest.config.secure ? 'Yes' : 'No'}
                    </Text>
                  </Box>
                )}
              </Box>
            )}

            {/* Video URL Generation Tests */}
            <Box>
              <Heading size="md" mb={4}>Video URL Generation Tests</Heading>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {testVideos.map(publicId => {
                  const result = testResults[publicId]
                  if (!result) return null

                  return (
                    <Card key={publicId}>
                      <CardBody>
                        <VStack align="stretch" spacing={4}>
                          <Box>
                            <Text fontWeight="bold" fontSize="sm" mb={2}>
                              Public ID: {publicId}
                            </Text>
                            
                            {/* Video Player Test */}
                            <Box mb={4}>
                              <Text fontSize="sm" mb={2}>Video Player:</Text>
                              <CloudinaryVideoNew
                                videoUrl={publicId}
                                quality="standard"
                                style={{ 
                                  width: '100%', 
                                  height: '200px',
                                  borderRadius: '8px'
                                }}
                              />
                            </Box>

                            {/* URL Tests */}
                            <VStack align="stretch" spacing={2} fontSize="xs">
                              <Box>
                                <Text fontWeight="bold">Standard URL:</Text>
                                <Text wordBreak="break-all" color="blue.600">
                                  {result.standardUrl}
                                </Text>
                              </Box>
                              
                              <Box>
                                <Text fontWeight="bold">High Quality URL:</Text>
                                <Text wordBreak="break-all" color="green.600">
                                  {result.highUrl}
                                </Text>
                              </Box>
                              
                              <Box>
                                <Text fontWeight="bold">Mobile URL:</Text>
                                <Text wordBreak="break-all" color="orange.600">
                                  {result.mobileUrl}
                                </Text>
                              </Box>
                              
                              <Box>
                                <Text fontWeight="bold">Thumbnail URL:</Text>
                                <Text wordBreak="break-all" color="purple.600">
                                  {result.thumbnailUrl}
                                </Text>
                              </Box>
                              
                              <Box>
                                <Text fontWeight="bold">Extracted Public ID:</Text>
                                <Text color={result.extractedId === publicId ? 'green.600' : 'red.600'}>
                                  {result.extractedId} {result.extractedId === publicId ? '✓' : '✗'}
                                </Text>
                              </Box>
                            </VStack>
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>
                  )
                })}
              </SimpleGrid>
            </Box>
          </VStack>
        )}

        {/* Instructions */}
        <Box p={6} bg="blue.50" borderRadius="lg">
          <Heading size="sm" mb={4}>Test Instructions</Heading>
          <VStack align="stretch" spacing={2} fontSize="sm">
            <Text>1. Click "Test Cloudinary Integration" to run tests</Text>
            <Text>2. Check if backend connection is successful</Text>
            <Text>3. Verify video URLs are generated correctly</Text>
            <Text>4. Test video playback with different qualities</Text>
            <Text>5. Ensure public ID extraction works properly</Text>
          </VStack>
        </Box>

        {/* Configuration Info */}
        <Box p={6} bg="gray.50" borderRadius="lg">
          <Heading size="sm" mb={4}>Configuration</Heading>
          <VStack align="stretch" spacing={2} fontSize="sm">
            <Text><strong>Cloud Name:</strong> Root</Text>
            <Text><strong>API Key:</strong> 883367577424919</Text>
            <Text><strong>Environment:</strong> Development</Text>
            <Text><strong>Note:</strong> API secret is securely stored on the backend only</Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}

export default CloudinaryTest
