import apiClient from '../lib/api'

export const authApi = {
  // Register new user
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData)
    return response
  },

  // Login user
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials)
    return response
  },

  // Logout user
  logout: async () => {
    const response = await apiClient.post('/auth/logout')
    return response
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/user')
    return response
  },

  // Refresh token
  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh')
    return response
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email })
    return response
  },

  // Reset password
  resetPassword: async (data) => {
    const response = await apiClient.post('/auth/reset-password', data)
    return response
  }
}

export const profileApi = {
  // Get profile
  getProfile: async () => {
    const response = await apiClient.get('/profile')
    return response
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/profile', profileData)
    return response
  },

  // Update avatar
  updateAvatar: async (avatarFile) => {
    const formData = new FormData()
    formData.append('avatar', avatarFile)
    
    const response = await apiClient.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  },

  // Delete avatar
  deleteAvatar: async () => {
    const response = await apiClient.delete('/profile/avatar')
    return response
  },

  // Update password
  updatePassword: async (passwordData) => {
    const response = await apiClient.put('/profile/password', passwordData)
    return response
  },

  // Get user statistics
  getStatistics: async () => {
    const response = await apiClient.get('/profile/statistics')
    return response
  },

  // Delete account
  deleteAccount: async (passwordData) => {
    const response = await apiClient.delete('/profile/account', passwordData)
    return response
  }
}

export const settingsApi = {
  // Get settings
  getSettings: async () => {
    const response = await apiClient.get('/settings')
    return response
  },

  // Update settings
  updateSettings: async (settingsData) => {
    const response = await apiClient.put('/settings', settingsData)
    return response
  },

  // Get notification settings
  getNotificationSettings: async () => {
    const response = await apiClient.get('/settings/notifications')
    return response
  },

  // Update notification settings
  updateNotificationSettings: async (notificationData) => {
    const response = await apiClient.put('/settings/notifications', notificationData)
    return response
  },

  // Get privacy settings
  getPrivacySettings: async () => {
    const response = await apiClient.get('/settings/privacy')
    return response
  },

  // Update privacy settings
  updatePrivacySettings: async (privacyData) => {
    const response = await apiClient.put('/settings/privacy', privacyData)
    return response
  },

  // Export user data
  exportData: async () => {
    const response = await apiClient.get('/settings/export')
    return response
  }
}