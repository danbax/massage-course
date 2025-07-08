import { create } from 'zustand'
import { certificateApi } from '../api/services'

export const useCertificateStore = create((set, get) => ({
  certificates: [],
  currentCertificate: null,
  eligibility: {},
  isLoading: false,
  error: null,

  fetchCertificates: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await certificateApi.getCertificates()
      set({ 
        certificates: response.certificates,
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

  fetchCertificate: async (certificateId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await certificateApi.getCertificate(certificateId)
      set({ 
        currentCertificate: response.certificate,
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

  generateCertificate: async (courseId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await certificateApi.generateCertificate(courseId)
      
      set(state => ({ 
        certificates: [...state.certificates, response.certificate],
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

  checkEligibility: async (courseId) => {
    try {
      const response = await certificateApi.checkEligibility(courseId)
      set(state => ({
        eligibility: {
          ...state.eligibility,
          [courseId]: response.eligible
        }
      }))
      return response
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  downloadCertificate: async (certificateId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await certificateApi.downloadCertificate(certificateId)
      set({ isLoading: false })
      
      const blob = new Blob([response], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `certificate-${certificateId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return response
    } catch (error) {
      set({ 
        error: error.message,
        isLoading: false 
      })
      throw error
    }
  },

  verifyCertificate: async (verificationCode) => {
    set({ isLoading: true, error: null })
    try {
      const response = await certificateApi.verifyCertificate(verificationCode)
      set({ isLoading: false })
      return response
    } catch (error) {
      set({ 
        error: error.message,
        isLoading: false 
      })
      throw error
    }
  },

  shareCertificate: async (certificateId, platform) => {
    try {
      const certificate = get().certificates.find(cert => cert.id === certificateId)
      if (!certificate) {
        throw new Error('Certificate not found')
      }

      const shareData = {
        title: `${certificate.course_title} Certificate`,
        text: `I just completed ${certificate.course_title} and earned my certificate!`,
        url: `${window.location.origin}/certificates/verify/${certificate.verification_code}`
      }

      if (platform === 'linkedin') {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`
        window.open(linkedinUrl, '_blank')
      } else if (platform === 'twitter') {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`
        window.open(twitterUrl, '_blank')
      } else if (platform === 'facebook') {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`
        window.open(facebookUrl, '_blank')
      } else if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
        return { message: 'Certificate link copied to clipboard!' }
      }

      return { message: 'Certificate shared successfully!' }
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  isEligibleForCertificate: (courseId) => {
    const { eligibility } = get()
    return eligibility[courseId] || false
  },

  getCertificateByCourse: (courseId) => {
    const { certificates } = get()
    return certificates.find(cert => cert.course_id === courseId)
  },

  getTotalCertificates: () => {
    const { certificates } = get()
    return certificates.length
  },

  clearError: () => set({ error: null }),
  
  reset: () => set({
    certificates: [],
    currentCertificate: null,
    eligibility: {},
    isLoading: false,
    error: null
  })
}))