import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react'
import { Box, Icon, Text, VStack } from '@chakra-ui/react'
import { FaPlay } from 'react-icons/fa'

const UniversalVideoPlayer = forwardRef((props, ref) => {
  const {
    videoUrl,
    onLoadedMetadata,
    onTimeUpdate,
    onPlay,
    onPause,
    onEnded,
    onLoadStart,
    onCanPlay,
    onLoadedData,
    onError,
    autoPlay = false,
    controls = false,
    muted = false,
    className,
    style,
    width = '100%',
    height = '400px',
    currentProgress = 0,
    duration = 0,
    onProgressUpdate,
    onPlayStateChange,
    ...restProps
  } = props

  const videoRef = useRef(null)
  const containerRef = useRef(null)

  const [error, setError] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(duration || 0)
  const [isLoading, setIsLoading] = useState(true)

  // Detect if URL is a Google Drive link
  const isGoogleDriveUrl = (url) => {
    return url && url.includes('drive.google.com')
  }

  const isGoogleDrive = isGoogleDriveUrl(videoUrl)

  // Set loading state based on video type
  useEffect(() => {
    setIsLoading(true)
    setError(null)
    setIsReady(false)
  }, [videoUrl, isGoogleDrive])

  // Convert Google Drive sharing URL to embed URL
  const getGoogleDriveEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') return null

    let fileId = null
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)\/view/,
      /\/file\/d\/([a-zA-Z0-9_-]+)\/preview/,
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        fileId = match[1]
        break
      }
    }

    if (!fileId) {
      console.error('Could not extract file ID from Google Drive URL:', url)
      return null
    }

    // Always use iframe preview URL - it works better than direct download
    return `https://drive.google.com/file/d/${fileId}/preview`
  }

  const embedUrl = isGoogleDrive ? getGoogleDriveEmbedUrl(videoUrl) : videoUrl

  // Video control methods
  useImperativeHandle(ref, () => ({
    play: () => {
      if (isGoogleDrive) {
        console.log('Play requested for Google Drive - user must use native controls')
      } else {
        const video = videoRef.current
        if (video && video.play) {
          video.play().catch(error => console.error('Error playing video:', error))
        }
      }
    },
    pause: () => {
      if (isGoogleDrive) {
        console.log('Pause requested for Google Drive - user must use native controls')
      } else {
        const video = videoRef.current
        if (video && video.pause) video.pause()
      }
    },
    get currentTime() {
      return isGoogleDrive ? currentTime : (videoRef.current?.currentTime || 0)
    },
    set currentTime(time) {
      if (isGoogleDrive) {
        console.log('Seek requested for Google Drive - user must use native controls')
      } else {
        const video = videoRef.current
        if (video) video.currentTime = time
      }
    },
    get duration() {
      return isGoogleDrive ? videoDuration : (videoRef.current?.duration || 0)
    },
    get paused() {
      return isGoogleDrive ? false : (videoRef.current?.paused ?? true)
    },
    get volume() {
      return isGoogleDrive ? 1 : (videoRef.current?.volume || 1)
    },
    set volume(vol) {
      if (!isGoogleDrive && videoRef.current) {
        videoRef.current.volume = vol
      }
    },
    addEventListener: (event, handler) => {
      if (!isGoogleDrive && videoRef.current && videoRef.current.addEventListener) {
        videoRef.current.addEventListener(event, handler)
      }
    },
    removeEventListener: (event, handler) => {
      if (!isGoogleDrive && videoRef.current && videoRef.current.removeEventListener) {
        videoRef.current.removeEventListener(event, handler)
      }
    }
  }))

  // Handle iframe load for Google Drive
  const handleIframeLoad = useCallback(() => {
    console.log('Google Drive video iframe loaded successfully')
    setIsReady(true)
    setError(null)
    setIsLoading(false)

    if (duration > 0) {
      setVideoDuration(duration)
      console.log('Setting video duration:', duration, 'seconds')
    } else {
      const defaultDuration = 600 // 10 minutes default
      setVideoDuration(defaultDuration)
      console.warn('No duration provided, using default:', defaultDuration, 'seconds')
    }

    if (onLoadedMetadata) onLoadedMetadata()
    if (onCanPlay) onCanPlay()
    if (onLoadedData) onLoadedData()
  }, [duration, onLoadedMetadata, onCanPlay, onLoadedData])

  // Simple background progress tracking for Google Drive iframe only
  useEffect(() => {
    if (!isGoogleDrive || !videoDuration || !isReady) return

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = Math.min(prev + 2, videoDuration)
        const progress = (newTime / videoDuration) * 100

        const mockEvent = {
          target: { currentTime: newTime, duration: videoDuration }
        }

        if (onTimeUpdate) onTimeUpdate(mockEvent)
        if (onProgressUpdate) onProgressUpdate(newTime, videoDuration)

        if (progress >= 80) {
          console.log('Google Drive video completed at 80%')
          if (onEnded) onEnded(mockEvent)
          clearInterval(interval)
          return videoDuration * 0.8
        }

        return newTime
      })
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [isGoogleDrive, videoDuration, isReady, onTimeUpdate, onProgressUpdate, onEnded])

  // Handle native video events
  const handleLoadedMetadata = useCallback((e) => {
    setVideoDuration(e.target.duration)
    setIsReady(true)
    setError(null)
    setIsLoading(false)
    if (onLoadedMetadata) onLoadedMetadata(e)
  }, [onLoadedMetadata])

  const handleTimeUpdate = useCallback((e) => {
    setCurrentTime(e.target.currentTime)
    if (onTimeUpdate) onTimeUpdate(e)
  }, [onTimeUpdate])

  const handlePlay = useCallback((e) => {
    if (onPlay) onPlay(e)
    if (onPlayStateChange) onPlayStateChange(true)
  }, [onPlay, onPlayStateChange])

  const handlePause = useCallback((e) => {
    if (onPause) onPause(e)
    if (onPlayStateChange) onPlayStateChange(false)
  }, [onPause, onPlayStateChange])

  const handleEnded = useCallback((e) => {
    if (onEnded) onEnded(e)
    if (onPlayStateChange) onPlayStateChange(false)
  }, [onEnded, onPlayStateChange])

  const handleError = useCallback((e) => {
    setError('Failed to load video')
    setIsReady(false)
    setIsLoading(false)
    if (onError) onError(e)
  }, [onError])

  const handleIframeError = useCallback(() => {
    console.log('Google Drive iframe failed to load')
    setError('Unable to load Google Drive video. This may be due to sharing restrictions or network issues.')
    setIsLoading(false)
    if (onError) onError()
  }, [onError])

  // Handle CSP and other iframe errors
  useEffect(() => {
    if (!isGoogleDrive) return

    // Set a timeout to detect if video never loads (often due to CSP)
    const timeoutId = setTimeout(() => {
      if (!isReady && !error) {
        console.log('Google Drive iframe timeout - likely CSP blocked')
        setError('csp_blocked')
        setIsLoading(false)
      }
    }, 4000) // Increased timeout for slower connections

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isGoogleDrive, isReady, error])


  // Update progress when currentProgress prop changes
  useEffect(() => {
    if (currentProgress > 0 && videoDuration > 0) {
      const time = (currentProgress / 100) * videoDuration
      setCurrentTime(time)
    }
  }, [currentProgress, videoDuration])

  if (!embedUrl) {
    return (
      <Box
        width={width}
        height={height}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="red.50"
        borderRadius="md"
        className={className}
        style={style}
        {...restProps}
      >
        <VStack spacing={2}>
          <Icon as={FaPlay} w={8} h={8} color="red.400" />
          <Text fontSize="lg" fontWeight="medium" color="red.600">Video Error</Text>
          <Text fontSize="sm" color="red.500" textAlign="center">
            {isGoogleDrive ? "Google Drive videos must be publicly accessible and shareable. Ensure the video has 'Anyone with the link can view' permissions." : `Invalid video URL: ${videoUrl}`}
          </Text>
        </VStack>
      </Box>
    )
  }

  if (error) {
    // Special handling for CSP blocked Google Drive videos
    if (error === 'csp_blocked' && isGoogleDrive) {
      return (
        <Box
          width={width}
          height={height}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="blue.50"
          borderRadius="md"
          className={className}
          style={style}
          {...restProps}
        >
          <VStack spacing={4} textAlign="center" px={6}>
            <Icon as={FaPlay} w={12} h={12} color="blue.500" />
            <VStack spacing={2}>
              <Text fontSize="lg" fontWeight="bold" color="blue.700">
                Google Drive Video
              </Text>
              <Text fontSize="sm" color="blue.600" maxW="400px">
                This video is hosted on Google Drive and cannot be embedded directly.
                Click the button below to watch it in a new tab.
              </Text>
            </VStack>
            <Box
              as="a"
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              bg="blue.500"
              color="white"
              px={6}
              py={3}
              borderRadius="lg"
              fontWeight="medium"
              textDecoration="none"
              _hover={{ bg: "blue.600", transform: "translateY(-1px)" }}
              transition="all 0.2s"
              display="inline-flex"
              alignItems="center"
              gap={2}
            >
              <Icon as={FaPlay} w={4} h={4} />
              Watch Video
            </Box>
            <Text fontSize="xs" color="blue.500">
              Video will open in Google Drive
            </Text>
          </VStack>
        </Box>
      )
    }

    // Regular error state
    return (
      <Box
        width={width}
        height={height}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="red.50"
        borderRadius="md"
        className={className}
        style={style}
        {...restProps}
      >
        <VStack spacing={2}>
          <Icon as={FaPlay} w={8} h={8} color="red.400" />
          <Text fontSize="lg" fontWeight="medium" color="red.600">Video Error</Text>
          <Text fontSize="sm" color="red.500" textAlign="center">{error}</Text>
        </VStack>
      </Box>
    )
  }

  // Corrected main return statement for the video player
  return (
    <Box
      ref={containerRef}
      position="relative"
      width={width}
      height={height}
      bg="black"
      borderRadius="md"
      overflow="hidden"
      className={className}
      style={style}
      {...restProps}
    >
      {/* Loading overlay */}
      {isLoading && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.8)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={10}
          color="white"
        >
          <VStack spacing={3}>
            <Box
              w={8}
              h={8}
              border="2px solid"
              borderColor="white"
              borderTopColor="transparent"
              borderRadius="full"
              css={{
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
                animation: 'spin 1s linear infinite',
              }}
            />
            <Text fontSize="sm">Loading video...</Text>
          </VStack>
        </Box>
      )}

      {/* Ternary to switch between iframe and video */}
      {isGoogleDrive ? (
        <iframe
          ref={videoRef}
          src={embedUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: isReady ? 'block' : 'none', // Hide iframe until it's likely ready
          }}
          allow="autoplay; encrypted-media; fullscreen; accelerometer; gyroscope; picture-in-picture"
          allowFullScreen
          title="Google Drive Video Player"
          frameBorder="0"
          scrolling="no"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      ) : (
        <video
          ref={videoRef}
          src={embedUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block'
          }}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onLoadStart={(e) => {
            setIsLoading(true)
            if (onLoadStart) onLoadStart(e)
          }}
          onCanPlay={(e) => {
            setIsLoading(false)
            if (onCanPlay) onCanPlay(e)
          }}
          onLoadedData={(e) => {
            setIsLoading(false)
            if (onLoadedData) onLoadedData(e)
          }}
          onError={handleError}
          preload="metadata"
          playsInline
          controlsList="nodownload"
        />
      )}
    </Box>
  )
})

UniversalVideoPlayer.displayName = 'UniversalVideoPlayer'

export default UniversalVideoPlayer