import type { AxiosResponse } from 'axios'
import apiInstance from './axios.config'
import type { UserResponse } from '@/types/auth'

const userService = {
  getMe: async (): Promise<AxiosResponse<UserResponse>> => {
    return apiInstance.get('/user/me')
  },
  requestEmailOtp: async (email: string): Promise<AxiosResponse<{ message: string }>> => {
    return apiInstance.post('/user/request-email-otp', { email })
  },
  verifyEmailOtp: async (email: string, otp: string): Promise<AxiosResponse<{ message: string }>> => {
    return apiInstance.post('/user/verify-email-otp', { email, otp })
  },
  updateEmail: async (email: string, otp: string): Promise<AxiosResponse<UserResponse>> => {
    return apiInstance.put('/user/email', { email, otp })
  }
}

export default userService
