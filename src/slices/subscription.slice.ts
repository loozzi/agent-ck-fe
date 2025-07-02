import subscriptionService from '@/services/subscription.service'
import type { SubscriptionState } from '@/types/slices/subscription'
import type { SubscriptionUpdateRolePayload } from '@/types/subscription'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState: SubscriptionState = {
  subscriptions: [],
  userSubscriptionStatus: [],
  messages: [],
  isLoading: false,
  error: null
}

export const fetchUserSubscriptionStatus = createAsyncThunk(
  'subscription/fetchUserSubscriptionStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = subscriptionService.allUsers()
      const { data } = await response
      if (!data || !Array.isArray(data)) {
        toast.error('Failed to fetch user subscription status')
        return rejectWithValue('Invalid data format')
      }
      console.log("dta", data)
      return data
    } catch (error) {
      toast.error('Failed to fetch user subscription status')
      return rejectWithValue(error.response?.data?.message || 'An error occurred')
    }
  }
)

export const updateUserRole = createAsyncThunk(
  'subscription/updateUserRole',
  async (payload: SubscriptionUpdateRolePayload, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.updateRole(payload)
      if (response.status !== 200) {
        toast.error('Failed to update user role')
        return rejectWithValue('Failed to update user role')
      }
      toast.success('User role updated successfully')
      return payload
    } catch (error) {
      toast.error('Failed to update user role')
      return rejectWithValue(error.response?.data?.message || 'An error occurred')
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
        const user = state.userSubscriptionStatus.find(user => user.id === user_id)
        if (user) {
          user.role = new_role
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        toast.error(state.error || 'An error occurred while updating user role')
      })
  }
})

export const subscriptionActions = subscriptionSlice.actions

const subscriptionReducer = subscriptionSlice.reducer
export default subscriptionReducer
