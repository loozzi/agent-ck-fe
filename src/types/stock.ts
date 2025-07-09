export interface Daum {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  price_change: number
  price_change_pct: number
}

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

export interface StockHistory {
  ticker: string
  name: string
  start_date: string
  end_date: string 
  interval: string
  data: Daum[]
  total_records: number
}

export type StockInterval = '1m' | '5m' | '15m' | '30m' | '1H' | '1D' | '1W' | '1M'

export interface StockHistoryParams {
  ticker: string
  start_date: string // YYYY-MM-DD
  end_date?: string
  interval?: StockInterval
}