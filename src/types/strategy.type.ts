import type { LogicRule } from './logicRules'
import type { Prompt } from './prompts'

export interface StrategyRecommendationResponse {
  user_tags: string[]
  recommended_prompts: RecommendedPrompt[]
  recommended_logic_rules: RecommendedLogicRule[]
}

export interface RecommendedPrompt {
  name: string
  description: string
  prompt_text: string
  category: string
  is_active: boolean
  id: string
  trainer_id: string
  created_at: string
  updated_at: string
}

export interface RecommendedLogicRule {
  name: string
  description: string
  indicator: string
  operator: string
  threshold_value: string
  action: string
  timeframe: string
  priority: number
  category: string
  is_active: boolean
  id: string
  trainer_id: string
  created_at: string
  updated_at: string
}

export interface StratetyResponse {
  prompt_id: string
  logic_rule_id: string
  is_active: boolean
  id: string
  user_id: string
  created_at: string
  updated_at: string
  prompt: Prompt
  logic_rule: LogicRule
}

export interface BulkUpdateStrategyPayload {
  prompt_ids: string[]
  logic_rule_ids: string[]
  action: 'activate' | 'deactivate'
}

export interface BulkUpdateStrategyResponse {
  success: boolean
  action: 'activate' | 'deactivate'
  prompts_updated: number
  logic_rules_updated: number
}

export interface MyStrategyResponse {
  prompts: StrategyPrompt[]
  logic_rules: LogicRule[]
}

export interface StrategyPrompt {
  strategy_id: string
  prompt: Prompt
  is_active: boolean
}

export interface StrategyLogicRule {
  strategy_id: string
  logic_rule: LogicRule
  is_active: boolean
}

export interface StrategyState {
  my_strategies: MyStrategyResponse
  recommendations: StrategyRecommendationResponse
  isLoading: boolean
  error: string | null
  isUpdating: boolean
  updateError: string | null
  isBulkUpdating: boolean
  bulkUpdateError: string | null
}
