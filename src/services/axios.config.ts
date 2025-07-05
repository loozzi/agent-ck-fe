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
  (error) => {
    // Check if error response exists and has data
    const status = error.response?.status || error.status
    const responseData = error.response?.data

    if (status === 403 || responseData?.onboarding_required) {
      console.log('Onboarding required, redirecting to survey...')
      window.location.href = '/survey'
      return Promise.reject(error)
    }

    // Handle refresh token expired - logout and redirect to login
    if (status === 401) {
      if (
        responseData?.detail === 'Refresh token đã hết hạn hoặc không hợp lệ' ||
        responseData?.detail === 'Phiên đăng nhập đã hết hạn hoặc bị vô hiệu hóa'
      ) {
        store.dispatch(authActions.signOut())
        window.location.href = '/auth/login'
        return Promise.reject(new Error('Refresh token expired or invalid'))
      }
    }

    // Handle invalid token - try to refresh
    if (status === 401 && responseData?.detail === 'Token không hợp lệ') {
      const refreshToken = store.getState().auth.refreshToken
      if (refreshToken) {
        return apiInstance
          .post('/auth/token/refresh', { refresh_token: refreshToken })
          .then((response) => {
            const { access_token, refresh_token } = response.data
            store.dispatch(authActions.updateToken({ accessToken: access_token, refreshToken: refresh_token }))
            error.config.headers['Authorization'] = `Bearer ${access_token}`
            return apiInstance.request(error.config)
          })
          .catch((refreshError) => {
            console.error('Refresh token failed:', refreshError)
            store.dispatch(authActions.signOut())
            window.location.href = '/auth/login'
            return Promise.reject(refreshError)
          })
      } else {
        store.dispatch(authActions.signOut())
        window.location.href = '/auth/login'
        return Promise.reject(new Error('No refresh token available'))
      }
    }

    // For all other errors, reject the promise
    return Promise.reject(error)
  }
)

export default apiInstance
