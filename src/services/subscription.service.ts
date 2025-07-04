import type {
  CreateSupscriptionPayload,
  SubscriptionCode,
  SubscriptionMessage,
  SubscriptionStatus,
  SubscriptionUpdateRolePayload,
  SubscriptionCodeParams,
  SubscriptionUpdateRoleResponse
} from '@/types/subscription'
import apiInstance from './axios.config'
import type { AxiosResponse } from 'axios'

const subscriptionService = {
  createSubscription: (data: CreateSupscriptionPayload): Promise<AxiosResponse<SubscriptionCode>> => {
    return apiInstance.post<SubscriptionCode>('/subscription/codes', data)
  },
  getSubscriptionCodes: (params: SubscriptionCodeParams): Promise<AxiosResponse<SubscriptionCode[]>> => {
    return apiInstance.get<SubscriptionCode[]>('/subscription/codes', {
      params
    })
  },
  getStatus(): Promise<AxiosResponse<SubscriptionStatus>> {
    return apiInstance.get<SubscriptionStatus>('/subscription/status')
  },
  getMessages: (): Promise<AxiosResponse<SubscriptionMessage[]>> => {
    return apiInstance.get<SubscriptionMessage[]>('/subscription/messages')
  },
  updateRole: (data: SubscriptionUpdateRolePayload): Promise<AxiosResponse<SubscriptionUpdateRoleResponse>> => {
    return apiInstance.patch(`/subscription/admin/users/role`, data)
  },
  allUsers: (): Promise<AxiosResponse<any[]>> => {
    return apiInstance.get<any[]>('/admin/users')
  },
  deleteSubscriptionCode: (codeId: string): Promise<AxiosResponse<void>> => {
    return apiInstance.delete<void>(`/admin/codes`, { params: { code_id: codeId } })
  },
  revorkCode: (userId: string): Promise<AxiosResponse<void>> => {
    return apiInstance.delete<void>(`/admin/users/subscription`, { params: { user_id: userId } })
  }
}

export default subscriptionService
