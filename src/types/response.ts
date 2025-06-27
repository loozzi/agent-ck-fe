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

export type UserRole = 'admin' | 'user' | 'viewer'

export interface UserResponse {
  id: string
  email: string
  full_name: string
  status: string
  role: UserRole
  zalo_id: any

  [key: string]: any
}
