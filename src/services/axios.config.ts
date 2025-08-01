import { store } from '@/app/store'
import { API_BASE_URL, API_TIMEOUT } from '@/configs/env.config'
import { authActions } from '@/slices/auth.slice'
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT
})

// Track refresh token promise to avoid multiple refresh calls
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string | null) => void
  reject: (reason: Error) => void
}> = []

// Process the failed request queue after token refresh
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })

  failedQueue = []
}

// Check if the endpoint is in whitelist (doesn't need auth)
const isWhitelistedEndpoint = (url: string): boolean => {
  const whiteList = ['/auth/login', '/auth/register', '/auth/token/refresh']
  return whiteList.some((endpoint) => url.includes(endpoint))
}

// Logout user and redirect to home
const logoutUser = (reason: string = 'Authentication failed') => {
  console.log(`Logging out user: ${reason}`)
  store.dispatch(authActions.signOut())
  window.location.href = '/'
}

apiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Skip auth for whitelisted endpoints
    if (isWhitelistedEndpoint(config.url || '')) {
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
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _refreshTried?: boolean }
    const status = error.response?.status
    const responseData = error.response?.data as Record<string, unknown>

    // Handle onboarding required
    if (status == 403 && responseData?.onboarding_required) {
      console.log('Onboarding required, redirecting to survey...')
      window.location.href = '/survey'
      return Promise.reject(error)
    }

    // Handle 401 Unauthorized
    if (status === 401 && originalRequest) {
      // Prevent infinite loop: only retry once
      if (originalRequest._refreshTried) {
        logoutUser('Token refresh failed (loop prevention)')
        return Promise.reject(error)
      }

      // Check if it's a refresh token endpoint failure
      if (originalRequest.url?.includes('/auth/token/refresh')) {
        logoutUser('Refresh token expired')
        return Promise.reject(error)
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (token) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`
              originalRequest._refreshTried = true
              return apiInstance(originalRequest)
            }
            return Promise.reject(error)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      const refreshToken = store.getState().auth.refreshToken

      // No refresh token available
      if (!refreshToken) {
        logoutUser('No refresh token available')
        return Promise.reject(error)
      }

      isRefreshing = true
      originalRequest._refreshTried = true

      try {
        const response = await apiInstance.post('/auth/token/refresh', {
          refresh_token: refreshToken
        })

        const { access_token, refresh_token: newRefreshToken } = response.data

        // Update tokens in store
        store.dispatch(
          authActions.updateToken({
            accessToken: access_token,
            refreshToken: newRefreshToken
          })
        )

        // Update the original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`

        // Process queued requests
        processQueue(null, access_token)

        // Retry the original request
        return apiInstance(originalRequest)
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        processQueue(refreshError as Error, null)
        logoutUser('Token refresh failed')
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // For all other errors, reject the promise
    return Promise.reject(error)
  }
)

export default apiInstance
