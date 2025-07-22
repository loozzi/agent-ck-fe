import type {
  SubscriptionCode,
  SubscriptionMessage,
  SubscriptionPricingResponse,
  SubscriptionPurchaseHistoryResponse,
  UserSubscriptionStatus
} from '../subscription'

export interface SubscriptionState {
  subscriptionCodes: SubscriptionCode[]
  userSubscriptionStatus: UserSubscriptionStatus[]
  messages: SubscriptionMessage[]
  listPricings: SubscriptionPricingResponse[]
  nextTierInfo: SubscriptionPricingResponse | null
  purchaseHistory: SubscriptionPurchaseHistoryResponse[]
  isLoading: boolean
  error: string | null
}
