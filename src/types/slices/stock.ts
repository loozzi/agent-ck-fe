import type { Stock } from '../stock'

export interface StockState {
  stocks: Stock[]
  total: number
  limit: number
  offset: number
  loading: boolean
  error: string | null
}
