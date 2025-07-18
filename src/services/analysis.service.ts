import type { AnalysisRequest, AnalysisResponse, TickerAnalysisResponse } from '@/types/analysis.types'
import type { AxiosResponse } from 'axios'
import apiInstance from './axios.config'

const analysisService = {
  getAnalysis: (params: AnalysisRequest): Promise<AxiosResponse<AnalysisResponse>> =>
    apiInstance.get<AnalysisResponse>('/analysis/analyses', { params }),
  getTickerAnalysis: (ticker: string): Promise<AxiosResponse<TickerAnalysisResponse>> =>
    apiInstance.post<TickerAnalysisResponse>(`/analysis/ticker/analyze`, { ticker })
}

export default analysisService
