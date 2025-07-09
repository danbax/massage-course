import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCourse } from '../hooks/useCourse'
import { Box, Container, Heading } from '@chakra-ui/react'

const VideoRedirect = () => {
  const navigate = useNavigate()
  const { getLastWatchedLesson, isLoading } = useCourse()

  useEffect(() => {
    if (!isLoading) {
      const lastWatchedLesson = getLastWatchedLesson()
      if (lastWatchedLesson) {
        navigate(`/app/video/${lastWatchedLesson.id}`, { replace: true })
      } else {
        // Fallback to first lesson if no lesson found
        navigate('/app/video/1', { replace: true })
      }
    }
  }, [isLoading, getLastWatchedLesson, navigate])

  if (isLoading) {
    return (
      <Container maxW="6xl">
        <Box textAlign="center" py={20}>
          <Heading color="gray.500">Loading...</Heading>
        </Box>
      </Container>
    )
  }

  return null // This component just redirects
}

export default VideoRedirect
