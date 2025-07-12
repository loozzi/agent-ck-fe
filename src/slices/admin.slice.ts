import type {
  AdminState,
  GetAllLogicRulesParams,
  GetAllPromptsParams,
  UpdateUserRolePayload,
  DeleteSubscriptionCodeParams,
  RevokeSubscriptionCodeParams
} from '@/types/admin.types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import adminService from '@/services/admin.service'
import type { SubscriptionDirectActivePayload } from '@/types/subscription'
import subscriptionService from '@/services/subscription.service'
import { toast } from 'react-toastify'

const initialState: AdminState = {
  users: [],
  prompts: [],
  logicRules: [],
  isLoading: false,
  error: undefined
}

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await adminService.fetchUsers()
    if (response.status !== 200) {
      const errorMessage = (response as any).response.data.detail || 'Không thể lấy danh sách người dùng'
      return rejectWithValue(errorMessage)
    }
    return response.data
  } catch (error) {
    return rejectWithValue('Không thể lấy danh sách người dùng')
  }
})

export const fetchPrompts = createAsyncThunk(
  'admin/fetchPrompts',
  async (params: GetAllPromptsParams, { rejectWithValue }) => {
    try {
      const response = await adminService.getAllPrompts(params)
      if (response.status !== 200) {
        const errorMessage = (response as any).response.data.detail || 'Không thể lấy danh sách prompts'
        return rejectWithValue(errorMessage)
      }
      return response.data
    } catch (error) {
      return rejectWithValue('Không thể lấy danh sách prompts')
    }
  }
)

export const fetchLogicRules = createAsyncThunk(
  'admin/fetchLogicRules',
  async (params: GetAllLogicRulesParams, { rejectWithValue }) => {
    try {
      const response = await adminService.getAllLogicRules(params)
      if (response.status !== 200) {
        const errorMessage = (response as any).response.data.detail || 'Không thể lấy danh sách quy tắc logic'
        return rejectWithValue(errorMessage)
      }
      return response.data
    } catch (error) {
      return rejectWithValue('Không thể lấy danh sách quy tắc logic')
    }
  }
)

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async (data: UpdateUserRolePayload, { rejectWithValue }) => {
    try {
      const response = await adminService.updateUserRole(data)
      if (response.status !== 200) {
        const errorMessage = (response as any).response.data.detail || 'Không thể cập nhật vai trò người dùng'
        return rejectWithValue(errorMessage)
      }
      return response.data
    } catch (error) {
      return rejectWithValue('Không thể cập nhật vai trò người dùng')
    }
  }
)

export const deleteSubscriptionCode = createAsyncThunk(
  'admin/deleteSubscriptionCode',
  async (params: DeleteSubscriptionCodeParams, { rejectWithValue }) => {
    try {
      const response = await adminService.deleteSubscriptionCode(params)
      if (response.status !== 200) {
        const errorMessage = (response as any).response.data.detail || 'Không thể xóa mã đăng ký'
        return rejectWithValue(errorMessage)
      }
      return response.data
    } catch (error) {
      return rejectWithValue('Không thể xóa mã đăng ký')
    }
  }
)

export const revokeSubscriptionCode = createAsyncThunk(
  'admin/revokeSubscriptionCode',
  async (params: RevokeSubscriptionCodeParams, { rejectWithValue }) => {
    try {
      const response = await adminService.revokeSubscriptionCode(params)
      if (response.status !== 200) {
        const errorMessage = (response as any).response.data.detail || 'Không thể thu hồi mã đăng ký'
        return rejectWithValue(errorMessage)
      }
      return response.data
    } catch (error) {
      return rejectWithValue('Không thể thu hồi mã đăng ký')
    }
  }
)

export const directActiveSubscription = createAsyncThunk(
  'admin/directActiveSubscription',
  async (payload: SubscriptionDirectActivePayload, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.directActiveSubscription(payload)
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể kích hoạt đăng ký trực tiếp'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      toast.success('Đăng ký đã được kích hoạt thành công')
      return response.data
    } catch (error) {
      toast.error('Không thể kích hoạt đăng ký trực tiếp')
      return rejectWithValue('Không thể kích hoạt đăng ký trực tiếp')
    }
  }
)

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchPrompts.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(fetchPrompts.fulfilled, (state, action) => {
        state.isLoading = false
        state.prompts = action.payload
      })
      .addCase(fetchPrompts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchLogicRules.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(fetchLogicRules.fulfilled, (state, action) => {
        state.isLoading = false
        state.logicRules = action.payload
      })
      .addCase(fetchLogicRules.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateUserRole.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isLoading = false
        const updatedUser = action.payload
        const index = state.users.findIndex((user) => user.id === updatedUser.user_id)
        if (index !== -1) {
          state.users[index] = { ...state.users[index], role: updatedUser.new_role }
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteSubscriptionCode.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(deleteSubscriptionCode.fulfilled, (state) => {
        state.isLoading = false
        // Handle successful deletion if needed
      })
      .addCase(deleteSubscriptionCode.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(revokeSubscriptionCode.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(revokeSubscriptionCode.fulfilled, (state) => {
        state.isLoading = false
        // Handle successful revocation if needed
      })
      .addCase(revokeSubscriptionCode.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(directActiveSubscription.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(directActiveSubscription.fulfilled, (state, action) => {
        state.isLoading = false
        const updatedUser = action.payload
        const index = state.users.findIndex((user) => user.id === updatedUser.user_id)
        if (index !== -1) {
          state.users[index] = { ...state.users[index], status: 'subscriber' }
        }
      })
      .addCase(directActiveSubscription.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const adminActions = adminSlice.actions
const adminReducer = adminSlice.reducer
export default adminReducer
