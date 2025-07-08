import { create } from 'zustand'
import { progressApi } from '../api/progress'
import { lessonApi } from '../api/courses'

export const useProgressStore = create((set, get) => ({
  progress: null,
  lessonProgress: {},
  analytics: null,
  watchTimes: {},
  quizScores: {},
  notes: {},
  isLoading: false,
  error: null,

  fetchProgress: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await progressApi.getProgress()
      set({ 
        progress: response.progress,
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

  fetchLessonProgress: async (lessonId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await progressApi.getLessonProgress(lessonId)
      set(state => ({ 
        lessonProgress: {
          ...state.lessonProgress,
          [lessonId]: response.progress
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

  updateLessonProgress: async (lessonId, progressData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await progressApi.updateProgress(lessonId, progressData)
      set(state => ({
        lessonProgress: {
          ...state.lessonProgress,
          [lessonId]: response.progress
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

  markLessonCompleted: async (lessonId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await lessonApi.markLessonCompleted(lessonId)
      set(state => ({
        lessonProgress: {
          ...state.lessonProgress,
          [lessonId]: { ...state.lessonProgress[lessonId], completed: true }
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

  updateLessonNotes: async (lessonId, notes) => {
    try {
      const response = await lessonApi.updateLessonNotes(lessonId, { notes })
      set(state => ({
        notes: {
          ...state.notes,
          [lessonId]: response.notes
        }
      }))
      return response
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  fetchLessonNotes: async (lessonId) => {
    try {
      const response = await lessonApi.getLessonNotes(lessonId)
      set(state => ({
        notes: {
          ...state.notes,
          [lessonId]: response.notes
        }
      }))
      return response
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  submitQuiz: async (lessonId, quizData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await lessonApi.submitQuiz(lessonId, quizData)
      set(state => ({
        quizScores: {
          ...state.quizScores,
          [lessonId]: response.score
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

  fetchAnalytics: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await progressApi.getAnalytics()
      set({ 
        analytics: response.analytics,
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

  getCompletionPercentage: () => {
    const { progress } = get()
    if (!progress?.totalLessons) return 0
    return Math.round((progress.completedLessons / progress.totalLessons) * 100)
  },

  getLessonCompletionPercentage: (lessonId) => {
    const { lessonProgress } = get()
    const progress = lessonProgress[lessonId]
    return progress?.completionPercentage || 0
  },

  clearError: () => set({ error: null }),
  
  reset: () => set({
    progress: null,
    lessonProgress: {},
    analytics: null,
    watchTimes: {},
    quizScores: {},
    notes: {},
    isLoading: false,
    error: null
  })
}))