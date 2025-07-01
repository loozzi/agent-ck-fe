import type { SubscriptionState } from '@/types/slices/subscription'
import { createSlice } from '@reduxjs/toolkit'

const initialState: SubscriptionState = {
  subscriptions: [],
  subscriptionStatus: [],
  messages: [],
  isLoading: false,
  error: null
}

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {}
})

export const subscriptionActions = subscriptionSlice.actions

const subscriptionReducer = subscriptionSlice.reducer
export default subscriptionReducer
