import type { UserSubscription } from './subscription'
import type { OauthData, ZaloDataResponse } from './zalo'

export interface SignInResponse {
  access_token: string
  refresh_token: string
  token_type: string
  message: string

  [key: string]: any
}

export interface SignUpResponse {
  id: string
  email: string
  full_name: string
  status: string
  role: string
  zalo_id?: any

  [key: string]: any
}

export type UserRole = 'admin' | 'user' | 'trainer'

export interface UserResponse {
  id: string
  email: string
  full_name: string
  status: string
  role: UserRole
  zalo_id: any
  zalo_name: string
  onboarding_completed: boolean

  [key: string]: any
}

export interface Session {
  id: string
  created_at: string
  last_activity: string
  device_id: any
  user_agent: string
  ip_address: string
}

export interface SessionResponse {
  active_sessions: number
  sessions: Session[]
}

export interface AuthState {
  isAuthenticated: boolean
  user: UserResponse | null
  sessions?: Session[]
  active_sessions?: number
  token: string | null
  refreshToken?: string | null
  loading: boolean
  signUpSuccess?: boolean
  subscription?: UserSubscription
}

export interface ZaloCompleteLoginPayload {
  oauth_data: OauthData
  user_info: ZaloDataResponse
}

export interface ZaloCompleteLoginResponse {}
