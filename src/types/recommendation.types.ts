import type { LogicRuleTimeFrame } from './logicRules'

export interface GenerateRecommendationPayload {
  limit: number
  exclude_portfolio: boolean
  period: number
  interval: LogicRuleTimeFrame
  expiry_days: number
}

export interface GenerateRecommendationResponse {
  success: boolean
  user_id: string
  generated_count: number
  cleaned_old_count: number
  recommendations: Recommendation[]
  generated_at: string
  expires_at: string
  error: string
}

export interface RecommendationResponse {
  success: boolean
  user_id: string
  total_recommendations: number
  recommendations: Recommendation[]
  generated_at: string
}

export interface Recommendation {
  id: string
  user_id: string
  ticker: string
  signal: string
  confidence: number
  entry_price: number
  stop_loss: number
  take_profit: number
  risk_level: string
  timeframe: string
  reasoning: any[]
  risk_reward_ratio: number
  technical_summary: TechnicalSummary
  market_context: string
  score: number
  custom_insights: any[]
  rule_results: any[]
  triggered_actions: any[]
  created_at: string
  analysis_period: number
  analysis_interval: string
  data_points: number
}

export interface TechnicalSummary {
  ticker: string
  datetime: string
  price: Price
  trend: Trend
  momentum: Momentum
  volatility: Volatility
  volume: Volume
  support_resistance: SupportResistance
}

export interface Price {
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface Trend {
  sma_10: number
  sma_20: number
  sma_50: number
  ema_12: number
  ema_26: number
  adx: any
}

export interface Momentum {
  rsi: number
  macd: number
  macd_signal: number
  stoch_k: number
  stoch_d: number
  williams_r: number
  roc: number
}

export interface Volatility {
  bb_upper: number
  bb_middle: number
  bb_lower: number
  bb_position: number
  atr: number
}

export interface Volume {
  volume_sma_20: number
  obv: number
  volume_roc: number
}

export interface SupportResistance {
  pivot: number
  resistance_1: number
  resistance_2: number
  support_1: number
  support_2: number
}

export interface RecommendationState {
  recommendationData?: RecommendationResponse
  loading: boolean
  error: string | null
}
