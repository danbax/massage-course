import { useAuthStore } from './useAuthStore'
import { useAppStore } from './useAppStore'
import { useProgressStore } from './useProgressStore'
import { useUserStore } from './useUserStore'
import { useCertificateStore } from './useCertificateStore'
import { usePaymentStore } from './usePaymentStore'

export const useAuthSelectors = () => ({
  isAuthenticated: useAuthStore(state => state.isAuthenticated),
  user: useAuthStore(state => state.user),
  isLoading: useAuthStore(state => state.isLoading),
  error: useAuthStore(state => state.error),
  token: useAuthStore(state => state.token),
})

export const useAppSelectors = () => ({
  theme: useAppStore(state => state.theme),
  language: useAppStore(state => state.language),
  sidebarOpen: useAppStore(state => state.sidebarOpen),
  notifications: useAppStore(state => state.notifications),
  unreadCount: useAppStore(state => state.getUnreadNotificationsCount()),
  recentNotifications: useAppStore(state => state.getRecentNotifications()),
  isOnline: useAppStore(state => state.online),
  lastSync: useAppStore(state => state.lastSync),
})

export const useProgressSelectors = () => ({
  progress: useProgressStore(state => state.progress),
  lessonProgress: useProgressStore(state => state.lessonProgress),
  courseProgress: useProgressStore(state => state.courseProgress),
  analytics: useProgressStore(state => state.analytics),
  watchTimes: useProgressStore(state => state.watchTimes),
  quizScores: useProgressStore(state => state.quizScores),
  notes: useProgressStore(state => state.notes),
  completionPercentage: useProgressStore(state => state.getCompletionPercentage()),
  isLoading: useProgressStore(state => state.isLoading),
  error: useProgressStore(state => state.error),
})

export const useUserSelectors = () => ({
  profile: useUserStore(state => state.profile),
  settings: useUserStore(state => state.settings),
  notifications: useUserStore(state => state.notifications),
  statistics: useUserStore(state => state.statistics),
  isLoading: useUserStore(state => state.isLoading),
  error: useUserStore(state => state.error),
})

export const useCertificateSelectors = () => ({
  certificates: useCertificateStore(state => state.certificates),
  currentCertificate: useCertificateStore(state => state.currentCertificate),
  eligibility: useCertificateStore(state => state.eligibility),
  totalCertificates: useCertificateStore(state => state.getTotalCertificates()),
  isLoading: useCertificateStore(state => state.isLoading),
  error: useCertificateStore(state => state.error),
})

export const usePaymentSelectors = () => ({
  payments: usePaymentStore(state => state.payments),
  currentPayment: usePaymentStore(state => state.currentPayment),
  paymentIntent: usePaymentStore(state => state.paymentIntent),
  paymentHistory: usePaymentStore(state => state.getPaymentHistory()),
  totalSpent: usePaymentStore(state => state.getTotalSpent()),
  processing: usePaymentStore(state => state.processing),
  error: usePaymentStore(state => state.error),
})

export const useDashboardData = () => {
  const { user } = useAuthSelectors()
  const { progress, completionPercentage } = useProgressSelectors()
  const { statistics } = useUserSelectors()
  const { totalCertificates } = useCertificateSelectors()

  return {
    user,
    progress,
    completionPercentage,
    statistics,
    totalCertificates,
    isLoading: useProgressStore(state => state.isLoading) || 
               useUserStore(state => state.isLoading) ||
               useCertificateStore(state => state.isLoading)
  }
}

export const useLearningData = () => {
  const { lessonProgress, watchTimes, notes } = useProgressSelectors()
  
  return {
    lessonProgress,
    watchTimes,
    notes,
    isLoading: useProgressStore(state => state.isLoading)
  }
}

export const useProfileData = () => {
  const { profile, settings, statistics } = useUserSelectors()
  const { certificates } = useCertificateSelectors()
  const { payments, totalSpent } = usePaymentSelectors()
  
  return {
    profile,
    settings,
    statistics,
    certificates,
    payments,
    totalSpent,
    isLoading: useUserStore(state => state.isLoading) ||
               useCertificateStore(state => state.isLoading) ||
               usePaymentStore(state => state.processing)
  }
}