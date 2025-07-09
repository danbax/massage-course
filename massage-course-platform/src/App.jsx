import { Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { LanguageProvider } from './hooks/useLanguage'
import { AuthProvider } from './hooks/useAuth'
import { CourseProvider } from './hooks/useCourse'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import SignIn from './pages/SignIn'
import Register from './pages/Register'
import LearnMore from './pages/LearnMore'
import Purchase from './pages/Purchase'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ContactSupport from './pages/ContactSupport'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import VideoPlayer from './pages/VideoPlayer'
import Progress from './pages/Progress'
import Certificates from './pages/Certificates'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import VideoRedirect from './components/VideoRedirect'

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <CourseProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/learn-more" element={<LearnMore />} />
              <Route path="/purchase" element={<Purchase />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/contact-support" element={<ContactSupport />} />
              <Route path="/app" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/app/courses" replace />} />
                <Route path="courses" element={<Courses />} />
                <Route path="video" element={<VideoRedirect />} />
                <Route path="video/:lessonId" element={<VideoPlayer />} />
                <Route path="progress" element={<Progress />} />
                <Route path="certificates" element={<Certificates />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
            <Toaster 
              position="top-right" 
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '12px',
                  background: '#333',
                  color: '#fff',
                },
              }}
            />
          </CourseProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  )
}

export default App