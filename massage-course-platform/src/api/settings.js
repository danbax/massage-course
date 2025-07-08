import apiClient from '../lib/api'

export const settingsApi = {
  // Get user settings
  getSettings: async () => {
    const response = await apiClient.get('/settings')
    return response
  },

  // Update user settings
  updateSettings: async (data) => {
    const response = await apiClient.put('/settings', data)
    return response
  },

  // Get notification settings
  getNotifications: async () => {
    const response = await apiClient.get('/settings/notifications')
    return response
  },

  // Update notification settings
  updateNotifications: async (data) => {
    const response = await apiClient.put('/settings/notifications', data)
    return response
  },

  // Get privacy settings
  getPrivacy: async () => {
    const response = await apiClient.get('/settings/privacy')
    return response
  },

  // Update privacy settings
  updatePrivacy: async (data) => {
    const response = await apiClient.put('/settings/privacy', data)
    return response
  },

  // Export user data
  exportData: async () => {
    const response = await apiClient.get('/settings/export', {
      responseType: 'blob'
    })
    return response
  }
}
