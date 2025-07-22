import type {
  NextTierResponse,
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
  nextTierInfo: NextTierResponse | null
  purchaseHistory: SubscriptionPurchaseHistoryResponse[]
  isLoading: boolean
  error: string | null
}
