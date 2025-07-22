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

export interface SubscriptionPricingResponse {
  id: string
  tier_name: string
  purchase_count_min: number
  purchase_count_max: number
  price_vnd: number
  duration_days: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SubscriptionPurchaseHistoryResponse {
  id: string
  user_id: string
  subscription_id: string
  purchase_count: number
  price_paid_vnd: number
  pricing_tier_id: string
  duration_days: number
  payment_method: string
  notes: string
  created_at: string
}

export interface SubscriptionPurchasePayload {
  pricing_tier_id: string
  payment_method: string
  payment_reference: string
}

export interface SubscriptionPurchaseResponse {
  success: boolean
  message: string
  subscription_id: string
  purchase_history_id: string
  amount_paid_vnd: number
  subscription_end_date: string
}

export interface NextTierResponse {
  total_purchases: number
  paid_purchases: number
  next_paid_purchase_count: number
  has_free_subscription: boolean
  next_tier: NextTier[]
  message: string
}

export interface NextTier {
  tier_name: string
  id: string
  purchase_count_max: number
  duration_days: number
  created_at: string
  price_vnd: number
  purchase_count_min: number
  is_active: boolean
  updated_at: string
}

export interface CreateSubscriptionPricingPayload {
  tier_name: string
  purchase_count_min: number
  purchase_count_max: number
  price_vnd: number
  duration_days: number
  is_active: boolean
}

export interface CreateSubscriptionPricingResponse {
  id: string
  tier_name: string
  purchase_count_min: number
  purchase_count_max: number
  price_vnd: number
  duration_days: number
  is_active: boolean
  created_at: string
  updated_at: string
}
