import portfolioService from '@/services/portfolio.service'
import type { AddTransactionPayload } from '@/types/portfolio'
import type { PortfolioState } from '@/types/slices/portfolio'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState: PortfolioState = {
  wallet: [],
  transactions: [],
  loading: false,
  error: null,
  lastUpdated: null
}

export const fetchWallet = createAsyncThunk('portfolio/fetchWallet', async (_, { rejectWithValue }) => {
  try {
    const response = await portfolioService.getAll()
    if (!response) {
      return rejectWithValue('No portfolio data found')
    }

    return response
  } catch (error) {
    return rejectWithValue('Failed to fetch portfolio data')
  }
})

export const fetchTransactions = createAsyncThunk('portfolio/fetchTransactions', async (_, { rejectWithValue }) => {
  try {
    const response = await portfolioService.getHistory()
    if (!response) {
      return rejectWithValue('No transaction history found')
    }
    return response
  } catch (error) {
    return rejectWithValue('Failed to fetch transaction history')
  }
})

export const addTransaction = createAsyncThunk(
  'portfolio/addTransaction',
  async (payload: AddTransactionPayload, { rejectWithValue }) => {
    try {
      const response = await portfolioService.addItem(payload)
      return response
    } catch (error) {
      return rejectWithValue('Failed to add portfolio item')
    }
  }
)

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.wallet = action.payload.items || []
        state.loading = false
        state.lastUpdated = action.payload.updated_at || new Date().toISOString()
        state.error = null
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.wallet = []
      })
      .addCase(addTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload)
        state.loading = false
        state.error = null
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload || []
        state.loading = false
        state.error = null
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const portfolioActions = portfolioSlice.actions

const portfolioReducer = portfolioSlice.reducer
export default portfolioReducer
