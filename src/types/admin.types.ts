import type { LogicRule, LogicRuleAction, LogicRuleIndicator } from './logicRules'
import type { Prompt } from './prompts'

export type UserRole = 'user' | 'admin' | 'trainer'
export type UserStatus = 'viewer' | 'subscriber'

export interface UpdateUserRolePayload {
  user_id: string
  new_role: string
}

export interface UpdateUserRoleResponse {
  message: string
  user_id: string
  email: string
  old_role: UserRole
  new_role: UserRole
}

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  status: UserStatus
  zalo_id: string
  zalo_name: string
  onboarding_completed: boolean
}

export interface DeleteSubscriptionCodeParams {
  code_id: string
}

export interface RevokeSubscriptionCodeParams {
  user_id: string
}

// Prompts & Logic Rules
export interface GetAllPromptsParams {
  trainer_id?: string
  category?: string
  is_active?: boolean
}

export interface GetAllLogicRulesParams {
  trainer_id?: string
  indicator?: LogicRuleIndicator
  action?: LogicRuleAction
  is_active?: boolean
}

export interface AdminState {
  users: User[]
  prompts: Prompt[]
  logicRules: LogicRule[]
  isLoading: boolean
  error?: string
}
