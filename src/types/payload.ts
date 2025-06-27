export interface SignInPayload {
  email: string
  password: string
}

export interface SignUpPayload extends SignInPayload {
  full_name?: string
}

export interface RefreshTokenPayload {
  refresh_token: string
}
