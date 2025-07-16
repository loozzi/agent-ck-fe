import type { CategoryEnum } from './prompts'

export type LogicRuleTimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | string
export type LogicRuleIndicator = 'RSI' | 'MACD' | 'SMA' | 'EMA' | 'BOLLINGER_BANDS' | string
export type LogicRuleAction = 'BUY' | 'SELL' | 'HOLD' | 'ALERT'
export type LogicRuleOperator = '>' | '<' | '>=' | '<=' | '==' | 'CROSSES_ABOVE' | 'CROSSES_BELOW' | string

export interface CreateLogicRulePayload {
  name: string
  description: string
  indicator: LogicRuleIndicator
  operator: LogicRuleOperator
  threshold_value: string
  action: LogicRuleAction
  timeframe: LogicRuleTimeFrame
  priority: number
  category: CategoryEnum[]
  is_active: boolean
}

export interface LogicRule {
  name: string
  description: string
  indicator: LogicRuleIndicator
  operator: LogicRuleOperator
  threshold_value: string
  action: LogicRuleAction
  timeframe: LogicRuleTimeFrame
  priority: number
  category: string
  is_active: boolean
  id: string
  trainer_id: string
  created_at: string
  updated_at: string
}

export interface GetMyLogicRuleParams {
  indicator?: LogicRuleIndicator
  action?: LogicRuleAction
  is_active?: boolean
}

export interface UpdateLogicRulePayload {
  name?: string
  description?: string
  indicator?: LogicRuleIndicator
  operator?: LogicRuleOperator
  threshold_value?: string
  action?: LogicRuleAction
  timeframe?: LogicRuleTimeFrame
  priority?: number
  category?: CategoryEnum[]
  is_active?: boolean
}
