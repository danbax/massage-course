import { createContext, useContext, useState } from 'react'
import { courseData } from '../data/courseData'

const CourseContext = createContext()

export const CourseProvider = ({ children }) => {
  const [lessons, setLessons] = useState(courseData.lessons)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [watchProgress, setWatchProgress] = useState({})

  const markLessonComplete = (lessonId) => {
    setLessons(prev => prev.map(lesson => 
      lesson.id === lessonId 
        ? { ...lesson, completed: true, current: false }
        : lesson.id === lessonId + 1
        ? { ...lesson, current: true }
        : lesson
    ))
  }

  const updateWatchProgress = (lessonId, progress) => {
    setWatchProgress(prev => ({
      ...prev,
      [lessonId]: progress
    }))
  }

  const getProgress = () => {
    const completed = lessons.filter(lesson => lesson.completed).length
    const total = lessons.length
    return Math.round((completed / total) * 100)
  }

  return (
    <CourseContext.Provider value={{
      lessons,
      currentLesson,
      watchProgress,
      setCurrentLesson,
      markLessonComplete,
      updateWatchProgress,
      getProgress
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