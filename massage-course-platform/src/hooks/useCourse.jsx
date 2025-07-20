import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { progressApi } from '../api/progress'
import { useLanguage } from './useLanguage'
import { throttle } from '../utils/throttle'
import toast from 'react-hot-toast'

const CourseContext = createContext()

export const CourseProvider = ({ children }) => {
  const { currentLanguage } = useLanguage()
  const [lessons, setLessons] = useState([])
  const [modules, setModules] = useState([])
  const [currentLesson, setCurrentLesson] = useState(null)
  const [watchProgress, setWatchProgress] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [courseProgress, setCourseProgress] = useState(null)

  // Load course data and progress from server on mount and language change
  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch course progress which includes modules and lessons
        const data = await progressApi.getCourseProgress()
        
        if (data?.modules) {
          // Set modules for all languages
          setModules(data.modules)
          
          // Flatten lessons from all modules and add composite keys
          const allLessons = []
          data.modules.forEach(module => {
            if (module.lessons) {
              module.lessons.forEach(lesson => {
                allLessons.push({
                  ...lesson,
                  module_id: module.id,
                  module_title: module.title,
                  language: lesson.language || currentLanguage,
                  // Create composite key for progress tracking
                  composite_key: `${module.id}-${lesson.id}-${lesson.language || currentLanguage}`,
                  // Support for legacy IDs during migration
                  legacy_id: lesson.legacy_id,
                  global_id: lesson.global_id,
                  completed: lesson.progress?.is_completed || false,
                  videoUrl: lesson.video_url,
                  // Ensure we have order field for sorting
                  order: lesson.order || lesson.id
                })
              })
            }
          })
          
          setLessons(allLessons)
          
          // Extract watch progress using composite keys
          const watchProgressData = {}
          allLessons.forEach(lesson => {
            if (lesson.progress && lesson.composite_key) {
              watchProgressData[lesson.composite_key] = parseFloat(lesson.progress.watch_percentage) || 0
            }
          })
          setWatchProgress(watchProgressData)
        } else {
          // If no modules data, initialize empty arrays
          setModules([])
          setLessons([])
          setWatchProgress({})
        }
        
        // Store course progress data
        if (data?.course_progress) {
          setCourseProgress(data.course_progress)
        }
        
      } catch (error) {
        console.error('Failed to load course data:', error)
        //toast.error('Failed to load course data')
        
        // Initialize empty state on error
        setModules([])
        setLessons([])
        setWatchProgress({})
      } finally {
        setIsLoading(false)
      }
    }

    loadCourseData()
  }, [currentLanguage])

  // Create throttled function for saving progress
  const saveProgressToServer = useCallback(
    async (compositeKey, progress, duration) => {
      try {
        // Extract lesson info from composite key
        const [moduleId, lessonId, language] = compositeKey.split('-')
        
        const progressData = {
          watch_percentage: progress,
          watch_time_seconds: Math.floor((progress / 100) * (duration || 0))
        }
        
        // Update lesson progress on server
        // Note: The API endpoint may need to be updated to handle composite keys
        // For now, we'll use the lessonId and rely on the current language context
        await progressApi.updateLessonProgress(parseInt(lessonId), progressData)
      } catch (error) {
        console.error('Failed to update watch progress:', error)
      }
    },
    []
  )

  // Create throttled version using useMemo
  const throttledSaveProgress = useMemo(
    () => throttle(saveProgressToServer, 5000),
    [saveProgressToServer]
  )

  // Find lesson by composite key (module_id, lesson_id, language)
  const findLessonByCompositeKey = useCallback((moduleId, lessonId, language = currentLanguage) => {
    return lessons.find(lesson => 
      lesson.module_id === moduleId && 
      lesson.id === lessonId && 
      lesson.language === language
    )
  }, [lessons, currentLanguage])

  // Get lessons for current language only
  const getLessonsForLanguage = useCallback((language = currentLanguage) => {
    return lessons.filter(l => l.language === language)
  }, [lessons, currentLanguage])

  // Get modules for current language only
  const getModulesForLanguage = useCallback((language = currentLanguage) => {
    return modules.filter(m => m.language === language)
  }, [modules, currentLanguage])

  // Get next lesson in sequence
  const getNextLesson = useCallback((moduleId, lessonId, language = currentLanguage) => {
    // First try to find next lesson in same module
    const currentModuleLessons = lessons
      .filter(l => l.module_id === moduleId && l.language === language)
      .sort((a, b) => a.order - b.order)
    
    const currentIndex = currentModuleLessons.findIndex(l => l.id === lessonId)
    
    // Next lesson in same module
    if (currentIndex >= 0 && currentIndex < currentModuleLessons.length - 1) {
      return currentModuleLessons[currentIndex + 1]
    }
    
    // If last lesson in module, find first lesson in next module
    const sortedModules = modules
      .filter(m => m.language === language)
      .sort((a, b) => (a.order || a.id) - (b.order || b.id))
    
    const currentModuleIndex = sortedModules.findIndex(m => m.id === moduleId)
    
    if (currentModuleIndex >= 0 && currentModuleIndex < sortedModules.length - 1) {
      const nextModule = sortedModules[currentModuleIndex + 1]
      const nextModuleLessons = lessons
        .filter(l => l.module_id === nextModule.id && l.language === language)
        .sort((a, b) => a.order - b.order)
      
      return nextModuleLessons[0] || null
    }
    
    return null
  }, [lessons, modules, currentLanguage])

  // Get previous lesson in sequence
  const getPreviousLesson = useCallback((moduleId, lessonId, language = currentLanguage) => {
    // First try to find previous lesson in same module
    const currentModuleLessons = lessons
      .filter(l => l.module_id === moduleId && l.language === language)
      .sort((a, b) => a.order - b.order)
    
    const currentIndex = currentModuleLessons.findIndex(l => l.id === lessonId)
    
    // Previous lesson in same module
    if (currentIndex > 0) {
      return currentModuleLessons[currentIndex - 1]
    }
    
    // If first lesson in module, find last lesson in previous module
    const sortedModules = modules
      .filter(m => m.language === language)
      .sort((a, b) => (a.order || a.id) - (b.order || b.id))
    
    const currentModuleIndex = sortedModules.findIndex(m => m.id === moduleId)
    
    if (currentModuleIndex > 0) {
      const previousModule = sortedModules[currentModuleIndex - 1]
      const previousModuleLessons = lessons
        .filter(l => l.module_id === previousModule.id && l.language === language)
        .sort((a, b) => a.order - b.order)
      
      return previousModuleLessons[previousModuleLessons.length - 1] || null
    }
    
    return null
  }, [lessons, modules, currentLanguage])

  const markLessonComplete = async (compositeKey) => {
    try {
      // Extract lesson info from composite key
      const [moduleId, lessonId, language] = compositeKey.split('-')
      
      // Update local state immediately for better UX
      setLessons(prev => prev.map(lesson => 
        lesson.composite_key === compositeKey
          ? { ...lesson, completed: true }
          : lesson
      ))
      
      // Save to server
      await progressApi.markLessonCompleted(parseInt(lessonId))
      
      // Refresh progress data to get updated state from server
      setTimeout(() => {
        refreshProgress()
      }, 1000)
      
    } catch (error) {
      console.error('Failed to mark lesson as complete:', error)
      toast.error('Failed to save progress. Please try again.')
      
      // Revert local state on error
      setLessons(prev => prev.map(lesson => 
        lesson.composite_key === compositeKey
          ? { ...lesson, completed: false }
          : lesson
      ))
    }
  }

  const updateWatchProgress = useCallback((compositeKey, progress) => {
    // Update local state immediately
    setWatchProgress(prev => ({
      ...prev,
      [compositeKey]: progress
    }))
    
    // Save to server (throttled)
    const lessonDuration = currentLesson?.duration || 0
    throttledSaveProgress(compositeKey, progress, lessonDuration)
  }, [currentLesson?.duration, throttledSaveProgress])

  const refreshProgress = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await progressApi.getCourseProgress()
      
      if (response?.course_progress) {
        setCourseProgress(response.course_progress)
      }
      
      if (response?.modules) {
        setModules(response.modules)
        
        const allLessons = []
        response.modules.forEach(module => {
          if (module.lessons) {
            module.lessons.forEach(lesson => {
              allLessons.push({
                ...lesson,
                module_id: module.id,
                module_title: module.title,
                language: lesson.language || currentLanguage,
                composite_key: `${module.id}-${lesson.id}-${lesson.language || currentLanguage}`,
                completed: lesson.progress?.is_completed || false,
                videoUrl: lesson.video_url,
                order: lesson.order || lesson.id
              })
            })
          }
        })
        
        setLessons(allLessons)
        
        const watchProgressData = {}
        allLessons.forEach(lesson => {
          if (lesson.progress && lesson.composite_key) {
            watchProgressData[lesson.composite_key] = parseFloat(lesson.progress.watch_percentage) || 0
          }
        })
        setWatchProgress(watchProgressData)
      }
    } catch (error) {
      console.error('Failed to refresh progress:', error)
      toast.error('Failed to refresh progress data')
    } finally {
      setIsLoading(false)
    }
  }, [currentLanguage])

  const getProgress = () => {
    if (courseProgress) {
      return Math.round(parseFloat(courseProgress.progress_percentage) || 0)
    }
    
    const currentLanguageLessons = getLessonsForLanguage(currentLanguage)
    const completed = currentLanguageLessons.filter(lesson => lesson.completed).length
    const total = currentLanguageLessons.length
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const getTotalLessons = () => {
    return courseProgress?.total_lessons || getLessonsForLanguage(currentLanguage).length
  }

  const getCompletedLessons = () => {
    return courseProgress?.completed_lessons || getLessonsForLanguage(currentLanguage).filter(l => l.completed).length
  }

  const getLastWatchedLesson = () => {
    const currentLanguageLessons = getLessonsForLanguage(currentLanguage)
    
    if (currentLanguageLessons.length === 0) return null
    
    let lastWatched = null
    let highestProgress = 0
    
    // Check for lessons with watch progress that aren't completed
    Object.keys(watchProgress).forEach(compositeKey => {
      const progress = watchProgress[compositeKey]
      const lesson = currentLanguageLessons.find(l => l.composite_key === compositeKey)
      
      if (lesson && progress > 0) {
        // Prefer lessons that aren't completed but have progress
        if (!lesson.completed && progress > highestProgress) {
          highestProgress = progress
          lastWatched = lesson
        }
      }
    })
    
    // If no incomplete lesson with progress, find the first incomplete lesson
    if (!lastWatched) {
      const sortedLessons = currentLanguageLessons.sort((a, b) => {
        if (a.module_id !== b.module_id) {
          return a.module_id - b.module_id
        }
        return a.order - b.order
      })
      lastWatched = sortedLessons.find(lesson => !lesson.completed)
    }
    
    // If all lessons are completed, return the last lesson
    if (!lastWatched && currentLanguageLessons.length > 0) {
      const sortedLessons = currentLanguageLessons.sort((a, b) => {
        if (a.module_id !== b.module_id) {
          return a.module_id - b.module_id
        }
        return a.order - b.order
      })
      lastWatched = sortedLessons[sortedLessons.length - 1]
    }
    
    // Final fallback to first lesson
    return lastWatched || currentLanguageLessons[0]
  }

  const getCurrentOrNextLesson = () => {
    const currentLanguageLessons = getLessonsForLanguage(currentLanguage)
    
    if (currentLanguageLessons.length === 0) return null
    
    const sortedLessons = currentLanguageLessons.sort((a, b) => {
      if (a.module_id !== b.module_id) {
        return a.module_id - b.module_id
      }
      return a.order - b.order
    })
    
    const firstIncomplete = sortedLessons.find(lesson => !lesson.completed)
    return firstIncomplete || sortedLessons[0]
  }

  return (
    <CourseContext.Provider value={{
      // Filtered data for current language
      lessons: getLessonsForLanguage(currentLanguage),
      modules: getModulesForLanguage(currentLanguage),
      
      // Access to all data if needed
      allLessons: lessons,
      allModules: modules,
      
      // Current state
      currentLesson,
      watchProgress,
      courseProgress,
      isLoading,
      
      // Actions
      setCurrentLesson,
      markLessonComplete,
      updateWatchProgress,
      refreshProgress,
      
      // Utilities
      findLessonByCompositeKey,
      getNextLesson,
      getPreviousLesson,
      getLessonsForLanguage,
      getModulesForLanguage,
      
      // Progress calculations
      getProgress,
      getTotalLessons,
      getCompletedLessons,
      getLastWatchedLesson,
      getCurrentOrNextLesson
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