import { useEffect } from 'react'
import { useAuthStore } from './useAuthStore'
import { useAppStore } from './useAppStore'
import { useProgressStore } from './useProgressStore'
import { useUserStore } from './useUserStore'
import { useCertificateStore } from './useCertificateStore'
import { usePaymentStore } from './usePaymentStore'

export const StoreProvider = ({ children }) => {
  const { isAuthenticated, initialize: initAuth } = useAuthStore()
  const { setLanguage } = useAppStore()
  const { fetchProfile } = useUserStore()
  const { fetchProgress } = useProgressStore()
  const { reset: resetProgress } = useProgressStore()
  const { reset: resetUser } = useUserStore()
  const { reset: resetCertificate } = useCertificateStore()
  const { reset: resetPayment } = usePaymentStore()
  const { reset: resetApp } = useAppStore()

  useEffect(() => {
    const initializeApp = async () => {
      await initAuth()
    }
    
    initializeApp()
  }, [initAuth])

  useEffect(() => {
    const initializeUserData = async () => {
      if (isAuthenticated) {
        try {
          const profile = await fetchProfile()
          if (profile?.profile?.language) {
            setLanguage(profile.profile.language)
          }
          
          await Promise.allSettled([
            fetchProgress(),
          ])
        } catch (error) {
          console.error('Failed to initialize user data:', error)
        }
        return
      }
      
      resetProgress()
      resetUser()
      resetCertificate()
      resetPayment()
      resetApp()
    }

    initializeUserData()
  }, [
    isAuthenticated,
    fetchProfile,
    fetchProgress,
    setLanguage,
    resetProgress,
    resetUser,
    resetCertificate,
    resetPayment,
    resetApp
  ])

  return children
}

export const useStoreActions = () => {
  const authActions = useAuthStore()
  const appActions = useAppStore()
  const progressActions = useProgressStore()
  const userActions = useUserStore()
  const certificateActions = useCertificateStore()
  const paymentActions = usePaymentStore()

  const resetAllStores = () => {
    progressActions.reset()
    userActions.reset()
    certificateActions.reset()
    paymentActions.reset()
    appActions.reset()
  }

  const initializeUserData = async () => {
    if (!authActions.isAuthenticated) return

    try {
      await Promise.allSettled([
        userActions.fetchProfile(),
        progressActions.fetchProgress(),
        certificateActions.fetchCertificates(),
        paymentActions.fetchPayments()
      ])
    } catch (error) {
      console.error('Failed to initialize user data:', error)
    }
  }

  return {
    resetAllStores,
    initializeUserData,
    auth: authActions,
    app: appActions,
    progress: progressActions,
    user: userActions,
    certificate: certificateActions,
    payment: paymentActions
  }
}