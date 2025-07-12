import type {
  DeleteSubscriptionCodeParams,
  GetAllLogicRulesParams,
  GetAllPromptsParams,
  RevokeSubscriptionCodeParams,
  UpdateUserRolePayload,
  UpdateUserRoleResponse,
  User
} from '@/types/admin.types'
import type { AxiosResponse } from 'axios'
import apiInstance from './axios.config'
import type { Prompt } from '@/types/prompts'
import type { LogicRule } from '@/types/logicRules'

const ADMIN_ROUTE = {
  USERS: '/admin/users',
  USER_ROLE: '/admin/users/role',
  PROMPTS: '/admin/prompts',
  LOGIC_RULES: '/admin/logic-rules',
  CODES: '/admin/codes',
  SUBSCRIPTION: '/admin/users/subscription'
}

const adminService = {
  fetchUsers: (): Promise<AxiosResponse<User[]>> => apiInstance.get<User[]>(ADMIN_ROUTE.USERS),
  updateUserRole: (data: UpdateUserRolePayload): Promise<AxiosResponse<UpdateUserRoleResponse>> => {
    return apiInstance.patch(ADMIN_ROUTE.USER_ROLE, data)
  },
  deleteSubscriptionCode: (params: DeleteSubscriptionCodeParams): Promise<AxiosResponse<void>> =>
    apiInstance.delete(ADMIN_ROUTE.CODES, { params }),
  revokeSubscriptionCode: (params: RevokeSubscriptionCodeParams): Promise<AxiosResponse<void>> => {
    return apiInstance.delete(ADMIN_ROUTE.SUBSCRIPTION, { params })
  },
  getAllPrompts: (params?: GetAllPromptsParams): Promise<AxiosResponse<Prompt[]>> => {
    return apiInstance.get(ADMIN_ROUTE.PROMPTS, { params })
  },
  getAllLogicRules: (params?: GetAllLogicRulesParams): Promise<AxiosResponse<LogicRule[]>> => {
    return apiInstance.get(ADMIN_ROUTE.LOGIC_RULES, { params })
  }
}

export default adminService
