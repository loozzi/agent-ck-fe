export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/'
export const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 100000

export const AUTHORIZATION_URL_CALLBACK =
  import.meta.env.AUTHORIZATION_URL_CALLBACK || 'https://agent-ck-fe.vercel.app/auth/zalo/callback'

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Agent CK'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'
export const APP_DESCRIPTION =
  import.meta.env.VITE_APP_DESCRIPTION || 'Agent CK - Your AI-powered assistant for customer support and more.'
