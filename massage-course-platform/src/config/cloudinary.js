import { Cloudinary } from '@cloudinary/url-gen'

// Cloudinary configuration
export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'dwd3arivm' // Your cloud name
  }
})

// Configuration constants
export const CLOUDINARY_CONFIG = {
  cloudName: 'dwd3arivm',
  apiKey: '883367577424919',
  // Note: API secret should never be exposed in frontend code
  // It's only used for server-side operations
}

// Video transformation presets
export const VIDEO_TRANSFORMATIONS = {
  // Standard quality for most users
  standard: {
    quality: 'auto:good',
    format: 'auto',
    width: 1280,
    height: 720
  },
  // High quality for premium experience
  high: {
    quality: 'auto:best',
    format: 'auto',
    width: 1920,
    height: 1080
  },
  // Mobile optimized
  mobile: {
    quality: 'auto:eco',
    format: 'auto',
    width: 854,
    height: 480
  },
  // Thumbnail for previews
  thumbnail: {
    quality: 'auto:low',
    format: 'jpg',
    width: 400,
    height: 250
  }
}

// Helper function to get video URL with transformations
export const getCloudinaryVideoUrl = (publicId, transformation = 'standard') => {
  if (!publicId) return null
  
  // Clean the public ID - remove any file extensions and normalize
  const cleanPublicId = publicId
    .replace(/\.(mp4|mov|avi|mkv|webm)$/i, '')
    .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
  
  console.log('Creating video URL for public ID:', cleanPublicId)
  
  const config = VIDEO_TRANSFORMATIONS[transformation] || VIDEO_TRANSFORMATIONS.standard
  
  // Construct URL manually to avoid SDK issues
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/video/upload`
  
  // Simplified transformations without duration limits
  const transformations = `w_${config.width},h_${config.height},c_scale,q_${config.quality},f_auto`
  const videoUrl = `${baseUrl}/${transformations}/${cleanPublicId}`
  
  console.log('Generated video URL:', videoUrl)
  return videoUrl
}

// Helper function to get raw video URL without transformations (for testing)
export const getCloudinaryRawVideoUrl = (publicId) => {
  if (!publicId) return null
  
  // Clean the public ID - remove any file extensions and normalize
  const cleanPublicId = publicId
    .replace(/\.(mp4|mov|avi|mkv|webm)$/i, '')
    .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
  
  console.log('Creating raw video URL for public ID:', cleanPublicId)
  
  // Construct URL without any transformations
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/video/upload`
  const videoUrl = `${baseUrl}/${cleanPublicId}.mp4`
  
  console.log('Generated raw video URL:', videoUrl)
  return videoUrl
}

// Helper function to get thumbnail URL
export const getCloudinaryThumbnailUrl = (publicId) => {
  if (!publicId) return null
  
  // Clean the public ID - remove any file extensions and normalize
  const cleanPublicId = publicId
    .replace(/\.(mp4|mov|avi|mkv|webm)$/i, '')
    .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
  
  console.log('Creating thumbnail URL for public ID:', cleanPublicId)
  
  const config = VIDEO_TRANSFORMATIONS.thumbnail
  
  // Construct URL manually to avoid SDK issues
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/video/upload`
  const transformations = `w_${config.width},h_${config.height},c_fill,q_auto:low,f_jpg`
  const thumbnailUrl = `${baseUrl}/${transformations}/${cleanPublicId}`
  
  console.log('Generated thumbnail URL:', thumbnailUrl)
  return thumbnailUrl
}

// Helper function to extract public ID from Cloudinary URL
export const extractPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null
  
  // Handle various Cloudinary URL formats
  const patterns = [
    // Standard video URL: https://res.cloudinary.com/cloudname/video/upload/v1234567890/folder/video_name.mp4
    /\/video\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]*)?$/,
    // Raw URL: https://res.cloudinary.com/cloudname/raw/upload/v1234567890/folder/video_name.mp4
    /\/raw\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]*)?$/,
    // Auto URL: https://res.cloudinary.com/cloudname/image/upload/v1234567890/folder/video_name.mp4
    /\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]*)?$/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }
  
  // If no pattern matches, assume it's already a public ID
  return url.replace(/\.[^.]*$/, '') // Remove file extension if present
}

export default cloudinary
