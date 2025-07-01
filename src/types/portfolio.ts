export interface WalletItem {
  id: string
  ticker: string
  quantity: number
  avg_price: number
  current_price: number
  current_value: number
  sector: string
  recommended: boolean
  last_updated: string

  [key: string]: any
}

export interface WalletResponse {
  id: string
  items: WalletItem[]
  updated_at: string
}

export interface AddTransactionPayload {
  ticker: string
  action: string
  quantity: number
  price: number
  transaction_time: string
  note: string
  [key: string]: any
}

export interface TransactionItem {
  id: string
  ticker: string
  action: string
  quantity: number
  price: number
  transaction_time: string
  note: string
  created_at: string

  [key: string]: any
}
