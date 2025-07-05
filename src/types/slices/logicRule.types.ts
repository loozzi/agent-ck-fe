import type { LogicRule } from '../logicRules'

export interface LogicRuleState {
  logicRules: LogicRule[]
  isLoading: boolean
  error: string | null
}
