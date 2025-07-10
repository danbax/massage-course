import { motion } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCourse } from '../hooks/useCourse'
import { useLanguage } from '../hooks/useLanguage'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Flex,
  Badge
} from '@chakra-ui/react'
import { 
  FaPlay,
  FaPause,
  FaArrowLeft,
  FaCheck,
  FaArrowRight,
  FaVolumeUp,
  FaExpand,
  FaCompress
} from 'react-icons/fa'
import toast from 'react-hot-toast'

const VideoPlayer = () => {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { lessons, currentLesson, setCurrentLesson, markLessonComplete, updateWatchProgress, watchProgress, isLoading: contextLoading } = useCourse()
  const { t, currentLanguage } = useLanguage()
  
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const lesson = lessons.find(l => l.id === parseInt(lessonId))
  
  const hasValidVideo = lesson?.videoUrl && lesson.videoUrl !== null

  const handleMouseEnter = useCallback(() => {
    setShowControls(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setShowControls(isPlaying ? false : true)
  }, [isPlaying])

  useEffect(() => {
    if (lesson) {
      setCurrentLesson(lesson)
      setIsLoading(true)
    }
  }, [lesson, setCurrentLesson])

  useEffect(() => {
    return () => {
      if (lesson) {
        const video = videoRef.current
        if (video && video.duration && video.currentTime > 0) {
          const currentProgress = (video.currentTime / video.duration) * 100
          updateWatchProgress(lesson.id, currentProgress)
        }
      }
    }
  }, [lesson?.id, updateWatchProgress])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !lesson || !hasValidVideo) {
      if (!hasValidVideo) {
        setIsLoading(false)
      }
      return
    }

    setIsLoading(true)

    const loadingTimeout = setTimeout(() => {
      console.warn('Video loading timeout reached')
      setIsLoading(false)
    }, 10000)

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleTimeUpdate = () => {
      if (!video.duration) return
      
      const current = video.currentTime
      const progressPercent = (current / video.duration) * 100
      
      setCurrentTime(current)
      setProgress(progressPercent)
      updateWatchProgress(lesson.id, progressPercent)
      
      if (progressPercent >= 80 && progressPercent < 85) {
      }
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      const video = videoRef.current
      if (video && video.duration) {
        const currentProgress = (video.currentTime / video.duration) * 100
        if (currentProgress >= 80) {
          toast.success(t('video.videoCompleted'))
        }
      }
    }

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => {
      clearTimeout(loadingTimeout)
      setIsLoading(false)
    }
    const handleLoadedData = () => {
      clearTimeout(loadingTimeout)
      setIsLoading(false)
    }

    const handleError = () => {
      clearTimeout(loadingTimeout)
      setIsLoading(false)
      toast.error(t('video.errorLoadingVideo'))
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)

    return () => {
      clearTimeout(loadingTimeout)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
    }
  }, [lesson?.id, hasValidVideo, updateWatchProgress, t])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !lesson || !duration) return

    const savedProgress = watchProgress[lesson.id]
    if (savedProgress && savedProgress > 0) {
      const savedTime = (savedProgress / 100) * duration
      if (Math.abs(video.currentTime - savedTime) > 1) {
        video.currentTime = savedTime
        setCurrentTime(savedTime)
        setProgress(savedProgress)
      }
    }
  }, [lesson?.id, duration, watchProgress])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play().catch(error => {
        console.error('Error playing video:', error)
        toast.error(t('video.unableToPlay'))
      })
    }
  }

  const handleSeek = (value) => {
    const video = videoRef.current
    if (!video || !duration) return
    
    const newTime = (value / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
    setProgress(value)
  }

  const handleVolumeChange = (value) => {
    const video = videoRef.current
    if (!video) return
    
    const newVolume = value / 100
    video.volume = newVolume
    setVolume(newVolume)
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleMarkComplete = () => {
    if (progress >= 80) {
      markLessonComplete(lesson.id)
      toast.success(t('video.lessonCompleted'))
    } else {
      toast.error(t('video.watchMoreToComplete'))
    }
  }

  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex(l => l.id === lesson.id)
    const nextLesson = lessons[currentIndex + 1]
    
    if (nextLesson) {
      navigate(`/app/video/${nextLesson.id}`)
    }
  }

  if (contextLoading) {
    return (
      <Container maxW="6xl">
        <Box textAlign="center" py={20}>
          <Heading color="gray.500">{t('video.loadingLesson')}</Heading>
        </Box>
      </Container>
    )
  }

  if (!lesson) {
    return (
      <Container maxW="6xl">
        <Box textAlign="center" py={20}>
          <Heading color="gray.500">{t('video.lessonNotFound')}</Heading>
          <Button mt={4} onClick={() => navigate('/app/courses')}>
            {t('common.backToHome')}
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxW="6xl">
      <VStack spacing={6} align="stretch">
        <Button
          leftIcon={<FaArrowLeft />}
          variant="outline"
          alignSelf="flex-start"
          onClick={() => navigate('/app/courses')}
        >
          {t('video.backToCourses')}
        </Button>

        <Box 
          bg="white"
          borderRadius="2xl"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.100"
          overflow="hidden"
        >
          <Box 
            ref={containerRef}
            position="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {hasValidVideo ? (
              <video
                ref={videoRef}
                width="100%"
                height="500px"
                poster={lesson.thumbnail}
                style={{ 
                  objectFit: 'cover',
                  backgroundColor: '#000'
                }}
                onError={(e) => {
                  console.error('Video error:', e)
                  toast.error(t('video.errorLoadingVideo'))
                  setIsLoading(false)
                }}
              >
                <source src={lesson.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Box
                width="100%"
                height="500px"
                bg="gray.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                gap={4}
              >
                <Box
                  width="80px"
                  height="80px"
                  bg="gray.300"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaPlay} w={8} h={8} color="gray.600" />
                </Box>
                <VStack spacing={2}>
                  <Text fontSize="lg" fontWeight="medium" color="gray.600">
                    {t('video.videoNotAvailable')}
                  </Text>
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    {t('video.videoNotAvailableDesc')}
                  </Text>
                </VStack>
              </Box>
            )}

            {isLoading && hasValidVideo && (
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                textAlign="center"
                zIndex={997}
                bg="rgba(0, 0, 0, 0.5)"
              >
                <Box bg="rgba(0, 0, 0, 0.8)" px={6} py={4} borderRadius="md">
                  <Text fontSize="lg">{t('video.loading')}</Text>
                </Box>
              </Box>
            )}

            {!isPlaying && !isLoading && hasValidVideo && (
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                display="flex"
                alignItems="center"
                justifyContent="center"
                zIndex={999}
                pointerEvents="none"
              >
                <Button
                  onClick={togglePlay}
                  size="lg"
                  borderRadius="full"
                  bg="rgba(255, 255, 255, 0.9)"
                  color="blue.500"
                  boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)"
                  w={20}
                  h={20}
                  fontSize="2xl"
                  _hover={{ 
                    transform: 'scale(1.1)',
                    bg: 'white'
                  }}
                  transition="all 0.2s"
                  aria-label={t('video.controls.play')}
                  pointerEvents="all"
                  minW="auto"
                  p={0}
                >
                  <Icon as={FaPlay} />
                </Button>
              </Box>
            )}

            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              bg="linear-gradient(transparent, rgba(0, 0, 0, 0.7))"
              color="white"
              p={4}
              opacity={showControls ? 1 : 0}
              transition="opacity 0.3s"
              zIndex={998}
              pointerEvents={showControls ? "all" : "none"}
            >
              <VStack spacing={3}>
                <Box w="full">
                  <Box
                    bg="whiteAlpha.300"
                    h="2"
                    borderRadius="full"
                    cursor="pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const clickX = e.clientX - rect.left
                      const percentage = (clickX / rect.width) * 100
                      handleSeek(percentage)
                    }}
                  >
                    <Box
                      bg="blue.400"
                      h="full"
                      borderRadius="full"
                      width={`${progress}%`}
                      transition="width 0.1s"
                    />
                  </Box>
                </Box>

                <HStack spacing={4} w="full" justify="space-between">
                  <HStack spacing={3}>
                    <Button
                      onClick={togglePlay}
                      variant="ghost"
                      color="white"
                      size="sm"
                      _hover={{ bg: "whiteAlpha.200" }}
                      aria-label={isPlaying ? t('video.controls.pause') : t('video.controls.play')}
                      minW="auto"
                      p={2}
                    >
                      <Icon as={isPlaying ? FaPause : FaPlay} />
                    </Button>

                    <Text fontSize="sm" minW="100px">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </Text>
                  </HStack>

                  <HStack spacing={3}>
                    <HStack spacing={2} w="100px">
                      <Icon as={FaVolumeUp} w={4} h={4} />
                      <Box
                        bg="whiteAlpha.300"
                        h="1"
                        borderRadius="full"
                        cursor="pointer"
                        flex="1"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect()
                          const clickX = e.clientX - rect.left
                          const percentage = (clickX / rect.width) * 100
                          handleVolumeChange(percentage)
                        }}
                      >
                        <Box
                          bg="white"
                          h="full"
                          borderRadius="full"
                          width={`${volume * 100}%`}
                          transition="width 0.1s"
                        />
                      </Box>
                    </HStack>

                    <Button
                      onClick={toggleFullscreen}
                      variant="ghost"
                      color="white"
                      size="sm"
                      _hover={{ bg: "whiteAlpha.200" }}
                      aria-label={isFullscreen ? t('video.controls.exitFullscreen') : t('video.controls.fullscreen')}
                      minW="auto"
                      p={2}
                    >
                      <Icon as={isFullscreen ? FaCompress : FaExpand} />
                    </Button>
                  </HStack>
                </HStack>
              </VStack>
            </Box>
          </Box>
        </Box>

        <Box
          bg={lesson.completed ? "green.50" : "white"}
          borderRadius="2xl"
          boxShadow="lg"
          border="1px solid"
          borderColor={lesson.completed ? "green.200" : "gray.100"}
        >
          <Box p={6}>
            <Flex justify="space-between" align="start" mb={4} direction={{ base: "column", md: "row" }} gap={4}>
              <VStack align="start" flex={1} spacing={2}>
                <HStack spacing={3}>
                  <Text fontSize="sm" color="blue.600" fontWeight="medium">
                    {lesson.module}
                  </Text>
                  {lesson.completed && (
                    <Badge 
                      colorScheme="green" 
                      variant="solid" 
                      fontSize="xs"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      <HStack spacing={1}>
                        <Icon as={FaCheck} w={3} h={3} />
                        <Text fontWeight="bold">{t('course.completed')}</Text>
                      </HStack>
                    </Badge>
                  )}
                  {watchProgress[lesson.id] > 0 && !lesson.completed && (
                    <Badge colorScheme="blue" variant="solid" fontSize="xs">
                      {Math.round(watchProgress[lesson.id])}% {t('progress.lessonProgress.watched')}
                    </Badge>
                  )}
                </HStack>
                <Heading size="lg" color="gray.900">
                  {lesson.title[currentLanguage]}
                </Heading>
                <Text color="gray.600" lineHeight="relaxed">
                  {lesson.description[currentLanguage]}
                </Text>
              </VStack>
              
              <HStack spacing={3}>
                <Button
                  leftIcon={<FaCheck />}
                  onClick={handleMarkComplete}
                  isDisabled={progress < 80 || lesson.completed}
                  colorScheme={lesson.completed ? 'green' : 'blue'}
                >
                  {lesson.completed ? t('course.completed') : t('course.markComplete')}
                </Button>
                
                <Button
                  rightIcon={<FaArrowRight />}
                  variant="outline"
                  onClick={handleNextLesson}
                  isDisabled={!lessons[lessons.findIndex(l => l.id === lesson.id) + 1]}
                >
                  {t('course.nextLesson')}
                </Button>
              </HStack>
            </Flex>

            <Box>
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontSize="sm" color="gray.600">{t('video.watchProgress')}</Text>
                <Text fontSize="sm" fontWeight="medium">{Math.round(progress)}%</Text>
              </Flex>
              <Box bg="gray.200" h="2" borderRadius="full">
                <Box
                  bg="blue.500"
                  h="full"
                  borderRadius="full"
                  width={`${progress}%`}
                  transition="width 0.3s"
                />
              </Box>
              {progress < 80 && (
                <Text fontSize="xs" color="gray.500" mt={2}>
                  {t('video.watchAtLeast')}
                </Text>
              )}
            </Box>
          </Box>
        </Box>
      </VStack>
    </Container>
  )
}

export default VideoPlayer