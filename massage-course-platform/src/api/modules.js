import apiClient from '../lib/api'

export const moduleApi = {
  // Get all modules (replaces getCourses in single-course system)
  getModules: async () => {
    const response = await apiClient.get('/modules')
    return response
  },

  // Get single module with its lessons
  getModule: async (moduleId) => {
    const response = await apiClient.get(`/modules/${moduleId}`)
    return response
  }
}

export default moduleApi
