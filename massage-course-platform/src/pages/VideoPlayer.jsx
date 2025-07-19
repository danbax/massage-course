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
  FaArrowLeft,
  FaCheck,
  FaArrowRight
} from 'react-icons/fa'
import toast from 'react-hot-toast'

const VideoPlayer = () => {
  console.log('🎬 VideoPlayer component rendered')
  
  const { moduleId, lessonId } = useParams()
  console.log('📍 URL params:', { moduleId, lessonId })
  
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
  
  console.log('🌐 Current language:', currentLanguage)
  console.log('⏳ Context loading:', contextLoading)
  
  const playerRef = useRef(null)
  const playerInstanceRef = useRef(null)
  const initTimeoutRef = useRef(null)
  const hasRestoredProgress = useRef(false)
  const isPlayingRef = useRef(false)
  
  const [player, setPlayer] = useState(null)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [videoError, setVideoError] = useState(false)
  
  const [analytics, setAnalytics] = useState({
    playCount: 0,
    pauseCount: 0,
    totalWatchTime: 0,
    lastPlayTime: 0,
    hasReachedMidpoint: false,
    hasReached75Percent: false
  })

  const lesson = findLessonByCompositeKey(
    parseInt(moduleId), 
    parseInt(lessonId), 
    currentLanguage
  )
  
  console.log('📖 Lesson lookup result:', lesson?.title || 'null')
  console.log('- Module ID (parsed):', parseInt(moduleId))
  console.log('- Lesson ID (parsed):', parseInt(lessonId)) 
  console.log('- Current language:', currentLanguage)
  
  const hasValidVideo = lesson?.video_url && lesson.video_url !== null
  const lessonCompositeKey = lesson ? `${lesson.module_id}-${lesson.id}-${lesson.language}` : null
  
  console.log('🎥 Video validation:', {
    hasValidVideo,
    videoUrl: lesson?.video_url || 'null',
    lessonCompositeKey
  })
  
  if (lessonCompositeKey && watchProgress[lessonCompositeKey]) {
    console.log('💾 Existing watch progress:', watchProgress[lessonCompositeKey] + '%')
  }

  useEffect(() => {
    console.log('⏰ Fallback timer useEffect triggered')
    console.log('- hasValidVideo:', hasValidVideo)
    
    if (!hasValidVideo) {
      console.log('❌ No valid video, skipping fallback timer')
      return
    }
    
    const fallbackTimer = setTimeout(() => {
      console.log('⚠️ Fallback timer fired after 8 seconds')
      console.log('- isLoading:', isLoading)
      console.log('- isPlayerReady:', isPlayerReady) 
      console.log('- videoError:', videoError)
      
      if (isLoading && !isPlayerReady && !videoError) {
        console.log('📺 Fallback: Setting loading to false')
        setIsLoading(false)
        toast('Video loaded (tracking disabled)', { icon: '⚠️' })
      }
    }, 8000)

    return () => {
      console.log('🧹 Cleaning up fallback timer')
      clearTimeout(fallbackTimer)
    }
  }, [hasValidVideo, isLoading, isPlayerReady, videoError])

  useEffect(() => {
    console.log('🔧 Player initialization useEffect triggered')
    console.log('- hasValidVideo:', hasValidVideo)
    console.log('- window.playerjs exists:', !!window.playerjs)
    console.log('- lesson.video_url:', lesson?.video_url)
    
    if (!hasValidVideo || !window.playerjs) {
      console.log('❌ Skipping player initialization - missing requirements')
      return
    }
    
    const initializePlayer = () => {
      console.log('🎬 Starting player initialization...')
      
      if (!playerRef.current) {
        console.log('❌ playerRef.current is null')
        return
      }
      
      console.log('✅ playerRef.current exists:', playerRef.current)
      
      try {
        console.log('🎯 Creating Player.js instance...')
        const playerInstance = new window.playerjs.Player(playerRef.current)
        playerInstanceRef.current = playerInstance
        setPlayer(playerInstance)
        console.log('✅ Player instance created successfully')

        playerInstance.on('ready', () => {
          console.log('🎉 PLAYER READY EVENT FIRED!')
          setIsPlayerReady(true)
          setIsLoading(false)
          setVideoError(false)
          
          // Test if player supports timeupdate
          console.log('🧪 Testing player capabilities...')
          console.log('- supports timeupdate:', playerInstance.supports && playerInstance.supports('event', 'timeupdate'))
          console.log('- supports play:', playerInstance.supports && playerInstance.supports('method', 'play'))
          console.log('- supports getCurrentTime:', playerInstance.supports && playerInstance.supports('method', 'getCurrentTime'))
          
          console.log('📏 Getting duration...')
          playerInstance.getDuration(duration => {
            console.log('✅ Duration received:', duration)
            setDuration(duration)
            
            // Test getting current time
            console.log('🧪 Testing getCurrentTime...')
            playerInstance.getCurrentTime(currentTime => {
              console.log('⏰ Current time from player:', currentTime)
            })
            
            console.log('🔍 Checking for saved progress...')
            console.log('- lessonCompositeKey:', lessonCompositeKey)
            console.log('- watchProgress[key]:', lessonCompositeKey ? watchProgress[lessonCompositeKey] : 'N/A')
            console.log('- hasRestoredProgress.current:', hasRestoredProgress.current)
            
            if (lessonCompositeKey && watchProgress[lessonCompositeKey] > 0 && !hasRestoredProgress.current) {
              const savedTime = (watchProgress[lessonCompositeKey] / 100) * duration
              console.log('⏰ Calculated saved time:', savedTime, 'seconds')
              
              if (savedTime > 5 && savedTime < duration - 10) {
                console.log('🔄 Attempting to restore position to:', savedTime)
                setTimeout(() => {
                  playerInstance.setCurrentTime(savedTime)
                  setCurrentTime(savedTime)
                  setProgress(watchProgress[lessonCompositeKey])
                  hasRestoredProgress.current = true
                  console.log('✅ Position restored successfully')
                  toast.success(`Resumed from ${Math.round(savedTime)}s`)
                }, 500)
              } else {
                console.log('⚠️ Saved time not in valid range, skipping restore')
              }
            } else {
              console.log('ℹ️ No saved progress to restore')
            }
          })
        })

        // Add more event listeners for debugging
        playerInstance.on('loadstart', () => {
          console.log('📁 LOADSTART EVENT FIRED')
        })
        
        playerInstance.on('loadeddata', () => {
          console.log('💿 LOADEDDATA EVENT FIRED')
        })
        
        playerInstance.on('canplay', () => {
          console.log('▶️ CANPLAY EVENT FIRED')
        })
        
        playerInstance.on('progress', () => {
          console.log('📊 PROGRESS EVENT FIRED (loading progress)')
        })

        playerInstance.on('play', () => {
          console.log('▶️ PLAY EVENT FIRED')
          setIsPlaying(true)
          isPlayingRef.current = true
          setAnalytics(prev => ({ ...prev, playCount: prev.playCount + 1 }))
          
          // Try to manually check timeupdate after play starts
          console.log('🧪 Starting manual timeupdate check...')
          setTimeout(() => {
            playerInstance.getCurrentTime(currentTime => {
              console.log('🕒 Manual getCurrentTime after play:', currentTime)
            })
          }, 1000)
        })

        playerInstance.on('pause', () => {
          console.log('⏸️ PAUSE EVENT FIRED')
          setIsPlaying(false)
          isPlayingRef.current = false
          setAnalytics(prev => ({ ...prev, pauseCount: prev.pauseCount + 1 }))
        })

        // Try different possible timeupdate event names
        playerInstance.on('timeupdate', (timingData) => {
          console.log('⏱️ TIMEUPDATE EVENT FIRED')
          console.log('- Raw timingData:', timingData)
          
          const currentSeconds = timingData.seconds || 0
          const totalDuration = timingData.duration || duration
          
          console.log('- Parsed currentSeconds:', currentSeconds)
          console.log('- Parsed totalDuration:', totalDuration)
          
          if (totalDuration <= 0) {
            console.log('⚠️ Invalid duration, skipping timeupdate')
            return
          }
          
          const progressPercent = (currentSeconds / totalDuration) * 100
          console.log('- Calculated progress:', progressPercent + '%')
          
          setCurrentTime(currentSeconds)
          setDuration(totalDuration)
          setProgress(progressPercent)
          
          if (lessonCompositeKey) {
            console.log('💾 Updating watch progress for key:', lessonCompositeKey)
            updateWatchProgress(lessonCompositeKey, progressPercent)
          }
          
          setAnalytics(prev => {
            const newAnalytics = { ...prev }
            
            if (progressPercent >= 50 && !prev.hasReachedMidpoint) {
              newAnalytics.hasReachedMidpoint = true
              console.log('🎯 50% milestone reached!')
              toast.success('Halfway there! 🎉')
            }
            
            if (progressPercent >= 75 && !prev.hasReached75Percent) {
              newAnalytics.hasReached75Percent = true
              console.log('🎯 75% milestone reached!')
              toast.success('Almost done! 🚀')
            }
            
            return newAnalytics
          })
        })
        
        // Try alternative event name
        playerInstance.on('time', (timingData) => {
          console.log('🕐 TIME EVENT FIRED (alternative)')
          console.log('- Raw timingData:', timingData)
        })
        
        // Try listening to all events to see what's available
        const commonEvents = ['ready', 'play', 'pause', 'ended', 'timeupdate', 'progress', 'loadstart', 'loadeddata', 'canplay', 'seeking', 'seeked', 'volumechange', 'error']
        commonEvents.forEach(eventName => {
          if (eventName !== 'timeupdate' && eventName !== 'play' && eventName !== 'pause' && eventName !== 'ready' && eventName !== 'progress' && eventName !== 'error' && eventName !== 'ended') {
            playerInstance.on(eventName, (data) => {
              console.log(`🎵 ${eventName.toUpperCase()} EVENT FIRED:`, data)
            })
          }
        })

        playerInstance.on('ended', () => {
          console.log('🏁 VIDEO ENDED EVENT FIRED')
          setIsPlaying(false)
          isPlayingRef.current = false
          if (progress >= 80) {
            console.log('✅ Progress >= 80%, marking complete')
            handleMarkComplete()
            toast.success('🎉 Video completed!')
          } else {
            console.log('⚠️ Progress < 80%, not marking complete. Current:', progress)
          }
        })

        playerInstance.on('error', (error) => {
          console.error('❌ PLAYER ERROR EVENT:', error)
          setVideoError(true)
          setIsLoading(false)
          toast.error('Video player error')
        })

        console.log('👂 All event listeners attached')
        
        // Fallback: Manual polling for timeupdate if events don't work
        console.log('🔄 Starting manual polling as fallback...')
        const pollInterval = setInterval(() => {
          if (playerInstanceRef.current && isPlayingRef.current) {
            playerInstanceRef.current.getCurrentTime(currentTime => {
              playerInstanceRef.current.getDuration(duration => {
                if (duration > 0) {
                  const progressPercent = (currentTime / duration) * 100
                  console.log('🔄 MANUAL POLL - Time:', currentTime, 'Duration:', duration, 'Progress:', progressPercent + '%')
                  
                  setCurrentTime(currentTime)
                  setDuration(duration)
                  setProgress(progressPercent)
                  
                  if (lessonCompositeKey) {
                    updateWatchProgress(lessonCompositeKey, progressPercent)
                  }
                }
              })
            })
          }
        }, 1000)
        
        // Store interval reference for cleanup
        playerInstanceRef.current.pollInterval = pollInterval

      } catch (error) {
        console.error('❌ Player initialization error:', error)
        setVideoError(true)
        setIsLoading(false)
        toast.error('Failed to initialize player')
      }
    }

    console.log('⏰ Setting timeout for player initialization (2000ms)')
    initTimeoutRef.current = setTimeout(initializePlayer, 2000)
    
    return () => {
      console.log('🧹 Cleaning up player initialization timeout')
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }
    }
  }, [hasValidVideo, lesson?.video_url])

  useEffect(() => {
    console.log('📚 Lesson change useEffect triggered')
    console.log('- lesson:', lesson?.title || 'null')
    console.log('- lesson.video_url:', lesson?.video_url)
    
    if (!lesson) {
      console.log('❌ No lesson found')
      return
    }
    
    console.log('🔄 Setting current lesson and resetting state')
    setCurrentLesson(lesson)
    setIsLoading(true)
    setVideoError(false)
    hasRestoredProgress.current = false
    isPlayingRef.current = false
    
    setProgress(0)
    setCurrentTime(0)
    setDuration(0)
    setIsPlaying(false)
    setIsPlayerReady(false)
    setAnalytics({
      playCount: 0,
      pauseCount: 0,
      totalWatchTime: 0,
      lastPlayTime: 0,
      hasReachedMidpoint: false,
      hasReached75Percent: false
    })
    
    console.log('✅ State reset completed')
  }, [lesson, setCurrentLesson])

  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up player and intervals')
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }
      if (playerInstanceRef.current?.pollInterval) {
        clearInterval(playerInstanceRef.current.pollInterval)
      }
      if (playerInstanceRef.current) {
        playerInstanceRef.current = null
      }
    }
  }, [])

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleMarkComplete = useCallback(() => {
    if (!lessonCompositeKey) return
    
    if (progress < 80) {
      toast.error('Watch at least 80% to complete')
      return
    }
    
    markLessonComplete(lessonCompositeKey)
    toast.success('Lesson completed!')
    
    console.log('Lesson completed:', {
      lessonId: lesson?.id,
      progress: progress,
      watchTime: analytics.totalWatchTime,
      playCount: analytics.playCount
    })
  }, [lessonCompositeKey, progress, markLessonComplete, lesson, analytics])

  const handleNextLesson = () => {
    if (!lesson) return
    
    const nextLesson = getNextLesson(lesson.module_id, lesson.id, currentLanguage)
    
    if (!nextLesson) return
    
    navigate(`/app/video/${nextLesson.module_id}/${nextLesson.id}`)
  }

  if (contextLoading) {
    return (
      <Container maxW="6xl">
        <Box textAlign="center" py={20}>
          <Heading color="gray.500">Loading lesson...</Heading>
        </Box>
      </Container>
    )
  }

  if (!lesson) {
    return (
      <Container maxW="6xl">
        <Box textAlign="center" py={20}>
          <Heading color="gray.500">Lesson not found</Heading>
          <Text color="gray.500" mt={2}>
            Module {moduleId}, Lesson {lessonId} in {currentLanguage}
          </Text>
          <Button mt={4} onClick={() => navigate('/app/courses')}>
            Back to Home
          </Button>
        </Box>
      </Container>
    )
  }

  const videoUrl = `https://iframe.mediadelivery.net/embed/469615/${lesson.video_url}?t=${Date.now()}`
  
  console.log('📺 Video URL generated:', videoUrl)
  console.log('🔍 Current state:', {
    hasValidVideo,
    isLoading,
    isPlayerReady,
    videoError,
    progress: Math.round(progress),
    duration: Math.round(duration),
    currentTime: Math.round(currentTime),
    isPlaying
  })

  return (
    <Container maxW="6xl">
      <VStack spacing={6} align="stretch">
        <Button
          leftIcon={<FaArrowLeft />}
          variant="outline"
          alignSelf="flex-start"
          onClick={() => navigate('/app/courses')}
        >
          Back to Courses
        </Button>

        <Box 
          bg="white"
          borderRadius="2xl"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.100"
          overflow="hidden"
        >
          {hasValidVideo && !videoError ? (
            <Box 
              position="relative" 
              w="100%" 
              paddingTop="56.25%" 
              bg="#000" 
              borderRadius="2xl" 
              overflow="hidden"
            >
              <iframe
                ref={playerRef}
                src={videoUrl}
                loading="lazy"
                allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                allowFullScreen
                style={{
                  border: 0,
                  position: 'absolute',
                  top: 0,
                  height: '100%',
                  width: '100%'
                }}
                title="BunnyCDN Video Player"
                onLoad={() => {
                  console.log('📺 Iframe onLoad event fired')
                  setIsLoading(false)
                }}
                onError={() => {
                  console.error('❌ Iframe onError event fired')
                  setVideoError(true)
                  setIsLoading(false)
                  toast.error('Failed to load video')
                }}
              />
              
              {isLoading && (
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
                  bg="rgba(0, 0, 0, 0.8)"
                >
                  <VStack spacing={3}>
                    <Box 
                      width="40px" 
                      height="40px" 
                      border="3px solid rgba(255,255,255,0.3)"
                      borderTopColor="white"
                      borderRadius="50%"
                      sx={{
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' }
                        }
                      }}
                    />
                    <Text fontSize="lg">Loading video...</Text>
                  </VStack>
                </Box>
              )}
            </Box>
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
                  {videoError ? 'Error loading video' : 'Video not available'}
                </Text>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  {videoError 
                    ? 'Please check the video URL and try again'
                    : 'This lesson does not have a video'
                  }
                </Text>
              </VStack>
            </Box>
          )}
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
                        <Text fontWeight="bold">Completed</Text>
                      </HStack>
                    </Badge>
                  )}
                  {lessonCompositeKey && watchProgress[lessonCompositeKey] > 0 && !lesson.completed && (
                    <Badge colorScheme="blue" variant="solid" fontSize="xs">
                      {Math.round(watchProgress[lessonCompositeKey])}% watched
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
                  {lesson.completed ? 'Completed' : 'Mark Complete'}
                </Button>
                
                <Button
                  rightIcon={<FaArrowRight />}
                  variant="outline"
                  onClick={handleNextLesson}
                  isDisabled={!getNextLesson(lesson.module_id, lesson.id, currentLanguage)}
                >
                  Next Lesson
                </Button>
              </HStack>
            </Flex>
            
            <Box>
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontSize="sm" color="gray.600">Watch Progress</Text>
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
                  Watch at least 80% to mark lesson as complete
                </Text>
              )}
            </Box>

            {process.env.NODE_ENV === 'development' && isPlayerReady && (
              <Box mt={4} p={3} bg="gray.50" borderRadius="md">
                <Text fontSize="xs" fontWeight="bold" mb={2}>📊 Debug Info</Text>
                <HStack spacing={4} fontSize="xs" color="gray.600">
                  <Text>Time: {formatTime(currentTime)}/{formatTime(duration)}</Text>
                  <Text>Progress: {Math.round(progress)}%</Text>
                  <Text>Playing: {isPlaying ? '▶️' : '⏸️'}</Text>
                  <Text>Ready: {isPlayerReady ? '✅' : '❌'}</Text>
                </HStack>
              </Box>
            )}
          </Box>
        </Box>
      </VStack>
    </Container>
  )
}

export default VideoPlayer