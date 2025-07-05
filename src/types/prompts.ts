import type { LogicRule } from './logicRules'

export interface CreatePromptPayload {
  name: string
  description: string
  prompt_text: string
  category: string
  is_active: boolean
}

export interface UpdatePromtPayload {
  name?: string
  description?: string
  prompt_text?: string
  category?: string
  is_active?: boolean
}

export interface Prompt extends CreatePromptPayload {
  id: string
  trainer_id: string
  created_at: string
  updated_at: string
}

export interface PromptDetail extends Prompt {
  logic_rules: LogicRule[]
}

export interface GetMyPromptParams {
  category?: string
  is_active?: boolean
}
