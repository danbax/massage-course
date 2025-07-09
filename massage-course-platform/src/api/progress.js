import apiClient from '../lib/api'

export const progressApi = {
  // Get overall progress
  getOverallProgress: async () => {
    const response = await apiClient.get('/progress')
    return response
  },

  // Get progress analytics
  getProgressAnalytics: async () => {
    const response = await apiClient.get('/progress/analytics')
    return response
  },

  // Get course progress (for the main course)
  getCourseProgress: async () => {
    const response = await apiClient.get('/progress/course')
    return response
  },

  // Get lesson progress
  getLessonProgress: async (lessonId) => {
    const response = await apiClient.get(`/progress/lesson/${lessonId}`)
    return response
  },

  // Update lesson progress
  updateLessonProgress: async (lessonId, progressData) => {
    const response = await apiClient.put(`/lessons/${lessonId}/progress`, progressData)
    return response
  },

  // Mark lesson as completed
  markLessonCompleted: async (lessonId) => {
    const response = await apiClient.post(`/lessons/${lessonId}/complete`)
    return response
  },

  // Reset progress
  resetProgress: async () => {
    const response = await apiClient.post('/progress/reset')
    return response
  }
}