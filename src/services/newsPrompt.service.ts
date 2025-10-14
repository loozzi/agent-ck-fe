import type {
  NewsPrompt,
  GetNewsPromptsParams,
  GetNewsPromptsResponse,
  CreateNewsPromptPayload,
  TestNewsPromptPayload,
  TestNewsPromptResponse
} from '@/types/news_prompt'
import type { AxiosResponse } from 'axios'

import apiInstance from './axios.config'

const newsPromptService = {
  getNewsPrompts: (params: GetNewsPromptsParams): Promise<AxiosResponse<GetNewsPromptsResponse>> => {
    return apiInstance.get('/news-prompts/', { params })
  },
  getNewsPromptById: (id: string): Promise<AxiosResponse<NewsPrompt>> => {
    return apiInstance.get(`/news-prompts/${id}`)
  },
  createNewsPrompt: (payload: CreateNewsPromptPayload): Promise<AxiosResponse<NewsPrompt>> => {
    return apiInstance.post('/news-prompts/', payload)
  },
  testNewsPrompt: (payload: TestNewsPromptPayload): Promise<AxiosResponse<TestNewsPromptResponse>> => {
    return apiInstance.post('/news-prompts/test', payload)
  },
  deleteNewsPrompt: (id: string): Promise<AxiosResponse<void>> => {
    return apiInstance.delete(`/news-prompts/${id}`)
  },
  updateNewsPrompt: (id: string, payload: Partial<CreateNewsPromptPayload>): Promise<AxiosResponse<NewsPrompt>> => {
    return apiInstance.put(`/news-prompts/${id}`, payload)
  },
  toggleNewsPromptActive: (id: string): Promise<AxiosResponse<NewsPrompt>> => {
    return apiInstance.post(`/news-prompts/${id}/activate`)
  }
}

export default newsPromptService
