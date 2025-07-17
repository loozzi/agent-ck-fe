const EMAIL_ROUTE = {
  GET_STATUS: '/user/email-status',
  CHANGE_EMAIL: '/user/change-email',
  VERIFY_EMAIL: '/user/verify-email',
  RESEND_VERIFICATION: '/user/resend-verification'
}

import type { AxiosResponse } from 'axios'
import apiInstance from './axios.config'
import type {
  EmailStatusResponse,
  EmailUpdateRequest,
  EmailUpdateResponse,
  EmailVerificationRequest,
  EmailVerificationResponse,
  ResendVerificationResponse
} from '@/types/email.types'

const emailService = {
  getEmailStatus: (): Promise<AxiosResponse<EmailStatusResponse>> => apiInstance.get(EMAIL_ROUTE.GET_STATUS),
  changeEmail: (data: EmailUpdateRequest): Promise<AxiosResponse<EmailUpdateResponse>> =>
    apiInstance.post(EMAIL_ROUTE.CHANGE_EMAIL, data),
  verifyEmail: (data: EmailVerificationRequest): Promise<AxiosResponse<EmailVerificationResponse>> =>
    apiInstance.post(EMAIL_ROUTE.VERIFY_EMAIL, data),
  resendVerification: (): Promise<AxiosResponse<ResendVerificationResponse>> =>
    apiInstance.post(EMAIL_ROUTE.RESEND_VERIFICATION)
}

export default emailService
