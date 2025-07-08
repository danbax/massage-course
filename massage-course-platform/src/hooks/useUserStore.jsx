import { create } from 'zustand'
import { profileApi, settingsApi } from '../api/auth'

export const useUserStore = create((set, get) => ({
  profile: null,
  settings: null,
  notifications: null,
  statistics: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await profileApi.getProfile()
      set({ 
        profile: response.profile,
        isLoading: false 
      })
      return response
    } catch (error) {
      set({ 
        error: error.message,
        isLoading: false 
      })
      throw error
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await profileApi.updateProfile(profileData)
      set({ 
        profile: response.profile,
        isLoading: false 
      })
      return response
    } catch (error) {
      set({ 
        error: error.message,
        isLoading: false 
      })
      throw error
    }
  },

  updatePassword: async (passwordData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await profileApi.updatePassword(passwordData)
      set({ isLoading: false })
      return response
    } catch (error) {
      set({ 
        error: error.message,
        isLoading: false 
      })
      throw error
    }
  },

  updateAvatar: async (avatarFile) => {
    set({ isLoading: true, error: null })
    try {
      const response = await profileApi.updateAvatar(avatarFile)
      set(state => ({ 
        profile: {
          ...state.profile,
          avatar_url: response.avatar_url
        },
        isLoading: false 
      }))
      return response
    } catch (error) {
      set({ 
        error: error.message,
        isLoading: false 
      })
      throw error
    }
  },

  deleteAvatar: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await profileApi.deleteAvatar()
      set(state => ({ 
        profile: {
          ...state.profile,
          avatar_url: null
        },
        isLoading: false 
      }))
      return response
    } catch (error) {
      set({ 
        error: error.message,
        isLoading: false 
      })
      throw error
    }
  },

  fetchStatistics: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await profileApi.getStatistics()
      set({ 
        statistics: response.statistics,
        isLoading: false 
      })
      return response
    } catch (error) {
      set({ 
        error: error.message,
        isLoading: false 
      })
      throw error
    }
  },

  fetchSettings: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await settingsApi.getSettings()
      set({ 
        settings: response.settings,
        isLoading: false 
      })
      return response
    } catch (error) {
      set({ 
        error: error.message,
        isLoading: false 
      })
      throw error
    }
  },

  updateSettings: async (settingsData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await settingsApi.updateSettings(settingsData)
      set({ 
        settings: response.settings,
        isLoading: false 
      })
      return response
    } catch (error) {
      set({ 
        error: error.message,
        isLoading: false 
      })
      throw error
    }
  },

  fetchNotificationSettings: async () => {
    try {
      const response = await settingsApi.getNotificationSettings()
      set({ notifications: response.notifications })
      return response
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  updateNotificationSettings: async (notificationData) => {
    try {
      const response = await settingsApi.updateNotificationSettings(notificationData)
      set({ notifications: response.notifications })
      return response
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  exportData: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await settingsApi.exportData()
      set({ isLoading: false })
      return response
    } catch (error) {
      set({ 
        error: error.message,
        isLoading: false 
      })
      throw error
    }
  },

  deleteAccount: async (password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await profileApi.deleteAccount({ password })
      set({ isLoading: false })
      return response
    } catch (error) {
      set({ 
        error: error.message,
        isLoading: false 
      })
      throw error
    }
  },

  updateProfileField: (field, value) => {
    set(state => ({
      profile: {
        ...state.profile,
        [field]: value
      }
    }))
  },

  updateSettingField: (section, field, value) => {
    set(state => ({
      settings: {
        ...state.settings,
        [section]: {
          ...state.settings[section],
          [field]: value
        }
      }
    }))
  },

  clearError: () => set({ error: null }),
  
  reset: () => set({
    profile: null,
    settings: null,
    notifications: null,
    statistics: null,
    isLoading: false,
    error: null
  })
}))