import type { Stock, StockHistory } from '../stock'

export interface StockState {
  stocks: Stock[]
  total: number
  limit: number
  offset: number
  stockHistory?: StockHistory
  loading: boolean
  error: string | null
}
