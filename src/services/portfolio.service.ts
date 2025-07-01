import type { AddTransactionPayload, TransactionItem, WalletResponse } from '@/types/portfolio'
import apiInstance from './axios.config'
import type { AxiosResponse } from 'axios'

const portfolioService = {
  getAll: async (): Promise<AxiosResponse<WalletResponse>> => {
    return apiInstance.get('/portfolio')
  },
  addItem: async (payload: AddTransactionPayload): Promise<AxiosResponse<TransactionItem>> => {
    return apiInstance.post('/portfolio/transaction', payload)
  },
  getHistory: async (): Promise<AxiosResponse<TransactionItem[]>> => {
    return apiInstance.get(`/portfolio/transactions`)
  },
  refreshValues: async (): Promise<void> => {
    return apiInstance.post('/portfolio/refresh-values')
  },
  updateTransaction: async (id: string, payload: Partial<AddTransactionPayload>): Promise<AxiosResponse<TransactionItem>> => {
    return apiInstance.put(`/portfolio/transaction/${id}`, payload)
  },
  deleteTransaction: async (id: string): Promise<void> => {
    return apiInstance.delete(`/portfolio/transaction/${id}`)
  }
}

export default portfolioService
