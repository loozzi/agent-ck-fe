import type { UserStatus } from './admin.types'

export interface CreateSupscriptionPayload {
  user_email: string
  duration_days: number
}

export interface SubscriptionCode {
  id: string
  code: string
  user_id: string
  user_email: string
  duration_days: number
  is_used: boolean
  created_at: string
  activated_at: string
  zalo_id_used: string
}

export interface SubscriptionStatus {
  id: string
  user_id: string
  status: UserStatus
  subscription_type: SubscriptionType
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
}

export interface SubscriptionMessage {
  id: string
  zalo_user_id: string
  user_id: string
  message_text: string
  message_type: string
  is_subscription_activation: boolean
  subscription_code_used: string
  processed: boolean
  created_at: string
  processed_at: string
}

export interface SubscriptionUpdateRolePayload {
  user_id: string
  new_role: string
}

export interface SubscriptionUpdateRoleResponse {
  message: string
  user_id: string
  email: string
  old_role: string
  new_role: string
}

export interface UserSubscription {
  status: UserStatus
  subscription_type: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
}

export interface UserSubscriptionStatus {
  id: string
  email: string
  full_name: string
  role: string
  status: UserStatus
  zalo_id: string
  onboarding_completed: boolean
}

export interface SubscriptionCodeParams {
  user_email?: string
}

export type SubscriptionType = 'premium'

export interface SubscriptionDirectActivePayload {
  user_email: string
  durations_days: number
  subcription_type: SubscriptionType
}
