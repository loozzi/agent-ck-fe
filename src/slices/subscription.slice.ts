import subscriptionService from '@/services/subscription.service'
import type { SubscriptionState } from '@/types/slices/subscription'
import type {
  CreateSubscriptionPricingPayload,
  CreateSupscriptionPayload,
  SubscriptionCodeParams,
  SubscriptionPurchasePayload,
  SubscriptionUpdateRolePayload
} from '@/types/subscription'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState: SubscriptionState = {
  subscriptionCodes: [],
  userSubscriptionStatus: [],
  messages: [],
  listPricings: [],
  nextTierInfo: null,
  purchaseHistory: [],
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
      const { data } = response
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
      toast.error('Không thể tạo mã đăng ký')
      return rejectWithValue('Không thể tạo mã đăng ký')
    }
  }
)

export const deleteSubscriptionCode = createAsyncThunk(
  'subscription/deleteSubscriptionCode',
  async (codeId: string, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.deleteSubscriptionCode(codeId)
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể xóa mã đăng ký'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      toast.success('Mã đăng ký đã được xóa thành công')
      return codeId
    } catch (error) {
      toast.error('Không thể xóa mã đăng ký')
      return rejectWithValue('Không thể xóa mã đăng ký')
    }
  }
)

export const revorkCode = createAsyncThunk('subscription/revorkCode', async (userId: string, { rejectWithValue }) => {
  try {
    const response = await subscriptionService.revorkCode(userId)
    if (response.status !== 200) {
      const errorMessage = (response as any).response?.data?.detail || 'Không thể revork mã đăng ký'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
    toast.success('Mã đăng ký đã được revork thành công')
    return userId
  } catch (error) {
    toast.error('Không thể revork mã đăng ký')
    return rejectWithValue('Không thể revork mã đăng ký')
  }
})

export const fetchSubscriptionPricings = createAsyncThunk(
  'subscription/fetchSubscriptionPricings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getSubscriptionPricings()
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể lấy thông tin giá đăng ký'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      return response.data
    } catch (error) {
      toast.error('Failed to fetch subscription pricings')
      return rejectWithValue((error as any).response?.data?.message || 'An error occurred')
    }
  }
)

export const fetchSubscriptionPurchaseHistory = createAsyncThunk(
  'subscription/fetchSubscriptionPurchaseHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getSubscriptionPurchaseHistory()
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể lấy lịch sử mua đăng ký'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      return response.data
    } catch (error) {
      toast.error('Failed to fetch subscription purchase history')
      return rejectWithValue((error as any).response?.data?.message || 'An error occurred')
    }
  }
)

export const fetchNextTierInfo = createAsyncThunk('subscription/fetchNextTierInfo', async (_, { rejectWithValue }) => {
  try {
    const response = await subscriptionService.getNextTierInfo()
    if (response.status !== 200) {
      const errorMessage = (response as any).response?.data?.detail || 'Không thể lấy thông tin cấp độ tiếp theo'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
    return response.data
  } catch (error) {
    toast.error('Failed to fetch next tier info')
    return rejectWithValue((error as any).response?.data?.message || 'An error occurred')
  }
})

export const purchaseSubscription = createAsyncThunk(
  'subscription/purchaseSubscription',
  async (payload: SubscriptionPurchasePayload, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.purchaseSubscription(payload)
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể mua đăng ký'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      toast.success('Đăng ký đã được mua thành công')
      return response.data
    } catch (error) {
      toast.error('Failed to purchase subscription')
      return rejectWithValue((error as any).response?.data?.message || 'An error occurred')
    }
  }
)

export const createSubscriptionPricing = createAsyncThunk(
  'subscription/createSubscriptionPricing',
  async (payload: CreateSubscriptionPricingPayload, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.createSubscriptionPricing(payload)
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể tạo giá đăng ký'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      toast.success('Giá đăng ký đã được tạo thành công')
      return response.data
    } catch (error) {
      toast.error('Failed to create subscription pricing')
      return rejectWithValue((error as any).response?.data?.message || 'An error occurred')
    }
  }
)

export const updateSubscriptionPricing = createAsyncThunk(
  'subscription/updateSubscriptionPricing',
  async ({ id, data }: { id: string; data: Partial<CreateSubscriptionPricingPayload> }, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.updateSubscriptionPricing(id, data)
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể cập nhật giá đăng ký'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      toast.success('Giá đăng ký đã được cập nhật thành công')
      return response.data
    } catch (error) {
      toast.error('Failed to update subscription pricing')
      return rejectWithValue((error as any).response?.data?.message || 'An error occurred')
    }
  }
)

export const deleteSubscriptionPricing = createAsyncThunk(
  'subscription/deleteSubscriptionPricing',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.deleteSubscriptionPricing(id)
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể xóa giá đăng ký'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      toast.success('Giá đăng ký đã được xóa thành công')
      return id
    } catch (error) {
      toast.error('Failed to delete subscription pricing')
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
      .addCase(deleteSubscriptionCode.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteSubscriptionCode.fulfilled, (state, action) => {
        state.isLoading = false
        state.subscriptionCodes = state.subscriptionCodes.filter((code) => code.id !== action.payload)
      })
      .addCase(deleteSubscriptionCode.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(revorkCode.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(revorkCode.fulfilled, (state, action) => {
        state.isLoading = false
        state.userSubscriptionStatus = state.userSubscriptionStatus.filter((user) => user.id !== action.payload)
      })
      .addCase(revorkCode.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchSubscriptionPricings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSubscriptionPricings.fulfilled, (state, action) => {
        state.isLoading = false
        state.listPricings = action.payload
      })
      .addCase(fetchSubscriptionPricings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchSubscriptionPurchaseHistory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSubscriptionPurchaseHistory.fulfilled, (state, action) => {
        state.isLoading = false
        state.purchaseHistory = action.payload
      })
      .addCase(fetchSubscriptionPurchaseHistory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchNextTierInfo.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchNextTierInfo.fulfilled, (state, action) => {
        state.isLoading = false
        state.nextTierInfo = action.payload
      })
      .addCase(fetchNextTierInfo.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(purchaseSubscription.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(purchaseSubscription.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(purchaseSubscription.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createSubscriptionPricing.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createSubscriptionPricing.fulfilled, (state, action) => {
        state.isLoading = false
        state.listPricings.push(action.payload)
      })
      .addCase(createSubscriptionPricing.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateSubscriptionPricing.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateSubscriptionPricing.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.listPricings.findIndex((pricing) => pricing.id === action.payload.id)
        if (index !== -1) {
          state.listPricings[index] = action.payload
        }
      })
      .addCase(updateSubscriptionPricing.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteSubscriptionPricing.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteSubscriptionPricing.fulfilled, (state, action) => {
        state.isLoading = false
        state.listPricings = state.listPricings.filter((pricing) => pricing.id !== action.payload)
      })
      .addCase(deleteSubscriptionPricing.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true
          state.error = null
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.isLoading = false
        }
      )
  }
})

export const subscriptionActions = subscriptionSlice.actions

const subscriptionReducer = subscriptionSlice.reducer
export default subscriptionReducer
