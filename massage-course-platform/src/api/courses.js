import apiClient from '../lib/api'

export const courseApi = {
  // Get all modules
  getModules: async () => {
    const response = await apiClient.get('/modules')
    return response
  },

  // Get specific module
  getModule: async (moduleId) => {
    const response = await apiClient.get(`/modules/${moduleId}`)
    return response
  }
}

export const lessonApi = {
  // Get specific lesson
  getLesson: async (lessonId) => {
    const response = await apiClient.get(`/lessons/${lessonId}`)
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

  // Submit quiz
  submitQuiz: async (lessonId, quizData) => {
    const response = await apiClient.post(`/lessons/${lessonId}/quiz`, quizData)
    return response
  },

  // Get lesson notes
  getLessonNotes: async (lessonId) => {
    const response = await apiClient.get(`/lessons/${lessonId}/notes`)
    return response
  },

  // Update lesson notes
  updateLessonNotes: async (lessonId, notesData) => {
    const response = await apiClient.put(`/lessons/${lessonId}/notes`, notesData)
    return response
  }
}