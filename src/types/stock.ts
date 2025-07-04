export interface Stock {
  ticker: string
  name: string
  exchange: string
  sectors: string[]
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface StockResponse {
  stocks: Stock[]
  total: number
  limit: number
  offset: number
}

export interface StockFilter {
  limit?: number
  offset?: number
  sector?: string
  exchange?: string
}

export interface StockSearchParams {
  q: string
  limit?: number
  offset?: number
}
