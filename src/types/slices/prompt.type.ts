import type { Prompt, PromptDetail } from '../prompts'
import type { TrainerStats } from '../response'

export interface PromptState {
  prompts: Prompt[]
  promptDetail: PromptDetail | null
  stats: TrainerStats | null
  isLoading: boolean
  error: string | null
}
