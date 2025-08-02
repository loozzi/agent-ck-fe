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

export interface ZaloSendCodeResponse {
  requires_client_side_call: boolean
  client_api_info: ClientApiInfo
  oauth_data: OauthData
  message: string
}

export interface ClientApiInfo {
  access_token: string
  api_endpoint: string
  fields: string
  method: string
}

export interface OauthData {
  authorization_code: string
  state: string
}

export interface ZaloDataResponse {
  is_sensitive: boolean
  name: string
  id: string
  error: number
  message: string
  picture: {
    data: {
      url: string
    }
  }
}

export interface ZaloState {
  state: string
  code: string
  authorization_url: string
  zaloResponse?: ZaloSendCodeResponse
  userData?: ZaloDataResponse
  followStatus?: FollowStatus
  error?: string
}

export interface Window {
  ZaloSocialSDK?: {
    reload: () => void
    // Có thể bổ sung các method khác nếu cần
  }
}

export interface FollowStatus {
  zalo_id: string | number
  is_follower: boolean
  message: string
}
