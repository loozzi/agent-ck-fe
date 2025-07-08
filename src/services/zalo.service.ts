import type { GetAccessTokenPayload, GetZaloDataParams, ZaloAuthUrlResponse, ZaloSendCodePayload } from '@/types/zalo'
import type { AxiosResponse } from 'axios'
import apiInstance from './axios.config'
import axios from 'axios'

const zaloService = {
  getZaloAuthUrl: (): Promise<AxiosResponse<ZaloAuthUrlResponse>> => apiInstance.get('/auth/zalo/auth-url'),
  sendZaloCode: (data: ZaloSendCodePayload): Promise<AxiosResponse<ZaloSendCodePayload>> =>
    apiInstance.post('/auth/zalo/callback', data),
  getZaloData: (params: GetZaloDataParams): Promise<AxiosResponse<any>> =>
    axios.get('https://graph.zalo.me/v2.0/me', {
      headers: {
        access_token: params.access_token
      },
      params: {
        fields: 'id,name,picture'
      }
    }),
  auth: (data: GetAccessTokenPayload): Promise<AxiosResponse<any>> =>
    apiInstance.post('/auth/zalo/complete-login', data)
}

export default zaloService
