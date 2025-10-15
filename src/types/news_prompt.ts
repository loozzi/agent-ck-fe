export interface NewsPrompt {
  name: string
  content: string
  id: string
  created_at: string
  updated_at: string
  test_result: string
  is_active: boolean
}

export interface CreateNewsPromptPayload {
  name: string
  content: string
  test_result: string
}

export interface GetNewsPromptsParams {
  page?: number
  per_page?: number
}

export interface GetNewsPromptsResponse {
  prompts: NewsPrompt[]
  total: number
  page: number
  per_page: number
}

export interface TestNewsPromptPayload {
  content: string
  vn_hour: number
}

export interface TestNewsPromptResponse {
  success: boolean
  result: string
  error?: string
}

export interface TestNewsPromptSSEEvent {
  type: 'progress' | 'complete' | 'error'
  progress?: number
  message?: string
  result?: string
  error?: string
}

export interface NewsPromptState {
  prompts: NewsPrompt[]
  isLoading: boolean
  error?: string
  total: number
  page: number
  per_page: number
  testProgress?: number
  testMessage?: string
  isTestInProgress?: boolean
}
