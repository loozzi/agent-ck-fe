import type {
  AddToWatchlistPayload,
  BulkAddToWatchlistPayload,
  UpdateWatchlistItemPayload,
  WatchlistDetailsResponse,
  WatchlistItem,
  WatchlistResponse,
  WatchlistUpdatePayload,
  WatchlistUpdateResponse
} from '@/types/watchlist'
import apiInstance from './axios.config'
import type { AxiosResponse } from 'axios'

const watchListService = {
  getSummary: (): Promise<AxiosResponse<WatchlistResponse>> => apiInstance.get<WatchlistResponse>('/watchlist'),
  updateWatchlist: (data: WatchlistUpdatePayload): Promise<AxiosResponse<WatchlistUpdateResponse>> =>
    apiInstance.put<WatchlistUpdateResponse>('/watchlist', data),
  getDetail: (): Promise<AxiosResponse<WatchlistDetailsResponse>> =>
    apiInstance.get<WatchlistDetailsResponse>('/watchlist/detail'),
  addItem: (data: AddToWatchlistPayload): Promise<AxiosResponse<WatchlistItem>> =>
    apiInstance.post<WatchlistItem>('/watchlist/items', data),
  bulkAddItems: (data: BulkAddToWatchlistPayload): Promise<AxiosResponse<WatchlistItem[]>> =>
    apiInstance.post<WatchlistItem[]>('/watchlist/items/bulk', data),
  updateWatchlistItem: (item_id: string, data: UpdateWatchlistItemPayload): Promise<AxiosResponse<WatchlistItem>> =>
    apiInstance.put<WatchlistItem>(`/watchlist/items/${item_id}`, data),
  deleteWatchlistItem: (item_id: string): Promise<AxiosResponse<void>> =>
    apiInstance.delete<void>(`/watchlist/items/${item_id}`)
}

export default watchListService
