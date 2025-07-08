export interface ZaloAuthUrlResponse {
  authorization_url: string
  state: string
}

export interface ZaloSendCodePayload {
  code: string
  state: string
}

export interface ZaloTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: object
  message: string
}

export interface GetZaloDataParams {
  access_token: string
}

export interface GetAccessTokenPayload {
  [key: string]: any
}

export interface ZaloState {
  state: string
  code: string
  authorization_url: string
  userData?: GetAccessTokenPayload
  error?: string
}
