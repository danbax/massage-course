import { create } from 'zustand'
import { paymentApi } from '../api/services'

export const usePaymentStore = create((set, get) => ({
  payments: [],
  currentPayment: null,
  paymentIntent: null,
  processing: false,
  error: null,

  fetchPayments: async () => {
    set({ processing: true, error: null })
    try {
      const response = await paymentApi.getPayments()
      set({ 
        payments: response.payments,
        processing: false 
      })
      return response
    } catch (error) {
      set({ 
        error: error.message,
        processing: false 
      })
      throw error
    }
  },

  fetchPayment: async (paymentId) => {
    set({ processing: true, error: null })
    try {
      const response = await paymentApi.getPayment(paymentId)
      set({ 
        currentPayment: response.payment,
        processing: false 
      })
      return response
    } catch (error) {
      set({ 
        error: error.message,
        processing: false 
      })
      throw error
    }
  },

  createPaymentIntent: async (courseId) => {
    set({ processing: true, error: null })
    try {
      const response = await paymentApi.createPaymentIntent({ course_id: courseId })
      set({ 
        paymentIntent: {
          client_secret: response.client_secret,
          payment_intent_id: response.payment_intent_id,
          amount: response.amount,
          currency: response.currency,
          course_id: courseId
        },
        processing: false 
      })
      return response
    } catch (error) {
      set({ 
        error: error.message,
        processing: false 
      })
      throw error
    }
  },

  confirmPayment: async (paymentIntentId, courseId) => {
    set({ processing: true, error: null })
    try {
      const response = await paymentApi.confirmPayment({
        payment_intent_id: paymentIntentId,
        course_id: courseId
      })
      
      set(state => ({ 
        payments: [...state.payments, response.payment],
        paymentIntent: null,
        processing: false 
      }))
      
      return response
    } catch (error) {
      set({ 
        error: error.message,
        processing: false 
      })
      throw error
    }
  },

  requestRefund: async (paymentId, reason) => {
    set({ processing: true, error: null })
    try {
      const response = await paymentApi.requestRefund(paymentId, { reason })
      
      set(state => ({
        payments: state.payments.map(payment =>
          payment.id === paymentId 
            ? { ...payment, status: 'refund_requested', refund: response.refund }
            : payment
        ),
        processing: false
      }))
      
      return response
    } catch (error) {
      set({ 
        error: error.message,
        processing: false 
      })
      throw error
    }
  },

  checkCourseAccess: async (courseId) => {
    try {
      const response = await paymentApi.checkAccess({ course_id: courseId })
      return response.has_access
    } catch (error) {
      set({ error: error.message })
      return false
    }
  },

  getPaymentHistory: () => {
    const { payments } = get()
    return payments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },

  getPaymentByCourse: (courseId) => {
    const { payments } = get()
    return payments.find(payment => 
      payment.course_id === courseId && payment.status === 'completed'
    )
  },

  getTotalSpent: () => {
    const { payments } = get()
    return payments
      .filter(payment => payment.status === 'completed')
      .reduce((total, payment) => total + payment.amount, 0)
  },

  hasPaidForCourse: (courseId) => {
    const { payments } = get()
    return payments.some(payment => 
      payment.course_id === courseId && payment.status === 'completed'
    )
  },

  clearPaymentIntent: () => set({ paymentIntent: null }),
  clearError: () => set({ error: null }),
  
  reset: () => set({
    payments: [],
    currentPayment: null,
    paymentIntent: null,
    processing: false,
    error: null
  })
}))