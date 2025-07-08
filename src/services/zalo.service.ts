import type {
  GetZaloDataParams,
  ZaloAuthUrlResponse,
  ZaloDataResponse,
  ZaloSendCodePayload,
  ZaloSendCodeResponse
} from '@/types/zalo'
import type { AxiosResponse } from 'axios'
import axios from 'axios'
import apiInstance from './axios.config'

const zaloService = {
  getZaloAuthUrl: (): Promise<AxiosResponse<ZaloAuthUrlResponse>> => apiInstance.get('/auth/zalo/auth-url'),
  sendZaloCode: (data: ZaloSendCodePayload): Promise<AxiosResponse<ZaloSendCodeResponse>> =>
    apiInstance.post('/auth/zalo/callback', data),
  getZaloData: (params: GetZaloDataParams): Promise<AxiosResponse<ZaloDataResponse>> =>
    axios.get('https://graph.zalo.me/v2.0/me', {
      headers: {
        access_token: params.access_token
      },
      params: {
        fields: 'id,name,picture'
      }
    })
}

export default zaloService
