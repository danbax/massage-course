import apiClient from '../lib/api'

export const certificateApi = {
  // Get user certificates
  getCertificates: async () => {
    const response = await apiClient.get('/certificates')
    return response
  },

  // Get specific certificate
  getCertificate: async (certificateId) => {
    const response = await apiClient.get(`/certificates/${certificateId}`)
    return response
  },

  // Generate certificate (no courseId needed for single course)
  generateCertificate: async () => {
    const response = await apiClient.post('/certificates/generate')
    return response
  },

  // Download certificate
  downloadCertificate: async (certificateId) => {
    const response = await apiClient.get(`/certificates/${certificateId}/download`, {
      responseType: 'blob'
    })
    return response
  },

  // Check certificate eligibility (no courseId needed)
  checkEligibility: async () => {
    const response = await apiClient.get('/certificates/eligibility')
    return response
  },

  // Verify certificate by code
  verifyCertificate: async (verificationCode) => {
    const response = await apiClient.get(`/certificates/verify/${verificationCode}`)
    return response
  }
}

export const paymentApi = {
  // Get payment history
  getPayments: async () => {
    const response = await apiClient.get('/payments')
    return response
  },

  // Get specific payment
  getPayment: async (paymentId) => {
    const response = await apiClient.get(`/payments/${paymentId}`)
    return response
  },

  // Create payment intent
  createPaymentIntent: async (data) => {
    const response = await apiClient.post('/payments/intent', data)
    return response
  },

  // Confirm payment
  confirmPayment: async (data) => {
    const response = await apiClient.post('/payments/confirm', data)
    return response
  },

  // Check course access
  checkAccess: async (data) => {
    const response = await apiClient.get('/payments/access', { params: data })
    return response
  },

  // Request refund
  requestRefund: async (paymentId, data) => {
    const response = await apiClient.post(`/payments/${paymentId}/refund`, data)
    return response
  }
}