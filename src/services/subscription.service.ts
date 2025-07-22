import type {
  CreateSupscriptionPayload,
  SubscriptionCode,
  SubscriptionMessage,
  SubscriptionStatus,
  SubscriptionUpdateRolePayload,
  SubscriptionCodeParams,
  SubscriptionUpdateRoleResponse,
  SubscriptionDirectActivePayload,
  SubscriptionPricingResponse,
  SubscriptionPurchaseHistoryResponse,
  SubscriptionPurchasePayload,
  SubscriptionPurchaseResponse,
  NextTierResponse,
  CreateSubscriptionPricingPayload,
  CreateSubscriptionPricingResponse
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
    return apiInstance.patch(`/admin/users/role`, data)
  },
  allUsers: (): Promise<AxiosResponse<any[]>> => {
    return apiInstance.get<any[]>('/admin/users')
  },
  deleteSubscriptionCode: (codeId: string): Promise<AxiosResponse<void>> => {
    return apiInstance.delete<void>(`/admin/codes`, { params: { code_id: codeId } })
  },
  revorkCode: (userId: string): Promise<AxiosResponse<void>> => {
    return apiInstance.delete<void>(`/admin/users/subscription`, { params: { user_id: userId } })
  },
  directActiveSubscription: (data: SubscriptionDirectActivePayload): Promise<AxiosResponse<SubscriptionStatus>> =>
    apiInstance.post<SubscriptionStatus>('/subscription/direct-activate', data),
  getSubscriptionPricings: (): Promise<AxiosResponse<SubscriptionPricingResponse[]>> => {
    return apiInstance.get<SubscriptionPricingResponse[]>('/subscription/pricing')
  },
  getSubscriptionPurchaseHistory: (): Promise<AxiosResponse<SubscriptionPurchaseHistoryResponse[]>> => {
    return apiInstance.get<SubscriptionPurchaseHistoryResponse[]>('/subscription/purchase-history')
  },
  getNextTierInfo: (): Promise<AxiosResponse<NextTierResponse>> => {
    return apiInstance.get<NextTierResponse>('/subscription/next-tier-info')
  },
  purchaseSubscription: (data: SubscriptionPurchasePayload): Promise<AxiosResponse<SubscriptionPurchaseResponse>> => {
    return apiInstance.post<SubscriptionPurchaseResponse>('/subscription/purchase', data)
  },
  createSubscriptionPricing: (
    data: CreateSubscriptionPricingPayload
  ): Promise<AxiosResponse<CreateSubscriptionPricingResponse>> => {
    return apiInstance.post<CreateSubscriptionPricingResponse>('/subscription/pricing', data)
  },
  updateSubscriptionPricing: (
    id: string,
    data: Partial<CreateSubscriptionPricingPayload>
  ): Promise<AxiosResponse<CreateSubscriptionPricingResponse>> => {
    return apiInstance.patch<CreateSubscriptionPricingResponse>(`/subscription/pricing/${id}`, data)
  },
  deleteSubscriptionPricing: (id: string): Promise<AxiosResponse<void>> => {
    return apiInstance.delete<void>(`/subscription/pricing/${id}`)
  }
}
export default subscriptionService
