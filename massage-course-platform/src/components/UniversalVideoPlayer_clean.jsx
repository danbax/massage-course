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

  // Detect if URL is a Google Drive link
  const isGoogleDriveUrl = (url) => {
    return url && url.includes('drive.google.com')
  }

  // Convert Google Drive sharing URL to embeddable URL
  const getGoogleDriveEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') return null
    
    let fileId = null
    
    // Handle different Google Drive URL formats
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
    
    // Use simple preview URL for best compatibility
    return `https://drive.google.com/file/d/${fileId}/preview`
  }

  const isGoogleDrive = isGoogleDriveUrl(videoUrl)
  const embedUrl = isGoogleDrive ? getGoogleDriveEmbedUrl(videoUrl) : videoUrl

  // Simple video control methods
  useImperativeHandle(ref, () => ({
    play: () => {
      if (isGoogleDrive) {
        console.log('Play requested for Google Drive - user must use native controls')
      } else {
        const video = videoRef.current
        if (video?.play) {
          video.play().catch(error => console.error('Error playing video:', error))
        }
      }
    },
    pause: () => {
      if (isGoogleDrive) {
        console.log('Pause requested for Google Drive - user must use native controls')
      } else {
        const video = videoRef.current
        if (video?.pause) video.pause()
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
    addEventListener: (event, handler) => {
      if (!isGoogleDrive && videoRef.current?.addEventListener) {
        videoRef.current.addEventListener(event, handler)
      }
    },
    removeEventListener: (event, handler) => {
      if (!isGoogleDrive && videoRef.current?.removeEventListener) {
        videoRef.current.removeEventListener(event, handler)
      }
    }
  }))

  // Handle iframe load for Google Drive
  const handleIframeLoad = useCallback(() => {
    console.log('Google Drive video iframe loaded successfully')
    setIsReady(true)
    setError(null)
    
    // Set duration from props or use default
    if (duration > 0) {
      setVideoDuration(duration)
      console.log(`Setting video duration: ${duration} seconds`)
    } else {
      const defaultDuration = 600 // 10 minutes default
      setVideoDuration(defaultDuration)
      console.warn(`No duration provided, using default: ${defaultDuration} seconds`)
    }
    
    onLoadedMetadata?.()
    onCanPlay?.()
    onLoadedData?.()
  }, [duration, onLoadedMetadata, onCanPlay, onLoadedData])

  // Simple background progress tracking for Google Drive
  useEffect(() => {
    if (!isGoogleDrive || !videoDuration || !isReady) return

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = Math.min(prev + 2, videoDuration) // Increment by 2 seconds
        const progress = (newTime / videoDuration) * 100
        
        // Create timeUpdate event for parent component
        const mockEvent = {
          target: { currentTime: newTime, duration: videoDuration }
        }
        
        onTimeUpdate?.(mockEvent)
        onProgressUpdate?.(newTime, videoDuration)
        
        // Complete at 80% to be conservative
        if (progress >= 80) {
          console.log('Google Drive video completed at 80%')
          onEnded?.(mockEvent)
          clearInterval(interval)
          return videoDuration * 0.8 // Cap at 80%
        }
        
        return newTime
      })
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [isGoogleDrive, videoDuration, isReady, onTimeUpdate, onProgressUpdate, onEnded])

  // Handle native video events
  const handleLoadedMetadata = useCallback((e) => {
    console.log('Video loaded metadata:', e.target.duration)
    setVideoDuration(e.target.duration)
    setIsReady(true)
    setError(null)
    onLoadedMetadata?.(e)
  }, [onLoadedMetadata])

  const handleTimeUpdate = useCallback((e) => {
    setCurrentTime(e.target.currentTime)
    onTimeUpdate?.(e)
  }, [onTimeUpdate])

  const handleError = useCallback((e) => {
    console.error('Video error:', e)
    setError('Failed to load video')
    setIsReady(false)
    onError?.(e)
  }, [onError])

  const handleIframeError = useCallback(() => {
    console.error('Google Drive video iframe failed to load')
    setError('Failed to load Google Drive video. Please check that the video is publicly accessible.')
    onError?.()
  }, [onError])

  // Update progress when currentProgress prop changes
  useEffect(() => {
    if (currentProgress > 0 && videoDuration > 0) {
      const time = (currentProgress / 100) * videoDuration
      setCurrentTime(time)
    }
  }, [currentProgress, videoDuration])

  // If no valid URL, show error
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
          <Text fontSize="lg" fontWeight="medium" color="red.600">
            Video Error
          </Text>
          <Text fontSize="sm" color="red.500" textAlign="center">
            {isGoogleDrive 
              ? "Google Drive videos must be publicly accessible and shareable. Please check sharing settings."
              : `Invalid video URL: ${videoUrl}`
            }
          </Text>
        </VStack>
      </Box>
    )
  }

  // Show error state if video failed to load
  if (error) {
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
          <Icon as={FaPlay} w={8} h={8} color="red.600" />
          <Text fontSize="lg" fontWeight="medium" color="red.600">
            Video Error
          </Text>
          <Text fontSize="sm" color="red.500" textAlign="center" px={4}>
            {error}
          </Text>
        </VStack>
      </Box>
    )
  }

  return (
    <Box 
      ref={containerRef}
      className={className} 
      style={style} 
      position="relative"
      width="100%"
      height={isGoogleDrive ? "auto" : height}
      minHeight={isGoogleDrive ? "400px" : undefined}
      aspectRatio={isGoogleDrive ? "16/9" : undefined}
      bg="black"
      borderRadius="md"
      overflow="hidden"
      {...restProps}
    >
      {isGoogleDrive ? (
        // Pure Google Drive iframe - absolutely NO custom controls or overlays
        <iframe
          ref={videoRef}
          src={embedUrl}
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none',
            display: 'block'
          }}
          allow="autoplay; encrypted-media; fullscreen; accelerometer; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          title="Google Drive Video Player"
          frameBorder="0"
          scrolling="no"
        />
      ) : (
        // Regular video files with standard HTML5 video element
        <video
          ref={videoRef}
          src={embedUrl}
          width={width}
          height={height}
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
          onLoadStart={onLoadStart}
          onCanPlay={onCanPlay}
          onLoadedData={onLoadedData}
          onError={handleError}
        />
      )}
    </Box>
  )
})

UniversalVideoPlayer.displayName = 'UniversalVideoPlayer'

export default UniversalVideoPlayer
