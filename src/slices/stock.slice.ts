import stockService from '@/services/stock.service'
import type { StockState } from '@/types/slices/stock'
import type { StockFilter, StockSearchParams } from '@/types/stock'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

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
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể lấy danh sách cổ phiếu'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      return response.data
    } catch (error) {
      return rejectWithValue('Không thể lấy danh sách cổ phiếu. Vui lòng thử lại sau.')
    }
  }
)

export const fetchStockByTicker = createAsyncThunk(
  'stock/fetchStockByTicker',
  async (ticker: string, { rejectWithValue }) => {
    try {
      const response = await stockService.getByTicker(ticker)
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể lấy thông tin cổ phiếu'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      return response.data
    } catch (error) {
      return rejectWithValue('Không thể lấy thông tin cổ phiếu. Vui lòng thử lại sau.')
    }
  }
)

export const fetchListStocksByName = createAsyncThunk(
  'stock/fetchListStocksByName',
  async (params: StockSearchParams, { rejectWithValue }) => {
    try {
      const response = await stockService.search(params)
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể tìm kiếm cổ phiếu'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      return response.data
    } catch (error) {
      return rejectWithValue('Không thể tìm kiếm cổ phiếu. Vui lòng thử lại sau.')
    }
  }
)

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListStocksByName.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchListStocksByName.fulfilled, (state, action) => {
        state.stocks = action.payload.stocks
        state.total = action.payload.total
        state.limit = action.payload.limit
        state.offset = action.payload.offset
        state.loading = false
      })
      .addCase(fetchListStocksByName.rejected, (state, action) => {
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
