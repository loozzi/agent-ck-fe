import type { Prompt } from '../prompts'
import type { TrainerStats } from '../response'

export interface PromptState {
  prompts: Prompt[]
  promptDetail: Prompt | null
  stats: TrainerStats | null
  isLoading: boolean
  error: string | null
}
