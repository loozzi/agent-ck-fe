export interface SignInResponse {
  access_token: string
  refresh_token: string
  token_type: string

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

  [key: string]: any
}

export interface PaginatedResponse {
  total: number
  limit: number
  offset: number
}

export interface TrainerStats {
  total_prompts: number
  active_prompts: number
  total_logic_rules: number
  active_logic_rules: number
  prompts_by_category: PromptsByCategory
}

export interface PromptsByCategory {
  [category: string]: number
}
