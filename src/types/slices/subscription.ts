import type { Subscription } from 'react-redux'
import type { SubscriptionMessage, SubscriptionStatus } from '../subscription'

export interface SubscriptionState {
  subscriptions: Subscription[]
  subscriptionStatus: SubscriptionStatus[]
  messages: SubscriptionMessage[]
  isLoading: boolean
  error: string | null
}
