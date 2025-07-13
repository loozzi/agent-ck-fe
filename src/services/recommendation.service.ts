import type {
  GenerateRecommendationPayload,
  GenerateRecommendationResponse,
  RecommendationResponse
} from '@/types/recommendation.types'
import apiInstance from './axios.config'
import type { AxiosResponse } from 'axios'

const RECOMMENDATION_ROUTES = {
  GENERATE: '/recommendations/generate',
  GET: '/recommendations/'
}

const recommendationService = {
  generate: (data: GenerateRecommendationPayload): Promise<AxiosResponse<GenerateRecommendationResponse>> =>
    apiInstance.post<GenerateRecommendationResponse>(RECOMMENDATION_ROUTES.GENERATE, data),
  get: (): Promise<AxiosResponse<RecommendationResponse>> =>
    apiInstance.get<RecommendationResponse>(RECOMMENDATION_ROUTES.GET)
}

export default recommendationService
