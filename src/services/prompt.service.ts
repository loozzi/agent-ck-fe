import type { CreatePromptPayload, GetMyPromptParams, Prompt, PromptDetail, UpdatePromtPayload } from '@/types/prompts'
import type { AxiosResponse } from 'axios'
import apiInstance from './axios.config'
import type { TrainerStats } from '@/types/response'

const promtService = {
  create: (data: CreatePromptPayload): Promise<AxiosResponse<Prompt>> =>
    apiInstance.post<Prompt>('/trainer/prompts', data),
  getPrompts: (params: GetMyPromptParams): Promise<AxiosResponse<Prompt[]>> =>
    apiInstance.get<Prompt[]>('/trainer/prompts', { params }),
  getPromptDetail: (id: string): Promise<AxiosResponse<PromptDetail>> =>
    apiInstance.get<PromptDetail>(`/trainer/prompts/${id}`),
  update: (id: string, data: UpdatePromtPayload): Promise<AxiosResponse<Prompt>> =>
    apiInstance.put<Prompt>(`/trainer/prompts/${id}`, data),
  remove: (id: string): Promise<AxiosResponse<void>> => apiInstance.delete(`/trainer/prompts/${id}`),
  getStats: (): Promise<AxiosResponse<TrainerStats>> => apiInstance.get<TrainerStats>('/trainer/stats')
}

export default promtService
