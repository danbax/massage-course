import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCourse } from '../hooks/useCourse'
import { useLanguage } from '../hooks/useLanguage'
import { Box, Container, Heading } from '@chakra-ui/react'

const VideoRedirect = () => {
  const navigate = useNavigate()
  const { moduleId, lessonId, legacyLessonId } = useParams()
  const { getLastWatchedLesson, lessons, isLoading } = useCourse()
  const { currentLanguage } = useLanguage()

  useEffect(() => {
    if (isLoading) return

    // If we have both moduleId and lessonId, this is already the new format
    // but called through the redirect route, so just navigate to the proper route
    if (moduleId && lessonId) {
      navigate(`/app/video/${moduleId}/${lessonId}`, { replace: true })
      return
    }

    // Handle legacy lesson ID redirect (old URL format: /video/123)
    if (legacyLessonId) {
      const legacyId = parseInt(legacyLessonId)
      
      // Try different strategies to find the lesson
      let targetLesson = null
      
      // Strategy 1: Look for lesson with matching legacy_id field
      targetLesson = lessons.find(l => 
        l.legacy_id === legacyId && l.language === currentLanguage
      )
      
      // Strategy 2: Look for lesson with matching global_id field
      if (!targetLesson) {
        targetLesson = lessons.find(l => 
          l.global_id === legacyId && l.language === currentLanguage
        )
      }
      
      // Strategy 3: Sequential mapping for migration (assumes lessons were sequentially numbered)
      if (!targetLesson) {
        const currentLanguageLessons = lessons
          .filter(l => l.language === currentLanguage)
          .sort((a, b) => {
            // Sort by module order first, then lesson order
            if (a.module_id !== b.module_id) {
              return a.module_id - b.module_id
            }
            return (a.order || a.id) - (b.order || b.id)
          })
        
        // Use legacy ID as index (1-based to 0-based conversion)
        const lessonIndex = legacyId - 1
        if (lessonIndex >= 0 && lessonIndex < currentLanguageLessons.length) {
          targetLesson = currentLanguageLessons[lessonIndex]
        }
      }
      
      // Strategy 4: Try to find by lesson ID in any module for current language
      if (!targetLesson) {
        targetLesson = lessons.find(l => 
          l.id === legacyId && l.language === currentLanguage
        )
      }
      
      if (targetLesson) {
        navigate(`/app/video/${targetLesson.module_id}/${targetLesson.id}`, { replace: true })
        return
      }
      
      // If legacy lesson not found, redirect to first lesson
      const firstLesson = lessons
        .filter(l => l.language === currentLanguage)
        .sort((a, b) => {
          if (a.module_id !== b.module_id) {
            return a.module_id - b.module_id
          }
          return (a.order || a.id) - (b.order || b.id)
        })[0]
      
      if (firstLesson) {
        navigate(`/app/video/${firstLesson.module_id}/${firstLesson.id}`, { replace: true })
        return
      }
    }

    // Normal redirect to last watched lesson (no legacy ID)
    const lastWatchedLesson = getLastWatchedLesson()
    if (lastWatchedLesson) {
      navigate(`/app/video/${lastWatchedLesson.module_id}/${lastWatchedLesson.id}`, { replace: true })
      return
    }
    
    // Fallback to first lesson in current language
    const firstLesson = lessons
      .filter(l => l.language === currentLanguage)
      .sort((a, b) => {
        if (a.module_id !== b.module_id) {
          return a.module_id - b.module_id
        }
        return (a.order || a.id) - (b.order || b.id)
      })[0]
    
    if (firstLesson) {
      navigate(`/app/video/${firstLesson.module_id}/${firstLesson.id}`, { replace: true })
      return
    }
    
    // Final fallback to courses page if no lessons found
    navigate('/app/courses', { replace: true })
  }, [
    isLoading, 
    moduleId, 
    lessonId, 
    legacyLessonId, 
    getLastWatchedLesson, 
    lessons, 
    currentLanguage, 
    navigate
  ])

  if (isLoading) {
    return (
      <Container maxW="6xl">
        <Box textAlign="center" py={20}>
          <Heading color="gray.500">Loading...</Heading>
        </Box>
      </Container>
    )
  }

  // Show loading state while redirecting
  return (
    <Container maxW="6xl">
      <Box textAlign="center" py={20}>
        <Heading color="gray.500">Redirecting...</Heading>
      </Box>
    </Container>
  )
}

export default VideoRedirect