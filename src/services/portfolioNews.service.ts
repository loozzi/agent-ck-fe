import type { PortfolioNewsFilterParams, PortfolioNewsResponse } from '@/types/portfolioNews'
import type { AxiosResponse } from 'axios'
import apiInstance from './axios.config'

const PortfolioNewsService = {
  getCurrentUser: async (params: PortfolioNewsFilterParams): Promise<AxiosResponse<PortfolioNewsResponse>> =>
    apiInstance.get<PortfolioNewsResponse>('/portfolio-news/user', { params }),
  getByTicker: (params: PortfolioNewsFilterParams, data: string[]): Promise<AxiosResponse<PortfolioNewsResponse>> =>
    apiInstance.post<PortfolioNewsResponse>(`/portfolio-news/by-tickers`, data, { params })
}

export default PortfolioNewsService
