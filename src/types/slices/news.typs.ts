import type { News } from '../news'

export interface NewsState {
  isLoading: boolean
  error: string | null
  news: News[]
  total: number
  page: number
  perPage: number
  pages: number
  pendingNews: News[]
  latestNews: News[]
}
