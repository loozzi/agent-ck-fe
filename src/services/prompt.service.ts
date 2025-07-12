import type { CreatePromptPayload, GetMyPromptParams, Prompt, UpdatePromtPayload } from '@/types/prompts'
import type { TrainerStats } from '@/types/response'
import type { AxiosResponse } from 'axios'
import apiInstance from './axios.config'

const promtService = {
  create: (data: CreatePromptPayload): Promise<AxiosResponse<Prompt>> =>
    apiInstance.post<Prompt>('/trainer/prompts', data),
  getPrompts: (params: GetMyPromptParams): Promise<AxiosResponse<Prompt[]>> =>
    apiInstance.get<Prompt[]>('/trainer/prompts', { params }),
  getPromptDetail: (id: string): Promise<AxiosResponse<Prompt>> => apiInstance.get<Prompt>(`/trainer/prompts/${id}`),
  update: (id: string, data: UpdatePromtPayload): Promise<AxiosResponse<Prompt>> =>
    apiInstance.put<Prompt>(`/trainer/prompts/${id}`, data),
  remove: (id: string): Promise<AxiosResponse<void>> => apiInstance.delete(`/trainer/prompts/${id}`),
  getStats: (): Promise<AxiosResponse<TrainerStats>> => apiInstance.get<TrainerStats>('/trainer/stats'),
  uploadDocument: (data: FormData): Promise<AxiosResponse<Prompt>> =>
    apiInstance.post<Prompt>('/trainer/documents/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
}

export default promtService
