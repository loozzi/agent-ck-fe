export interface WatchlistResponse {
  total_items: number
  recent_additions: RecentAddition[]
  watchlist: Watchlist
}

export interface RecentAddition {
  id: string
  ticker: string
  company_name: string
  sector: string
  exchange: string
  notes: string
  tags: string[]
  category: string
  added_price: number
  target_price: number
  added_at: string
  last_viewed: string
  is_favorite: boolean
  price_info: PriceInfo
  performance_since_added: number
  days_in_watchlist: number
}

export interface PriceInfo {
  current_price: number
  open_price: number
  high_price: number
  low_price: number
  volume: number
  change_amount: number
  change_percent: number
  last_updated: string
}

export interface Watchlist {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
  items_count: number
}

export interface WatchlistUpdatePayload {
  name: string
  description: string
}

export interface WatchlistUpdateResponse {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
  items_count: number
}

// Details

export interface TopPerformer {
  id: string
  ticker: string
  company_name: string
  sector: string
  exchange: string
  notes: string
  tags: string[]
  category: string
  added_price: number
  target_price: number
  added_at: string
  last_viewed: string
  is_favorite: boolean
  price_info: TopPerformerPriceInfo
  performance_since_added: number
  days_in_watchlist: number
}

export interface TopPerformerPriceInfo {
  current_price: number
  open_price: number
  high_price: number
  low_price: number
  volume: number
  change_amount: number
  change_percent: number
  last_updated: string
}

export interface WorstPerformer {
  id: string
  ticker: string
  company_name: string
  sector: string
  exchange: string
  notes: string
  tags: string[]
  category: string
  added_price: number
  target_price: number
  added_at: string
  last_viewed: string
  is_favorite: boolean
  price_info: WorstPerformerPriceInfo
  performance_since_added: number
  days_in_watchlist: number
}

export interface WorstPerformerPriceInfo {
  current_price: number
  open_price: number
  high_price: number
  low_price: number
  volume: number
  change_amount: number
  change_percent: number
  last_updated: string
}

export interface WatchlistItem {
  id: string
  ticker: string
  company_name: string
  sector: string
  exchange: string
  notes: string
  tags: string[]
  category: string
  added_price: number
  target_price: number
  added_at: string
  last_viewed: string
  is_favorite: boolean
  price_info: WatchlistItemPriceInfo
  performance_since_added: number
  days_in_watchlist: number
}

export interface WatchlistItemPriceInfo {
  current_price: number
  open_price: number
  high_price: number
  low_price: number
  volume: number
  change_amount: number
  change_percent: number
  last_updated: string
}

export interface WatchlistDetailsResponse {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
  items: WatchlistItem[]
  total_items: number
  favorites_count: number
  categories: string[]
  top_performers: TopPerformer[]
  worst_performers: WorstPerformer[]
}

// Add items to watchlist
export interface AddToWatchlistPayload {
  ticker: string
  notes: string
  tags: string[]
  category: string
  target_price: number
}

export interface BulkAddToWatchlistPayload {
  tickers: string[]
  category: string
  tags: string[]
}

export interface UpdateWatchlistItemPayload {
  notes: string
  tags: string[]
  category: string
  target_price: number
  is_favorite: boolean
}
