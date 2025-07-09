import type {
  Stock,
  StockFilter,
  StockHistory,
  StockHistoryParams,
  StockResponse,
  StockSearchParams
} from '@/types/stock'
import type { AxiosResponse } from 'axios'
import apiInstance from './axios.config'

const stockService = {
  getAll: async (filter: StockFilter): Promise<AxiosResponse<StockResponse>> => {
    return apiInstance.get<StockResponse>('/stocks', { params: filter })
  },
  getByTicker: async (ticker: string): Promise<AxiosResponse<Stock>> => {
    return apiInstance.get<Stock>(`/stocks/${ticker}`)
  },
  search: (params: StockSearchParams): Promise<AxiosResponse<StockResponse>> => {
    return apiInstance.get<StockResponse>('/stocks/search', { params })
  },
  getHistory: async (params: StockHistoryParams): Promise<AxiosResponse<StockHistory>> => {
    return apiInstance.get<StockHistory>(`/stocks/${params.ticker}/history`, { params })
  }
}

export default stockService
