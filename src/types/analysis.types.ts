export interface AnalysisRequest {
  source?: string
  ticker?: string
  signal?: string
  limit?: number
  offset?: number
}

export interface AnalysisResponse {
  success: boolean
  user_id: string
  total_count: number
  analyses: Analysis[]
  filters_applied: FiltersApplied
  error: any
}

export interface Analysis {
  id: string
  user_id: string
  source: string
  ticker: string
  signal: string
  confidence: number
  entry_price: number
  stop_loss: number
  take_profit: number
  reasoning: string
  created_at: string
}

export interface FiltersApplied {}

export interface TickerAnalysisResponse {
  success: boolean
  ticker: string
  signal: string
  confidence: number
  entry_price: number
  stop_loss: number
  take_profit: number
  reasoning: string
  analysis_date: string
  start_date: string
  end_date: string
  interval: string
  in_portfolio: boolean
  in_watchlist: boolean
  custom_analysis: CustomAnalysis
  error: string
}

export interface CustomAnalysis {
  active_prompts_count: number
  active_rules_count: number
  custom_insights: CustomInsightSchema[]
  rule_results: RuleResultSchema[]
  triggered_actions: string[]
}

export interface RuleResultSchema {
  rule_id: string
  rule_name: string
  indicator: string
  operator: string
  threshold_value: string
  action: string
  priority: number
  triggered: boolean
  current_value?: number
  threshold_value_parsed?: number
  message: string
  error?: string
}

export interface CustomInsightSchema {
  prompt_id: string
  prompt_name: string
  prompt_category: string
  signal_type?: string
  entry_price?: number
  take_profit?: number
  stop_loss?: number
  reasoning?: string[]
  insight?: string
  error?: string
}

export interface AnalysisState {
  loading: boolean
  error: string | null
  analyses: Analysis[]
  totalCount: number
  filtersApplied: FiltersApplied
  customAnalysis: CustomAnalysis | null
  tickerAnalysis: TickerAnalysisResponse | null
}
