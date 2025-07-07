import apiClient from '../lib/api'

export const progressApi = {
  // Get user's overall progress
  getProgress: async () => {
    const response = await apiClient.get('/progress')
    return response
  },

  // Get analytics/statistics
  getAnalytics: async () => {
    const response = await apiClient.get('/progress/analytics')
    return response
  },

  // Get progress for a specific lesson
  getLessonProgress: async (lessonId) => {
    const response = await apiClient.get(`/progress/lesson/${lessonId}`)
    return response
  },

  // Update progress for a specific lesson
  updateProgress: async (lessonId, progressData) => {
    const response = await apiClient.post(`/progress/${lessonId}`, progressData)
    return response
  }
}

export default progressApi
