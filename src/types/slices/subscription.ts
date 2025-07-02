import type { Subscription } from 'react-redux'
import type { SubscriptionMessage, UserSubscriptionStatus } from '../subscription'

export interface SubscriptionState {
  subscriptions: Subscription[]
  userSubscriptionStatus: UserSubscriptionStatus[]
  messages: SubscriptionMessage[]
  isLoading: boolean
  error: string | null
}
