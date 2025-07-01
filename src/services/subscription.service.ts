import type {
  CreateSupscriptionPayload,
  SubscriptionMessage,
  SubscriptionStatus,
  SubscriptionUpdateRolePayload
} from '@/types/subscription'
import apiInstance from './axios.config'
import type { AxiosResponse } from 'axios'
import type { Subscription } from 'react-redux'

const subscriptionService = {
  createSubscription: (data: CreateSupscriptionPayload): Promise<AxiosResponse<Subscription>> => {
    return apiInstance.post<Subscription>('/subscription/codes', data)
  },
  getAll: (user_email: string): Promise<AxiosResponse<Subscription[]>> => {
    return apiInstance.get<Subscription[]>('/subscription/codes', {
      params: { user_email }
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
    return apiInstance.patch<any>(`/subscription/admin/users/${user_id}/role`, data)
  },
  allUsers: (): Promise<AxiosResponse<any[]>> => {
    return apiInstance.get<any[]>('/subscription/admin/users')
  }
}

export default subscriptionService
