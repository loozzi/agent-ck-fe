import type {
  BulkUpdateStrategyPayload,
  BulkUpdateStrategyResponse,
  MyStrategyResponse,
  StrategyRecommendationResponse,
  StratetyResponse
} from '@/types/strategy.type'
import type { AxiosResponse } from 'axios'
import apiInstance from './axios.config'

const STRATEGY_ROUTE = {
  RECOMMENDATIONS: '/strategy/recommendations',
  ADD_PROMPT: '/strategy/prompts',
  DELETE_PROMPT: '/strategy/prompts',
  ADD_LOGIC_RULE: '/strategy/logic-rules',
  DELETE_LOGIC_RULE: '/strategy/logic-rules',
  BULK_ADD_STRATEGIES: '/strategy/bulk',
  GET_MY_STRATEGY: '/strategy/my-strategy'
}

const strategyService = {
  getRecommendations: (): Promise<AxiosResponse<StrategyRecommendationResponse>> =>
    apiInstance.get(STRATEGY_ROUTE.RECOMMENDATIONS),
  addPrompt: (prompt_id: string): Promise<AxiosResponse<StratetyResponse>> =>
    apiInstance.post<StratetyResponse>(STRATEGY_ROUTE.ADD_PROMPT + `/${prompt_id}`),
  deletePrompt: (prompt_id: string): Promise<AxiosResponse<void>> =>
    apiInstance.delete<void>(STRATEGY_ROUTE.DELETE_PROMPT + `/${prompt_id}`),
  addLogicRule: (rule_id: string): Promise<AxiosResponse<StratetyResponse>> =>
    apiInstance.post<StratetyResponse>(STRATEGY_ROUTE.ADD_LOGIC_RULE + `/${rule_id}`),
  deleteLogicRule: (rule_id: string): Promise<AxiosResponse<void>> =>
    apiInstance.delete<void>(STRATEGY_ROUTE.DELETE_LOGIC_RULE + `/${rule_id}`),
  bulkAddStrategies: (data: BulkUpdateStrategyPayload): Promise<AxiosResponse<BulkUpdateStrategyResponse>> =>
    apiInstance.post<BulkUpdateStrategyResponse>(STRATEGY_ROUTE.BULK_ADD_STRATEGIES, data),
  getMyStrategy: (): Promise<AxiosResponse<MyStrategyResponse>> =>
    apiInstance.get<MyStrategyResponse>(STRATEGY_ROUTE.GET_MY_STRATEGY)
}

export default strategyService
