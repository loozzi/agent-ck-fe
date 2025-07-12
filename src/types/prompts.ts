import type { LogicRule } from './logicRules'

export type CategoryEnum =
  | 'long_term'
  | 'short_term'
  | 'value_style'
  | 'high_risk'
  | 'moderate_risk'
  | 'low_risk'
  | 'goal_>10%'
  | 'goal_learning'
  | 'f0'
  | 'advance'
  | 'passive'
  | 'learning_mode'
  | 'low_time'
  | 'active'
  | 'general'

export interface CreatePromptPayload {
  name: string
  description: string
  prompt_text: string
  category: CategoryEnum
  is_active: boolean
}

export interface UpdatePromtPayload {
  name?: string
  description?: string
  prompt_text?: string
  category?: CategoryEnum
  is_active?: boolean
}

export interface Prompt extends CreatePromptPayload {
  id: string
  trainer_id: string
  created_at: string
  updated_at: string
}

export interface GetMyPromptParams {
  category?: string
  is_active?: boolean
}

export interface DocumentUploadPayload {
  file: File
  title: string
  description?: string
  category?: CategoryEnum
}

export interface CategoryContent {
  prompts: Prompt[]
  logic_rules: LogicRule[]
}

export interface CategorizedContentResponse {
  f0: CategoryContent
  short_term: CategoryContent
  goal_learning: CategoryContent
  moderate_risk: CategoryContent
  high_risk: CategoryContent
  learning_mode: CategoryContent
  advance: CategoryContent
  low_risk: CategoryContent
  passive: CategoryContent
  low_time: CategoryContent
  long_term: CategoryContent
  value_style: CategoryContent
  active: CategoryContent
  'goal_>10%': CategoryContent
  general: CategoryContent
}
