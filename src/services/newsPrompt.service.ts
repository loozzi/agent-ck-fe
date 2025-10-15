import type {
  NewsPrompt,
  GetNewsPromptsParams,
  GetNewsPromptsResponse,
  CreateNewsPromptPayload,
  TestNewsPromptPayload,
  TestNewsPromptResponse,
  TestNewsPromptSSEEvent
} from '@/types/news_prompt'
import type { AxiosResponse } from 'axios'
import { store } from '@/app/store'

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
  testNewsPromptSSE: async (
    payload: TestNewsPromptPayload,
    onProgress?: (event: TestNewsPromptSSEEvent) => void
  ): Promise<TestNewsPromptResponse> => {
    const state = store.getState()
    const token = state.auth.token

    const response = await fetch(`${apiInstance.defaults.baseURL}/news-prompts/test`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Response body is not readable')
    }

    const decoder = new TextDecoder()
    let result: TestNewsPromptResponse | null = null

    const readStream = async (): Promise<void> => {
      try {
        const { done, value } = await reader.read()

        if (done) {
          return
        }

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event: TestNewsPromptSSEEvent = JSON.parse(line.substring(6))

              if (event.type === 'progress') {
                onProgress?.(event)
              } else if (event.type === 'complete') {
                result = {
                  success: true,
                  result: event.result || ''
                }
                onProgress?.(event)
                return
              } else if (event.type === 'error') {
                throw new Error(event.error || 'Unknown error occurred')
              }
            } catch (parseError) {
              console.warn('Failed to parse SSE event:', parseError)
            }
          }
        }

        await readStream()
      } catch (error) {
        throw error
      }
    }

    await readStream()

    if (!result) {
      throw new Error('No result received from server')
    }

    return result
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
