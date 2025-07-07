import apiClient from '../lib/api'

export const courseApi = {
  // Get all courses
  getCourses: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/courses?${queryString}` : '/courses'
    const response = await apiClient.get(endpoint)
    return response
  },

  // Get featured courses
  getFeaturedCourses: async () => {
    const response = await apiClient.get('/courses/featured')
    return response
  },

  // Search courses
  searchCourses: async (query, filters = {}) => {
    const params = { q: query, ...filters }
    const queryString = new URLSearchParams(params).toString()
    const response = await apiClient.get(`/courses/search?${queryString}`)
    return response
  },

  // Get single course
  getCourse: async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}`)
    return response
  },

  // Get enrolled courses (requires authentication)
  getEnrolledCourses: async () => {
    const response = await apiClient.get('/courses/enrolled')
    return response
  },

  // Enroll in course (requires authentication)
  enrollInCourse: async (courseId) => {
    const response = await apiClient.post(`/courses/${courseId}/enroll`)
    return response
  },

  // Get course statistics (requires authentication)
  getCourseStatistics: async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}/statistics`)
    return response
  }
}

export const lessonApi = {
  // Get lesson details (requires authentication)
  getLesson: async (lessonId) => {
    const response = await apiClient.get(`/lessons/${lessonId}`)
    return response
  },

  // Update lesson progress (requires authentication)
  updateLessonProgress: async (lessonId, progress) => {
    const response = await apiClient.put(`/lessons/${lessonId}/progress`, { progress })
    return response
  },

  // Mark lesson as completed (requires authentication)
  markLessonCompleted: async (lessonId) => {
    const response = await apiClient.post(`/lessons/${lessonId}/complete`)
    return response
  },

  // Submit quiz (requires authentication)
  submitQuiz: async (lessonId, answers) => {
    const response = await apiClient.post(`/lessons/${lessonId}/quiz`, { answers })
    return response
  },

  // Get lesson notes (requires authentication)
  getLessonNotes: async (lessonId) => {
    const response = await apiClient.get(`/lessons/${lessonId}/notes`)
    return response
  },

  // Update lesson notes (requires authentication)
  updateLessonNotes: async (lessonId, notes) => {
    const response = await apiClient.put(`/lessons/${lessonId}/notes`, { notes })
    return response
  }
}

export const progressApi = {
  // Get overall progress (requires authentication)
  getProgress: async () => {
    const response = await apiClient.get('/progress')
    return response
  },

  // Get progress analytics (requires authentication)
  getProgressAnalytics: async () => {
    const response = await apiClient.get('/progress/analytics')
    return response
  },

  // Get course progress (requires authentication)
  getCourseProgress: async (courseId) => {
    const response = await apiClient.get(`/progress/course/${courseId}`)
    return response
  },

  // Get lesson progress (requires authentication)
  getLessonProgress: async (lessonId) => {
    const response = await apiClient.get(`/progress/lesson/${lessonId}`)
    return response
  }
}
