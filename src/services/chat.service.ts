import type {
  ChatHealth,
  ChatHistory,
  ChatHistoryParams,
  ChatPayload,
  ChatResponse,
  ChatSessionInfo,
  SuggestQuestionResponse
} from '@/types/chat'
import type { AxiosResponse } from 'axios'
import apiInstance from './axios.config'

const chatService = {
  send: (data: ChatPayload): Promise<AxiosResponse<ChatResponse>> => {
    return apiInstance.post<ChatPayload, AxiosResponse<ChatResponse>>('/chat/send', data)
  },
  history: (params: ChatHistoryParams): Promise<AxiosResponse<ChatHistory[]>> => {
    return apiInstance.get<ChatHistory[]>('/chat/history', { params })
  },
  clear: (): Promise<AxiosResponse<void>> => {
    return apiInstance.delete<void>('/chat/clear')
  },
  session: (): Promise<AxiosResponse<ChatSessionInfo>> => {
    return apiInstance.get<ChatSessionInfo>('/chat/session-info')
  },
  health: (): Promise<AxiosResponse<ChatHealth>> => {
    return apiInstance.get<ChatHealth>('/chat/health')
  },
  clearCache: (): Promise<AxiosResponse<void>> => {
    return apiInstance.post<void>('/chat/cache/clear')
  },
  getSuggestedQuestions: (): Promise<AxiosResponse<SuggestQuestionResponse>> =>
    apiInstance.get<SuggestQuestionResponse>('/chat/suggest-questions')
}

export default chatService
