import type { SessionResponse, SignInResponse, SignUpResponse } from '@/types/auth'
import apiInstance from './axios.config'
import type { RefreshTokenPayload, SignInPayload, SignUpPayload } from '@/types/payload'
import type { AxiosResponse } from 'axios'

const authService = {
  signIn: async (data: SignInPayload): Promise<AxiosResponse<SignInResponse>> => {
    return apiInstance.post('/auth/login', data)
  },
  signUp: async (data: SignUpPayload): Promise<AxiosResponse<SignUpResponse>> => {
    return apiInstance.post('/auth/register', data)
  },
  refreshToken: async (data: RefreshTokenPayload): Promise<AxiosResponse<SignInResponse>> => {
    return apiInstance.post('/auth/token/refresh', data)
  },
  getSessions: (): Promise<AxiosResponse<SessionResponse>> => apiInstance.get('/auth/sessions'),
  signOut: (): Promise<AxiosResponse<void>> => apiInstance.post('/auth/logout')
}

export default authService
