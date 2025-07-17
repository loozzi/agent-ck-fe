export interface EmailStatusResponse {
  current_email: string
  email_verified: boolean
  pending_email?: string
  id_zalo_default_email: boolean
  has_custom_email: boolean
}

export interface EmailUpdateRequest {
  new_email: string
}

export interface EmailUpdateResponse {
  message: string
  pending_email: string
  verification_sent: boolean
}

export interface EmailVerificationRequest {
  verification_code: string
}

export interface EmailVerificationResponse {
  message: string
  email: string
  verified: boolean
}

export interface ResendVerificationResponse {
  message: string
  pending_email: string
}


export interface EmailState {
    status: EmailStatusResponse | null
    updateRequest: EmailUpdateRequest | null
    verificationRequest: EmailVerificationRequest | null
    resendVerificationResponse: ResendVerificationResponse | null
    error: string | null
    loading: boolean
}