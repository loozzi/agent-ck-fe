import stockService from '@/services/stock.service'
import type { StockState } from '@/types/slices/stock'
import type { StockFilter } from '@/types/stock'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState: StockState = {
  stocks: [],
  total: 0,
  limit: 10,
  offset: 0,
  loading: false,
  error: null
}

export const fetchAllStocks = createAsyncThunk(
  'stock/fetchAllStocks',
  async (filter: StockFilter, { rejectWithValue }) => {
    try {
      const response = await stockService.getAll(filter)
      return response.data
    } catch (error) {
      return rejectWithValue((error as any).response?.data || 'Failed to fetch stocks')
    }
  }
)

export const fetchStockByTicker = createAsyncThunk(
  'stock/fetchStockByTicker',
  async (ticker: string, { rejectWithValue }) => {
    try {
      const response = await import('@/services/stock.service').then((module) => module.default.getByTicker(ticker))
      return response.data
    } catch (error) {
      return rejectWithValue((error as any).response?.data || 'Failed to fetch stock by ticker')
    }
  }
)

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStocks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllStocks.fulfilled, (state, action) => {
        state.stocks = action.payload.stocks
        state.total = action.payload.total
        state.limit = action.payload.limit
        state.offset = action.payload.offset
        state.loading = false
      })
      .addCase(fetchAllStocks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchStockByTicker.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStockByTicker.fulfilled, (state, action) => {
        const existingIndex = state.stocks.findIndex((stock) => stock.ticker === action.payload.ticker)
        if (existingIndex !== -1) {
          state.stocks[existingIndex] = action.payload // Update existing stock
        } else {
          state.stocks.push(action.payload) // Add new stock
        }
        state.loading = false
      })
      .addCase(fetchStockByTicker.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const stockActions = stockSlice.actions

const stockReducer = stockSlice.reducer
export default stockReducer
