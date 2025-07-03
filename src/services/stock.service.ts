import type { Stock, StockFilter, StockResponse } from '@/types/stock'
import type { AxiosResponse } from 'axios'
import apiInstance from './axios.config'

const stockService = {
  getAll: async (filter: StockFilter): Promise<AxiosResponse<StockResponse>> => {
    return apiInstance.get<StockResponse>('/stocks', { params: filter })
  },
  getByTicker: async (ticker: string): Promise<AxiosResponse<Stock>> => {
    return apiInstance.get<Stock>(`/stocks/${ticker}`)
  }
}

export default stockService
