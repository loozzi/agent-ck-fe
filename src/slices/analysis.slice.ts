import analysisService from '@/services/analysis.service'
import type { AnalysisRequest, AnalysisResponse, AnalysisState, TickerAnalysisResponse } from '@/types/analysis.types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState: AnalysisState = {
  loading: false,
  error: null,
  analyses: [],
  totalCount: 0,
  filtersApplied: {},
  customAnalysis: null,
  tickerAnalysis: null
}

export const fetchAnalysis = createAsyncThunk<AnalysisResponse, AnalysisRequest>(
  'analysis/fetchAnalysis',
  async (params, { rejectWithValue }) => {
    try {
      const response = await analysisService.getAnalysis(params)
      return response.data
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể lấy dữ liệu phân tích'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const fetchTickerAnalysis = createAsyncThunk<TickerAnalysisResponse, string>(
  'analysis/fetchTickerAnalysis',
  async (ticker, { rejectWithValue }) => {
    try {
      const response = await analysisService.getTickerAnalysis(ticker)
      return response.data
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể lấy dữ liệu phân tích cổ phiếu'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalysis.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAnalysis.fulfilled, (state, action) => {
        state.loading = false
        state.analyses = action.payload.analyses
        state.totalCount = action.payload.total_count
        state.filtersApplied = action.payload.filters_applied || {}
      })
      .addCase(fetchAnalysis.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchTickerAnalysis.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTickerAnalysis.fulfilled, (state, action) => {
        state.loading = false
        state.tickerAnalysis = action.payload
      })
      .addCase(fetchTickerAnalysis.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

const analysisReducer = analysisSlice.reducer
export default analysisReducer
