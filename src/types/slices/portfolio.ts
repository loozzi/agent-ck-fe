import type { TransactionItem, WalletItem } from '../portfolio'

export interface PortfolioState {
  wallet: WalletItem[]
  transactions: TransactionItem[]
  loading: boolean
  error: string | null
  lastUpdated: string | null
}
