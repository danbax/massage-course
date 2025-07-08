import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi, profileApi } from '../api/auth'
import { courseApi, lessonApi } from '../api/courses'
import { progressApi } from '../api/progress'
import { certificateApi, paymentApi } from '../api/services'
import { settingsApi } from '../api/settings'
import toast from 'react-hot-toast'

// Query Keys
export const queryKeys = {
  auth: {
    user: ['auth', 'user'],
    profile: ['auth', 'profile']
  },
  courses: {
    all: ['courses'],
    featured: ['courses', 'featured'],
    enrolled: ['courses', 'enrolled'],
    byId: (id) => ['courses', id],
    search: (query, filters) => ['courses', 'search', query, filters],
    statistics: (id) => ['courses', id, 'statistics']
  },
  lessons: {
    byId: (id) => ['lessons', id],
    notes: (id) => ['lessons', id, 'notes']
  },
  progress: {
    overall: ['progress'],
    analytics: ['progress', 'analytics'],
    course: (id) => ['progress', 'course', id],
    lesson: (id) => ['progress', 'lesson', id]
  },
  certificates: {
    all: ['certificates'],
    byId: (id) => ['certificates', id]
  },
  payments: {
    all: ['payments'],
    byId: (id) => ['payments', id]
  },
  settings: {
    general: ['settings'],
    notifications: ['settings', 'notifications']
  }
}

// Auth Hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: authApi.getCurrentUser,
    retry: false
  })
}

export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: profileApi.getProfile
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile })
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user })
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile')
    }
  })
}

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: profileApi.updatePassword,
    onSuccess: () => {
      toast.success('Password updated successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update password')
    }
  })
}

// Course Hooks
export const useCourses = (params = {}) => {
  return useQuery({
    queryKey: [...queryKeys.courses.all, params],
    queryFn: () => courseApi.getCourses(params)
  })
}

export const useFeaturedCourses = () => {
  return useQuery({
    queryKey: queryKeys.courses.featured,
    queryFn: courseApi.getFeaturedCourses
  })
}

export const useEnrolledCourses = () => {
  return useQuery({
    queryKey: queryKeys.courses.enrolled,
    queryFn: courseApi.getEnrolledCourses
  })
}

export const useCourse = (courseId) => {
  return useQuery({
    queryKey: queryKeys.courses.byId(courseId),
    queryFn: () => courseApi.getCourse(courseId),
    enabled: !!courseId
  })
}

export const useSearchCourses = (query, filters = {}) => {
  return useQuery({
    queryKey: queryKeys.courses.search(query, filters),
    queryFn: () => courseApi.searchCourses(query, filters),
    enabled: !!query
  })
}

export const useEnrollInCourse = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: courseApi.enrollInCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.enrolled })
      toast.success('Successfully enrolled in course!')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to enroll in course')
    }
  })
}

// Lesson Hooks
export const useLesson = (lessonId) => {
  return useQuery({
    queryKey: queryKeys.lessons.byId(lessonId),
    queryFn: () => lessonApi.getLesson(lessonId),
    enabled: !!lessonId
  })
}

export const useUpdateLessonProgress = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ lessonId, progress }) => lessonApi.updateLessonProgress(lessonId, progress),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons.byId(variables.lessonId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.lesson(variables.lessonId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.overall })
    }
  })
}

export const useMarkLessonCompleted = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: lessonApi.markLessonCompleted,
    onSuccess: (_, lessonId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons.byId(lessonId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.lesson(lessonId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.overall })
      toast.success('Lesson completed!')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to mark lesson as completed')
    }
  })
}

export const useLessonNotes = (lessonId) => {
  return useQuery({
    queryKey: queryKeys.lessons.notes(lessonId),
    queryFn: () => lessonApi.getLessonNotes(lessonId),
    enabled: !!lessonId
  })
}

export const useUpdateLessonNotes = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ lessonId, notes }) => lessonApi.updateLessonNotes(lessonId, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons.notes(variables.lessonId) })
      toast.success('Notes saved')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save notes')
    }
  })
}

// Progress Hooks
export const useProgress = () => {
  return useQuery({
    queryKey: queryKeys.progress.overall,
    queryFn: progressApi.getProgress
  })
}

export const useProgressAnalytics = () => {
  return useQuery({
    queryKey: queryKeys.progress.analytics,
    queryFn: progressApi.getProgressAnalytics
  })
}

export const useCourseProgress = (courseId) => {
  return useQuery({
    queryKey: queryKeys.progress.course(courseId),
    queryFn: () => progressApi.getCourseProgress(courseId),
    enabled: !!courseId
  })
}

// Modules Hooks
export const useModules = () => {
  return useQuery({
    queryKey: ['modules'],
    queryFn: () => courseApi.getModules()
  })
}

export const useModule = (moduleId) => {
  return useQuery({
    queryKey: ['modules', moduleId],
    queryFn: () => courseApi.getModule(moduleId),
    enabled: !!moduleId
  })
}

// Progress Overview Hooks
export const useProgressOverview = () => {
  return useQuery({
    queryKey: queryKeys.progress.overall,
    queryFn: progressApi.getOverallProgress
  })
}

export const useProgressCourse = () => {
  return useQuery({
    queryKey: queryKeys.progress.course('main'),
    queryFn: progressApi.getCourseProgress
  })
}

// Certificate Hooks
export const useCertificates = () => {
  return useQuery({
    queryKey: queryKeys.certificates.all,
    queryFn: certificateApi.getCertificates
  })
}

export const useCertificate = (certificateId) => {
  return useQuery({
    queryKey: queryKeys.certificates.byId(certificateId),
    queryFn: () => certificateApi.getCertificate(certificateId),
    enabled: !!certificateId
  })
}

export const useGenerateCertificate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: certificateApi.generateCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certificates.all })
      toast.success('Certificate generated successfully!')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate certificate')
    }
  })
}

// Payment Hooks
export const usePayments = () => {
  return useQuery({
    queryKey: queryKeys.payments.all,
    queryFn: paymentApi.getPayments
  })
}

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: paymentApi.createPaymentIntent,
    onError: (error) => {
      toast.error(error.message || 'Failed to create payment intent')
    }
  })
}

export const useConfirmPayment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: paymentApi.confirmPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.enrolled })
      toast.success('Payment confirmed successfully!')
    },
    onError: (error) => {
      toast.error(error.message || 'Payment failed')
    }
  })
}

// Settings Hooks
export const useSettings = () => {
  return useQuery({
    queryKey: queryKeys.settings.general,
    queryFn: settingsApi.getSettings
  })
}

export const useUpdateSettings = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: settingsApi.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.general })
      toast.success('Settings updated successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update settings')
    }
  })
}

export const useNotificationSettings = () => {
  return useQuery({
    queryKey: queryKeys.settings.notifications,
    queryFn: settingsApi.getNotifications
  })
}

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: settingsApi.updateNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.notifications })
      toast.success('Notification preferences updated')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update notification settings')
    }
  })
}
