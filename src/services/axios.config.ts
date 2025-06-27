import { store } from '@/app/store'
import { authActions } from '@/slices/auth.slice'
import axios from 'axios'

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/',
  timeout: 10000 // Set a timeout of 10 seconds
})

apiInstance.interceptors.request.use(
  (config) => {
    // Add any request modifications here, like adding headers
    const whiteList = ['/auth/login', '/auth/register', '/auth/token/refresh']

    if (whiteList.includes(config.url || '')) {
      return config
    }

    const token = store.getState().auth.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response
  },
  // TODO: handle refresh token logic
  (error) => {
    if (error.status === 401 || error.response.data.detail === 'Invalid token') {
      const refreshToken = store.getState().auth.refreshToken
      if (refreshToken) {
        return apiInstance
          .post('/auth/token/refresh', { refresh_token: refreshToken })
          .then((response) => {
            store.dispatch(authActions.updateToken(response.data))
            // Retry the original request with the new token
            error.config.headers['Authorization'] = `Bearer ${response.data.access_token}`
            return apiInstance.request(error.config)
          })
          .catch((refreshError) => {
            return Promise.reject(refreshError)
          })
      }
    }
    return error
  }
)

export default apiInstance
