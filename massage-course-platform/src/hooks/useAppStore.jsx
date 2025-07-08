import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      language: 'en',
      sidebarOpen: true,
      notifications: [],
      loading: false,
      online: navigator.onLine,
      lastSync: null,
      
      setTheme: (theme) => set({ theme }),
      
      setLanguage: (language) => set({ language }),
      
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      addNotification: (notification) => {
        const id = Date.now().toString()
        const newNotification = {
          id,
          timestamp: new Date().toISOString(),
          read: false,
          ...notification
        }
        
        set(state => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50)
        }))
        
        return id
      },
      
      markNotificationRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        }))
      },
      
      markAllNotificationsRead: () => {
        set(state => ({
          notifications: state.notifications.map(notification =>
            ({ ...notification, read: true })
          )
        }))
      },
      
      removeNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(notification => notification.id !== id)
        }))
      },
      
      clearNotifications: () => set({ notifications: [] }),
      
      setLoading: (loading) => set({ loading }),
      
      setOnlineStatus: (online) => set({ online }),
      
      updateLastSync: () => set({ lastSync: new Date().toISOString() }),
      
      getUnreadNotificationsCount: () => {
        const { notifications } = get()
        return notifications.filter(notification => !notification.read).length
      },
      
      getRecentNotifications: (limit = 5) => {
        const { notifications } = get()
        return notifications
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, limit)
      },
      
      showToast: (message, type = 'info', duration = 3000) => {
        const id = get().addNotification({
          type: 'toast',
          message,
          level: type,
          duration
        })
        
        if (duration > 0) {
          setTimeout(() => {
            get().removeNotification(id)
          }, duration)
        }
        
        return id
      },
      
      reset: () => set({
        notifications: [],
        loading: false,
        lastSync: null
      })
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        sidebarOpen: state.sidebarOpen
      })
    }
  )
)

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useAppStore.getState().setOnlineStatus(true)
  })
  
  window.addEventListener('offline', () => {
    useAppStore.getState().setOnlineStatus(false)
  })
}