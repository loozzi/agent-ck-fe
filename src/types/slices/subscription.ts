import type { SubscriptionCode, SubscriptionMessage, UserSubscriptionStatus } from '../subscription'

export interface SubscriptionState {
  subscriptionCodes: SubscriptionCode[]
  userSubscriptionStatus: UserSubscriptionStatus[]
  messages: SubscriptionMessage[]
  isLoading: boolean
  error: string | null
}
