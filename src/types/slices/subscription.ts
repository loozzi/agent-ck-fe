import type {
  HistoryTransactionResponse,
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
  historyTransactions: HistoryTransactionResponse | null
  isLoading: boolean
  error: string | null
}
