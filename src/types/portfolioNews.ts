export type PortfolioNewsStatus = 'pending' | 'sent' | 'failed'

export interface PortfolioNews {
  id: string
  created_at: string
  updated_at: string
  status: PortfolioNewsStatus
  related_stocks: string[]
  url: string
  released_time: string
  name: string
}

export interface PortfolioNewsResponse {
  items: PortfolioNews[]
  total: number
  page: number
  per_page: number
  pages: number
}

export interface PortfolioNewsFilterParams {
  page?: number
  per_page?: number
  from_date?: string // 'YYYY-MM-DD'
  to_date?: string // 'YYYY-MM-DD'
}

export interface PortfolioNewsState {
  news: PortfolioNews[]
  total: number
  page: number
  per_page: number
  pages: number
  loading: boolean
  error?: string
}

export interface PortfolioNewsByTickerParams {
  params: PortfolioNewsFilterParams
  tickers: string[]
}
