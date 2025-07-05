import type {
  CreateLogicRulePayload,
  GetMyLogicRuleParams,
  LogicRule,
  UpdateLogicRulePayload
} from '@/types/logicRules'
import type { AxiosResponse } from 'axios'
import apiInstance from './axios.config'

const logicRuleService = {
  create: (data: CreateLogicRulePayload): Promise<AxiosResponse<LogicRule>> =>
    apiInstance.post<LogicRule>('/trainer/logic-rules', data),
  getRules: (params: GetMyLogicRuleParams): Promise<AxiosResponse<LogicRule[]>> =>
    apiInstance.get<LogicRule[]>('/trainer/logic-rules', { params }),
  getRuleDetail: (id: string): Promise<AxiosResponse<LogicRule>> =>
    apiInstance.get<LogicRule>(`/trainer/logic-rules/${id}`),
  update: (id: string, data: UpdateLogicRulePayload): Promise<AxiosResponse<LogicRule>> =>
    apiInstance.put<LogicRule>(`/trainer/logic-rules/${id}`, data),
  remove: (id: string): Promise<AxiosResponse<void>> => apiInstance.delete(`/trainer/logic-rules/${id}`)
}

export default logicRuleService
