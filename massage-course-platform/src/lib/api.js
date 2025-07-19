const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  getAuthToken() {
    return localStorage.getItem('auth_token')
  }

  setAuthToken(token) {
    localStorage.setItem('auth_token', token)
  }

  removeAuthToken() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth-storage') // Clear Zustand persisted state
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getAuthToken()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)

      // Handle unauthorized responses (token expired)
      if (response.status === 401 && token) {
        this.removeAuthToken()
        if (typeof window !== 'undefined') {
          window.location.href = '/signin'
        }
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // Suppress toast for unauthenticated token errors globally
        if (errorData.message === 'Authentication token is required' && errorData.error === 'Unauthenticated') {
          // Do not throw, just return errorData for silent handling
          return errorData
        }
        throw new ApiError(response.status, errorData.message || 'Request failed', errorData)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }

      return response
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(0, 'Network error occurred', { originalError: error.message })
    }
  }

  // HTTP methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data,
    })
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data,
    })
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }
}

class ApiError extends Error {
  constructor(status, message, data = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }

  get isValidationError() {
    return this.status === 422
  }

  get isUnauthorized() {
    return this.status === 401
  }

  get isForbidden() {
    return this.status === 403
  }

  get isNotFound() {
    return this.status === 404
  }
}

export { ApiError }
export default new ApiClient()
