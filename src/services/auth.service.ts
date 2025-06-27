import type { SignInResponse, SignUpResponse } from '@/types/response'
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
  }
}

export default authService
