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
  const { moduleId, lessonId } = useParams()
  const navigate = useNavigate()
  const { 
    findLessonByCompositeKey, 
    getNextLesson, 
    currentLesson, 
    setCurrentLesson, 
    markLessonComplete, 
    updateWatchProgress, 
    watchProgress, 
    isLoading: contextLoading 
  } = useCourse()
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
  const [videoError, setVideoError] = useState(false)

  const lesson = findLessonByCompositeKey(
    parseInt(moduleId), 
    parseInt(lessonId), 
    currentLanguage
  )
  
  const hasValidVideo = lesson?.video_url && lesson.video_url !== null
  const lessonCompositeKey = lesson ? `${lesson.module_id}-${lesson.id}-${lesson.language}` : null

  const handleMouseEnter = useCallback(() => {
    setShowControls(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setShowControls(isPlaying ? false : true)
  }, [isPlaying])

  useEffect(() => {
    if (!lesson) return
    
    setCurrentLesson(lesson)
    setIsLoading(true)
    setVideoError(false)
  }, [lesson, setCurrentLesson])

  useEffect(() => {
    return () => {
      if (!lesson || !lessonCompositeKey) return
      
      const video = videoRef.current
      if (!video || !video.duration || video.currentTime <= 0) return
      
      const currentProgress = (video.currentTime / video.duration) * 100
      updateWatchProgress(lessonCompositeKey, currentProgress)
    }
  }, [lesson, lessonCompositeKey, updateWatchProgress])

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current
    if (!video || !video.duration) return
    
    setDuration(video.duration)
    setVideoError(false)
  }, [])

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video || !video.duration || !lessonCompositeKey) return
    
    const current = video.currentTime
    const progressPercent = (current / video.duration) * 100
    
    setCurrentTime(current)
    setProgress(progressPercent)
    updateWatchProgress(lessonCompositeKey, progressPercent)
  }, [lessonCompositeKey, updateWatchProgress])

  const handlePlay = useCallback(() => setIsPlaying(true), [])
  const handlePause = useCallback(() => setIsPlaying(false), [])
  
  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    const video = videoRef.current
    if (!video || !video.duration) return
    
    const currentProgress = (video.currentTime / video.duration) * 100
    if (currentProgress >= 80) {
      toast.success(t('video.videoCompleted'))
    }
  }, [t])

  const handleLoadStart = useCallback(() => {
    setIsLoading(true)
    setVideoError(false)
  }, [])
  
  const handleCanPlay = useCallback(() => {
    setIsLoading(false)
    setVideoError(false)
  }, [])
  
  const handleLoadedData = useCallback(() => {
    setIsLoading(false)
    setVideoError(false)
  }, [])

  const handleError = useCallback((e) => {
    console.error('Video error:', e)
    setIsLoading(false)
    setVideoError(true)
    toast.error(t('video.errorLoadingVideo'))
  }, [t])

  useEffect(() => {
    if (!hasValidVideo) {
      setIsLoading(false)
    }
  }, [hasValidVideo])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !lesson || !duration || !lessonCompositeKey) return

    const savedProgress = watchProgress[lessonCompositeKey]
    if (!savedProgress || savedProgress <= 0) return
    
    const savedTime = (savedProgress / 100) * duration
    if (Math.abs(video.currentTime - savedTime) <= 1) return
    
    video.currentTime = savedTime
    setCurrentTime(savedTime)
    setProgress(savedProgress)
  }, [lesson, lessonCompositeKey, duration, watchProgress])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
      return
    }
    
    video.play().catch(error => {
      console.error('Error playing video:', error)
      toast.error(t('video.unableToPlay'))
    })
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
      setIsFullscreen(true)
      return
    }
    
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
    setIsFullscreen(false)
  }

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleMarkComplete = () => {
    if (!lessonCompositeKey) return
    
    if (progress >= 80) {
      markLessonComplete(lessonCompositeKey)
      toast.success(t('video.lessonCompleted'))
      return
    }
    
    toast.error(t('video.watchMoreToComplete'))
  }

  const handleNextLesson = () => {
    if (!lesson) return
    
    const nextLesson = getNextLesson(lesson.module_id, lesson.id, currentLanguage)
    
    if (nextLesson) {
      navigate(`/app/video/${nextLesson.module_id}/${nextLesson.id}`)
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
          <Text color="gray.500" mt={2}>
            Module {moduleId}, Lesson {lessonId} in {currentLanguage}
          </Text>
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
            {hasValidVideo && !videoError ? (
              <video
                ref={videoRef}
                src={lesson.video_url}
                poster={lesson.thumbnail}
                controls={false}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                onLoadStart={handleLoadStart}
                onCanPlay={handleCanPlay}
                onLoadedData={handleLoadedData}
                onError={handleError}
                style={{ 
                  width: '100%',
                  height: '500px',
                  objectFit: 'cover',
                  backgroundColor: '#000',
                  display: 'block'
                }}
                preload="metadata"
                playsInline
              />
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
                    {videoError ? t('video.errorLoadingVideo') : t('video.videoNotAvailable')}
                  </Text>
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    {videoError 
                      ? 'Please check the video URL and try again'
                      : t('video.videoNotAvailableDesc')
                    }
                  </Text>
                </VStack>
              </Box>
            )}

            {isLoading && hasValidVideo && !videoError && (
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

            {!isPlaying && !isLoading && hasValidVideo && !videoError && (
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

            {hasValidVideo && !videoError && (
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
            )}
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
                    {lesson.module_title || `Module ${lesson.module_id}`}
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
                  {lessonCompositeKey && watchProgress[lessonCompositeKey] > 0 && !lesson.completed && (
                    <Badge colorScheme="blue" variant="solid" fontSize="xs">
                      {Math.round(watchProgress[lessonCompositeKey])}% {t('progress.lessonProgress.watched')}
                    </Badge>
                  )}
                </HStack>
                <Heading size="lg" color="gray.900">
                  {lesson.title}
                </Heading>
                <Text color="gray.600" lineHeight="relaxed">
                  {lesson.description}
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
                  isDisabled={!getNextLesson(lesson.module_id, lesson.id, currentLanguage)}
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