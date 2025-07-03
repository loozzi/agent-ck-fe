export interface ChatPayload {
  message: string
}

export interface ChatResponse {
  role: ChatRole
  content: string
  message_order: number
  id: string
  session_id: string
  created_at: string
}

export type ChatRole = 'user' | 'assistant' | 'system'

export interface ChatHistoryParams {
  limit?: number
}

export interface ChatHistory {
  role: ChatRole
  content: string
  message_order: number
  id: string
  session_id: string
  created_at: string
}

export interface ChatSessionInfo {
  session_id?: string
  message_count: number
  created_at?: string
  updated_at?: string
}

export interface ChatHealth {
  status: string
  cache_stats: CacheStats
  timestamp: string
}

export interface CacheStats {
  session_cache_size: number
  message_cache_size: number
}
