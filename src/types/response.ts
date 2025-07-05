export interface PaginatedResponse {
  total: number
  limit: number
  offset: number
}

export interface TrainerStats {
  total_prompts: number
  active_prompts: number
  total_logic_rules: number
  active_logic_rules: number
  prompts_by_category: PromptsByCategory
}

export interface PromptsByCategory {
  [category: string]: number
}
