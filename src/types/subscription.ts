export interface CreateSupscriptionPayload {
  user_email: string
  duration_days: number
}

export interface Subscription {
  id: string
  code: string
  user_id: string
  duration_days: number
  is_used: boolean
  created_at: string
  activated_at: string
  zalo_id_used: string
}

export interface SubscriptionStatus {
  id: string
  user_id: string
  status: string
  subscription_type: string
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

export interface UserSubscription {
  status: string
  subscription_type: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
}
