export type NewsStatus = 'pending' | 'sent' | 'failed'

export type NewsImportance = 'low' | 'medium' | 'high'

export interface GetNewsParams {
  page?: number
  per_page?: number
  source?: string
  importance?: NewsImportance
  language?: string
  from_date: string
  to_date: string
  search?: string
  status?: NewsStatus
}

export interface GetNewsPendingParams {
  limit?: number
}

export interface GetNewsLatestParams extends GetNewsPendingParams {
  source?: string
}

export interface News {
  id: string
  title: string
  url: string
  summary: string
  content: string
  source: string
  language: string
  importance: NewsImportance
  publish_time: string
  status: NewsStatus
  created_at: string
  updated_at: string
  sent_at: string
}

export interface NewsResponse {
  items: News[]
  total: number
  page: number
  per_page: number
  pages: number
}
