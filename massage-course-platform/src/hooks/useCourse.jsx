import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { courseData } from '../data/courseData.jsx'
import { progressApi } from '../api/progress'
import { throttle } from '../utils/throttle'
import toast from 'react-hot-toast'

const CourseContext = createContext()

export const CourseProvider = ({ children }) => {
  const [lessons, setLessons] = useState(courseData.lessons)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [watchProgress, setWatchProgress] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [courseProgress, setCourseProgress] = useState(null) // Store backend course progress data

  // Load progress from server on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await progressApi.getCourseProgress()
        
        // Store the course progress data from backend
        if (data?.course_progress) {
          setCourseProgress(data.course_progress)
        }
        
        if (data?.modules) {
          // Create a map of lesson ID to progress for easier lookup
          const progressMap = {}
          data.modules.forEach(module => {
            if (module.lessons) {
              module.lessons.forEach(serverLesson => {
                if (serverLesson.progress) {
                  progressMap[serverLesson.id] = serverLesson.progress
                }
              })
            }
          })
          
          // Update lessons with server progress
          const updatedLessons = courseData.lessons.map(lesson => {
            const progressData = progressMap[lesson.id]
            if (progressData) {
              return {
                ...lesson,
                completed: progressData.is_completed || false
              }
            }
            return lesson
          })
          
          setLessons(updatedLessons)
          
          // Update watch progress
          const watchProgressData = {}
          Object.keys(progressMap).forEach(lessonId => {
            const progress = progressMap[lessonId]
            watchProgressData[lessonId] = parseFloat(progress.watch_percentage) || 0
          })
          
          setWatchProgress(watchProgressData)
        } else {
        }
      } catch (error) {
        console.error('Failed to load progress from server:', error)
        // Continue with local data if server fails
      } finally {
        setIsLoading(false)
      }
    }

    loadProgress()
  }, []) // Empty dependency array - only run on mount

  // Create throttled function once using useMemo to prevent recreation
  const saveProgressToServer = useCallback(
    async (lessonId, progress, duration) => {
      try {
        const progressData = {
          watch_percentage: progress,
          watch_time_seconds: Math.floor((progress / 100) * (duration || 0))
        }
        
        await progressApi.updateLessonProgress(lessonId, progressData)
      } catch (error) {
        console.error('Failed to update watch progress:', error)
      }
    },
    []
  )

  // Create throttled version using useMemo to ensure it's only created once
  const throttledSaveProgress = useMemo(
    () => throttle(saveProgressToServer, 5000),
    [saveProgressToServer]
  )

  const markLessonComplete = async (lessonId) => {
    try {
      // Update local state immediately for better UX
      setLessons(prev => prev.map(lesson => 
        lesson.id === lessonId 
          ? { ...lesson, completed: true, current: false }
          : lesson.id === lessonId + 1
          ? { ...lesson, current: true }
          : lesson
      ))
      
      // Save to server
      await progressApi.markLessonCompleted(lessonId)
      
      // Refresh progress data to get updated state from server
      setTimeout(() => {
        refreshProgress()
      }, 1000) // Small delay to ensure server has processed the completion
      
    } catch (error) {
      console.error('Failed to mark lesson as complete:', error)
      toast.error('Failed to save progress. Please try again.')
      
      // Revert local state on error
      setLessons(prev => prev.map(lesson => 
        lesson.id === lessonId 
          ? { ...lesson, completed: false }
          : lesson
      ))
    }
  }

  const updateWatchProgress = useCallback((lessonId, progress) => {
    // Update local state immediately
    setWatchProgress(prev => ({
      ...prev,
      [lessonId]: progress
    }))
    
    // Save to server (throttled)
    const lessonDuration = currentLesson?.duration || 0
    throttledSaveProgress(lessonId, progress, lessonDuration)
  }, [currentLesson?.duration, throttledSaveProgress])

  const refreshProgress = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await progressApi.getCourseProgress()
      
      // Store the course progress data from backend
      if (response?.course_progress) {
        setCourseProgress(response.course_progress)
      }
      
      if (response?.modules) {
        // Create a map of lesson ID to progress for easier lookup
        const progressMap = {}
        response.modules.forEach(module => {
          if (module.lessons) {
            module.lessons.forEach(serverLesson => {
              if (serverLesson.progress) {
                progressMap[serverLesson.id] = serverLesson.progress
              }
            })
          }
        })
        
        // Update lessons with server progress
        const updatedLessons = courseData.lessons.map(lesson => {
          const progressData = progressMap[lesson.id]
          if (progressData) {
            return {
              ...lesson,
              completed: progressData.is_completed || false
            }
          }
          return lesson
        })
        
        setLessons(updatedLessons)
        
        // Update watch progress
        const watchProgressData = {}
        Object.keys(progressMap).forEach(lessonId => {
          const progress = progressMap[lessonId]
          watchProgressData[lessonId] = parseFloat(progress.watch_percentage) || 0
        })
        
        setWatchProgress(watchProgressData)
      }
    } catch (error) {
      console.error('Failed to refresh progress from server:', error)
      toast.error('Failed to refresh progress data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getProgress = () => {
    // Use backend data if available, fallback to local calculation
    if (courseProgress) {
      return Math.round(parseFloat(courseProgress.progress_percentage) || 0)
    }
    
    // Fallback to local calculation
    const completed = lessons.filter(lesson => lesson.completed).length
    const total = lessons.length
    return Math.round((completed / total) * 100)
  }

  const getTotalLessons = () => {
    // Use backend total if available, fallback to local count
    return courseProgress?.total_lessons || lessons.length
  }

  const getCompletedLessons = () => {
    // Use backend count if available, fallback to local calculation
    return courseProgress?.completed_lessons || lessons.filter(lesson => lesson.completed).length
  }

  return (
    <CourseContext.Provider value={{
      lessons,
      currentLesson,
      watchProgress,
      courseProgress,
      setCurrentLesson,
      markLessonComplete,
      updateWatchProgress,
      getProgress,
      getTotalLessons,
      getCompletedLessons,
      refreshProgress,
      isLoading
    }}>
      {children}
    </CourseContext.Provider>
  )
}

export const useCourse = () => {
  const context = useContext(CourseContext)
  if (!context) {
    throw new Error('useCourse must be used within CourseProvider')
  }
  return context
}