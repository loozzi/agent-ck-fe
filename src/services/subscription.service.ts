import type {
  CreateSupscriptionPayload,
  SubscriptionCode,
  SubscriptionMessage,
  SubscriptionStatus,
  SubscriptionUpdateRolePayload,
  SubscriptionCodeParams
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
  updateRole: (data: SubscriptionUpdateRolePayload): Promise<AxiosResponse<any>> => {
    const { user_id } = data
    return apiInstance.patch(`/subscription/admin/users/${user_id}/role`, data)
  },
  allUsers: (): Promise<AxiosResponse<any[]>> => {
    return apiInstance.get<any[]>('/subscription/admin/users')
  }
}

export default subscriptionService
