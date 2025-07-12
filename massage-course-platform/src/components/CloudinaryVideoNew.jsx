import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { Box, Icon, Text, VStack } from '@chakra-ui/react'
import { FaPlay } from 'react-icons/fa'
import { getCloudinaryVideoUrl, getCloudinaryThumbnailUrl, getCloudinaryRawVideoUrl, extractPublicIdFromUrl } from '../config/cloudinary'

const CloudinaryVideoNew = forwardRef((props, ref) => {
  const { 
    videoUrl, 
    publicId: propPublicId,
    thumbnail,
    poster,
    onLoadedMetadata,
    onTimeUpdate,
    onPlay,
    onPause,
    onEnded,
    onLoadStart,
    onCanPlay,
    onLoadedData,
    onError,
    quality = 'standard',
    autoPlay = false,
    controls = true,
    muted = false,
    loop = false,
    className,
    style,
    width = '100%',
    height = '400px',
    ...restProps 
  } = props

  const videoRef = useRef(null)
  const [error, setError] = useState(null)
  const [isReady, setIsReady] = useState(false)

  // Use prop publicId or extract from videoUrl
  const publicId = propPublicId || extractPublicIdFromUrl(videoUrl) || videoUrl

  // Generate video URL using our manual URL construction
  // Try raw URL first to avoid transformation issues
  const videoSrc = getCloudinaryRawVideoUrl(publicId) || getCloudinaryVideoUrl(publicId, quality)
  const thumbnailSrc = poster || thumbnail || getCloudinaryThumbnailUrl(publicId)

  console.log('CloudinaryVideoNew - Public ID:', publicId)
  console.log('CloudinaryVideoNew - Video URL:', videoSrc)
  console.log('CloudinaryVideoNew - Thumbnail URL:', thumbnailSrc)

  // Expose video methods to parent component
  useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
    get currentTime() {
      return videoRef.current?.currentTime || 0
    },
    set currentTime(time) {
      if (videoRef.current) {
        videoRef.current.currentTime = time
      }
    },
    get duration() {
      return videoRef.current?.duration || 0
    },
    get volume() {
      return videoRef.current?.volume || 1
    },
    set volume(volume) {
      if (videoRef.current) {
        videoRef.current.volume = volume
      }
    },
    get paused() {
      return videoRef.current?.paused ?? true
    },
    addEventListener: (event, handler) => videoRef.current?.addEventListener(event, handler),
    removeEventListener: (event, handler) => videoRef.current?.removeEventListener(event, handler)
  }))

  // Handle video events
  const handleLoadedMetadata = (e) => {
    console.log('Video loaded metadata:', {
      duration: e.target.duration,
      videoWidth: e.target.videoWidth,
      videoHeight: e.target.videoHeight,
      currentTime: e.target.currentTime
    })
    setIsReady(true)
    setError(null)
    onLoadedMetadata?.(e)
  }

  const handleError = (e) => {
    console.error('Video error:', e)
    console.error('Video error details:', {
      error: e.target.error,
      networkState: e.target.networkState,
      readyState: e.target.readyState,
      src: e.target.src
    })
    setError('Failed to load video. Please check if the video exists in Cloudinary.')
    onError?.(e)
  }

  const handlePlay = (e) => {
    console.log('Video play event:', {
      currentTime: e.target.currentTime,
      duration: e.target.duration
    })
    setError(null)
    onPlay?.(e)
  }

  const handlePause = (e) => {
    console.log('Video pause event:', {
      currentTime: e.target.currentTime,
      duration: e.target.duration
    })
    onPause?.(e)
  }

  const handleEnded = (e) => {
    console.log('Video ended event:', {
      currentTime: e.target.currentTime,
      duration: e.target.duration
    })
    onEnded?.(e)
  }

  const handleTimeUpdate = (e) => {
    // Only log occasionally to avoid spam
    if (Math.floor(e.target.currentTime) % 5 === 0) {
      console.log('Video time update:', {
        currentTime: e.target.currentTime,
        duration: e.target.duration
      })
    }
    onTimeUpdate?.(e)
  }

  const handleLoadStart = (e) => {
    onLoadStart?.(e)
  }

  const handleCanPlay = (e) => {
    setIsReady(true)
    onCanPlay?.(e)
  }

  const handleLoadedData = (e) => {
    onLoadedData?.(e)
  }

  // If no public ID can be extracted, show error
  if (!publicId) {
    return (
      <Box
        width={width}
        height={height}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.100"
        borderRadius="md"
        className={className}
        style={style}
        {...restProps}
      >
        <VStack spacing={2}>
          <Icon as={FaPlay} w={8} h={8} color="gray.400" />
          <Text fontSize="lg" fontWeight="medium" color="gray.600">
            No Video
          </Text>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            No video URL provided
          </Text>
        </VStack>
      </Box>
    )
  }

  // If video src couldn't be generated, show error
  if (!videoSrc) {
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
            Could not generate video URL
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
          <Text fontSize="sm" color="red.500" textAlign="center">
            {error}
          </Text>
        </VStack>
      </Box>
    )
  }

  return (
    <Box className={className} style={style} {...restProps}>
      <video
        ref={videoRef}
        src={videoSrc}
        poster={thumbnailSrc}
        autoPlay={autoPlay}
        controls={controls}
        muted={muted}
        loop={false}
        playsInline
        preload="metadata"
        width={width}
        height={height}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          display: 'block'
        }}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onLoadedData={handleLoadedData}
        onError={handleError}
      />
    </Box>
  )
})

CloudinaryVideoNew.displayName = 'CloudinaryVideoNew'

export default CloudinaryVideoNew
