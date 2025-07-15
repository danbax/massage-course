import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react'
import { Box, Icon, Text, VStack } from '@chakra-ui/react'
import { FaPlay } from 'react-icons/fa'

const GoogleDriveVideo = forwardRef((props, ref) => {
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
    controls = true,
    muted = false,
    className,
    style,
    width = '100%',
    height = '400px',
    ...restProps 
  } = props

  const videoRef = useRef(null)
  const [error, setError] = useState(null)
  const [isReady, setIsReady] = useState(false)

  // Convert Google Drive sharing URL to embeddable URL
  const getEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') return null
    
    // Handle different Google Drive URL formats
    let fileId = null
    
    // Format 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // Format 2: https://drive.google.com/file/d/FILE_ID/preview
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
    
    // Return the direct video streaming URL
    return `https://drive.google.com/file/d/${fileId}/preview`
  }

  const embedUrl = getEmbedUrl(videoUrl)

  // Expose video control methods to parent components
  useImperativeHandle(ref, () => ({
    play: () => {
      const iframe = videoRef.current
      if (iframe && iframe.contentWindow) {
        // Google Drive iframe doesn't support direct JS control
        // We'll need to rely on the iframe's built-in controls
        console.log('Play requested for Google Drive video')
      }
    },
    pause: () => {
      const iframe = videoRef.current
      if (iframe && iframe.contentWindow) {
        console.log('Pause requested for Google Drive video')
      }
    },
    get currentTime() {
      // Google Drive iframe doesn't expose currentTime
      return 0
    },
    set currentTime(time) {
      // Google Drive iframe doesn't support seeking via JS
      console.log('Seek requested to:', time)
    },
    get duration() {
      // Google Drive iframe doesn't expose duration
      return 0
    },
    get volume() {
      return 1
    },
    set volume(volume) {
      // Google Drive iframe doesn't support volume control via JS
      console.log('Volume change requested:', volume)
    },
    get paused() {
      return true // We can't detect play state from Google Drive iframe
    },
    addEventListener: (event, handler) => {
      // Google Drive iframe doesn't support custom event listeners
      console.log('Event listener requested:', event)
    },
    removeEventListener: (event, handler) => {
      console.log('Event listener removal requested:', event)
    }
  }))

  // Handle iframe load events
  const handleIframeLoad = () => {
    console.log('Google Drive video iframe loaded')
    setIsReady(true)
    setError(null)
    onLoadedMetadata?.()
    onCanPlay?.()
    onLoadedData?.()
  }

  const handleIframeError = () => {
    console.error('Google Drive video iframe failed to load')
    setError('Failed to load video from Google Drive')
    onError?.()
  }

  // Simulate time updates for progress tracking
  useEffect(() => {
    if (!isReady || !embedUrl) return

    // Since we can't get real-time updates from Google Drive iframe,
    // we'll simulate progress updates for basic tracking
    const interval = setInterval(() => {
      // Simulate time update event
      const mockEvent = {
        target: {
          currentTime: 0, // We can't get real currentTime
          duration: 0     // We can't get real duration
        }
      }
      onTimeUpdate?.(mockEvent)
    }, 1000)

    return () => clearInterval(interval)
  }, [isReady, embedUrl, onTimeUpdate])

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
            Invalid Google Drive URL: {videoUrl}
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
    <Box className={className} style={style} {...restProps}>
      <iframe
        ref={videoRef}
        src={embedUrl}
        width={width}
        height={height}
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          display: 'block'
        }}
        allow="autoplay; encrypted-media"
        allowFullScreen
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        title="Video Player"
      />
    </Box>
  )
})

GoogleDriveVideo.displayName = 'GoogleDriveVideo'

export default GoogleDriveVideo
