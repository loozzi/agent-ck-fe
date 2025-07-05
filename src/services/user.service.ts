import type { AxiosResponse } from 'axios'
import apiInstance from './axios.config'
import type { UserResponse } from '@/types/auth'

const userService = {
  getMe: async (): Promise<AxiosResponse<UserResponse>> => {
    return apiInstance.get('/user/me')
  }
}

export default userService
