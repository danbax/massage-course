import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { LanguageProvider } from './hooks/useLanguage'
import { AuthProvider } from './hooks/useAuth'
import { CourseProvider } from './hooks/useCourse'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import SignIn from './pages/SignIn'
import LearnMore from './pages/LearnMore'
import Purchase from './pages/Purchase'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import VideoPlayer from './pages/VideoPlayer'
import Progress from './pages/Progress'
import Certificates from './pages/Certificates'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CourseProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/app" element={<Layout />}>
              <Route index element={<Navigate to="/app/courses" replace />} />
              <Route path="courses" element={<Courses />} />
              <Route path="video/:lessonId" element={<VideoPlayer />} />
              <Route path="progress" element={<Progress />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </CourseProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App