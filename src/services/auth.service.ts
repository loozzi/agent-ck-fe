import type {
  ChangePasswordPayload,
  ChangePasswordResponse,
  SessionResponse,
  SignInResponse,
  SignUpResponse,
  ZaloCompleteLoginPayload,
  ZaloCompleteLoginResponse
} from '@/types/auth'
import type { RefreshTokenPayload, SignInPayload, SignUpPayload } from '@/types/payload'
import type { AxiosResponse } from 'axios'
import apiInstance from './axios.config'

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
  signOut: (): Promise<AxiosResponse<void>> => apiInstance.post('/auth/logout'),
  completeLogin: (data: ZaloCompleteLoginPayload): Promise<AxiosResponse<ZaloCompleteLoginResponse>> =>
    apiInstance.post('/auth/zalo/complete-login', data),
  changePassword: (data: ChangePasswordPayload): Promise<AxiosResponse<ChangePasswordResponse>> =>
    apiInstance.post('/auth/change-password', data)
}

export default authService
