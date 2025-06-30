export interface SurveyPayload {
  investment_decision_source: string
  loss_reason: string
  financial_report_difficulty: string
  investment_tools_used: string
  decision_influences: string
  wrong_decisions: string
  restart_choice: string
  investment_motivation: string
  has_trading_account: string
  planned_investment_amount: string
  has_emergency_fund: string
  income_source: string
  daily_time_commitment: string
  market_info_source: string
  financial_knowledge_level: string
  general_risk_appetite: string
  stock_risk_appetite: string
  main_concern: string
  three_month_goal: string
  investment_style: string
  ai_support_preferences: string[]
  ai_response_style: string
  monthly_profit_expectation: string
  yearly_profit_expectation: string
  loss_reaction: string
  ai_help_focus: string
  ai_role_preference: string
  other_investments: string
  ai_tool_expectation: string
  sharing_impact: string
}

export interface SurveyResponse {
  id: number
  user_id: string
  completed_at: string
  is_completed: boolean
  investment_decision_source: string
  loss_reason: string
  financial_report_difficulty: string
  investment_tools_used: string
  decision_influences: string
  wrong_decisions: string
  restart_choice: string
  investment_motivation: string
  has_trading_account: string
  planned_investment_amount: string
  has_emergency_fund: string
  income_source: string
  daily_time_commitment: string
  market_info_source: string
  financial_knowledge_level: string
  general_risk_appetite: string
  stock_risk_appetite: string
  main_concern: string
  three_month_goal: string
  investment_style: string
  ai_support_preferences: string[]
  ai_response_style: string
  monthly_profit_expectation: string
  yearly_profit_expectation: string
  loss_reaction: string
  ai_help_focus: string
  ai_role_preference: string
  other_investments: string
  ai_tool_expectation: string
  sharing_impact: string
}

export interface SurveyStatusResponse {
  is_completed: boolean
  completed_at?: string
}

export interface SurveyQuestion {
  id: string
  question: string
  options: string[]

  multiple?: boolean
  max_selections?: number
}

export interface SurveyPart {
  title: string
  questions: SurveyQuestion[]
}

export interface SurveyQuestionResponse {
  part1: SurveyPart
  part2: SurveyPart
  part3: SurveyPart
}

export interface SurveyState {
  questions: SurveyQuestionResponse | null
  currentPart: number
  currentQuestionIndex: number
  answers: Record<string, string | string[]>
  isSubmitting: boolean
  error: string | null
  status: SurveyStatusResponse | null
  isLoading: boolean
  isCompleted: boolean
  surveyResponse: SurveyResponse | null
}
