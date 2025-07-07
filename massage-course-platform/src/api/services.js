import apiClient from '../lib/api'

export const certificateApi = {
  // Get user certificates (requires authentication)
  getCertificates: async () => {
    const response = await apiClient.get('/certificates')
    return response
  },

  // Get specific certificate (requires authentication)
  getCertificate: async (certificateId) => {
    const response = await apiClient.get(`/certificates/${certificateId}`)
    return response
  },

  // Download certificate (requires authentication)
  downloadCertificate: async (certificateId) => {
    const response = await apiClient.get(`/certificates/${certificateId}/download`)
    return response
  },

  // Generate certificate for completed course (requires authentication)
  generateCertificate: async (courseId) => {
    const response = await apiClient.post(`/certificates/generate/${courseId}`)
    return response
  },

  // Verify certificate (public)
  verifyCertificate: async (code) => {
    const response = await apiClient.get(`/certificates/verify/${code}`)
    return response
  }
}

export const paymentApi = {
  // Get payment history (requires authentication)
  getPayments: async () => {
    const response = await apiClient.get('/payments')
    return response
  },

  // Get specific payment (requires authentication)
  getPayment: async (paymentId) => {
    const response = await apiClient.get(`/payments/${paymentId}`)
    return response
  },

  // Create payment intent (requires authentication)
  createPaymentIntent: async (paymentData) => {
    const response = await apiClient.post('/payments/intent', paymentData)
    return response
  },

  // Confirm payment (requires authentication)
  confirmPayment: async (paymentData) => {
    const response = await apiClient.post('/payments/confirm', paymentData)
    return response
  }
}

export const settingsApi = {
  // Get user settings (requires authentication)
  getSettings: async () => {
    const response = await apiClient.get('/settings')
    return response
  },

  // Update user settings (requires authentication)
  updateSettings: async (settings) => {
    const response = await apiClient.put('/settings', settings)
    return response
  },

  // Get notification settings (requires authentication)
  getNotificationSettings: async () => {
    const response = await apiClient.get('/settings/notifications')
    return response
  },

  // Update notification settings (requires authentication)
  updateNotificationSettings: async (notifications) => {
    const response = await apiClient.put('/settings/notifications', notifications)
    return response
  }
}
