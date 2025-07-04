import subscriptionService from '@/services/subscription.service'
import type { SubscriptionState } from '@/types/slices/subscription'
import type {
  CreateSupscriptionPayload,
  SubscriptionCodeParams,
  SubscriptionUpdateRolePayload
} from '@/types/subscription'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState: SubscriptionState = {
  subscriptionCodes: [],
  userSubscriptionStatus: [],
  messages: [],
  isLoading: false,
  error: null
}

export const fetchUserSubscriptionStatus = createAsyncThunk(
  'subscription/fetchUserSubscriptionStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.allUsers()
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể lấy trạng thái đăng ký người dùng'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      const { data } = await response
      if (!data || !Array.isArray(data)) {
        toast.error('Không thể lấy trạng thái đăng ký người dùng')
        return rejectWithValue('Không thể lấy trạng thái đăng ký người dùng')
      }
      return data
    } catch (error) {
      toast.error('Failed to fetch user subscription status')
      return rejectWithValue((error as any).response?.data?.message || 'An error occurred')
    }
  }
)

export const updateUserRole = createAsyncThunk(
  'subscription/updateUserRole',
  async (payload: SubscriptionUpdateRolePayload, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.updateRole(payload)
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể cập nhật vai trò người dùng'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      toast.success(response.data.message)
      return payload
    } catch (error) {
      toast.error('Failed to update user role')
      return rejectWithValue((error as any).response?.data?.message || 'An error occurred')
    }
  }
)

export const fetchSubScriptionCodes = createAsyncThunk(
  'subscription/fetchSubScriptionCodes',
  async (payload: SubscriptionCodeParams, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getSubscriptionCodes(payload)
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể lấy mã đăng ký'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }

      if (!response.data || !Array.isArray(response.data)) {
        toast.error('Không thể lấy mã đăng ký')
        return rejectWithValue('Không thể lấy mã đăng ký')
      }
      return response.data
    } catch (error) {
      toast.error('Failed to fetch subscription codes')
      return rejectWithValue((error as any).response?.data?.message || 'An error occurred')
    }
  }
)

export const createSubscriptionCode = createAsyncThunk(
  'subscription/createSubscriptionCode',
  async (payload: CreateSupscriptionPayload, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.createSubscription(payload)
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể tạo mã đăng ký'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }

      if (!response.data) {
        toast.error('Không thể tạo mã đăng ký')
        return rejectWithValue('Không thể tạo mã đăng ký')
      }
      toast.success('Mã đăng ký đã được tạo thành công')
      return response.data
    } catch (error) {
      toast.error('Failed to create subscription code')
      return rejectWithValue((error as any).response?.data?.message || 'An error occurred')
    }
  }
)

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSubscriptionStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserSubscriptionStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.userSubscriptionStatus = action.payload
      })
      .addCase(fetchUserSubscriptionStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateUserRole.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isLoading = false
        const { user_id, new_role } = action.payload
        const user = state.userSubscriptionStatus.find((user) => user.id === user_id)
        if (user) {
          user.role = new_role
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchSubScriptionCodes.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSubScriptionCodes.fulfilled, (state, action) => {
        state.isLoading = false
        state.subscriptionCodes = action.payload
      })
      .addCase(fetchSubScriptionCodes.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createSubscriptionCode.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createSubscriptionCode.fulfilled, (state, action) => {
        state.isLoading = false
        state.subscriptionCodes.push(action.payload)
      })
      .addCase(createSubscriptionCode.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const subscriptionActions = subscriptionSlice.actions

const subscriptionReducer = subscriptionSlice.reducer
export default subscriptionReducer
