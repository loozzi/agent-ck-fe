import PortfolioNewsService from '@/services/portfolioNews.service'
import type { PortfolioNewsByTickerParams, PortfolioNewsFilterParams, PortfolioNewsState } from '@/types/portfolioNews'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState: PortfolioNewsState = {
  news: [],
  total: 0,
  page: 1,
  per_page: 10,
  pages: 0,
  loading: false,
  error: undefined
}

export const fetchPortfolioNewsCurrentUser = createAsyncThunk(
  'portfolioNews/fetchCurrentUser',
  async (params: PortfolioNewsFilterParams, { rejectWithValue }) => {
    try {
      const response = await PortfolioNewsService.getCurrentUser(params)

      if (response.status !== 200) {
        const errorMessage =
          (response as any).response.data?.detail || 'Không thể tải tin tức danh mục đầu tư cho người dùng hiện tại'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }

      const { data } = response
      if (!data || !Array.isArray(data.items)) {
        toast.error('Không có dữ liệu tin tức danh mục đầu tư cho người dùng hiện tại')
        return rejectWithValue('Không có dữ liệu tin tức danh mục đầu tư cho người dùng hiện tại')
      }
      return data
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || 'Không thể tải tin tức danh mục đầu tư cho người dùng hiện tại'
      )
    }
  }
)

export const fetchPortfolioNewsByTicker = createAsyncThunk(
  'portfolioNews/fetchByTicker',
  async ({ params, tickers }: PortfolioNewsByTickerParams, { rejectWithValue }) => {
    try {
      const response = await PortfolioNewsService.getByTicker(params, tickers)

      if (response.status !== 200) {
        const errorMessage =
          (response as any).response.data?.detail || 'Không thể tải tin tức danh mục đầu tư theo mã chứng khoán'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }

      const { data } = response
      if (!data || !Array.isArray(data.items)) {
        toast.error('Không có dữ liệu tin tức danh mục đầu tư theo mã chứng khoán')
        return rejectWithValue('Không có dữ liệu tin tức danh mục đầu tư theo mã chứng khoán')
      }
      return data
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || 'Không thể tải tin tức danh mục đầu tư theo mã chứng khoán'
      )
    }
  }
)

const portfolioNewsSlice = createSlice({
  name: 'portfolioNews',
  initialState,
  reducers: {
    fetchPortfolioNewsStart(state) {
      state.loading = true
      state.error = undefined
    },
    fetchPortfolioNewsSuccess(state, action) {
      const { items, total, page, per_page, pages } = action.payload
      state.news = items
      state.total = total
      state.page = page
      state.per_page = per_page
      state.pages = pages
      state.loading = false
    },
    fetchPortfolioNewsFailure(state, action) {
      state.loading = false
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolioNewsCurrentUser.pending, (state) => {
        state.loading = true
        state.error = undefined
      })
      .addCase(fetchPortfolioNewsCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.news = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.per_page = action.payload.per_page
        state.pages = action.payload.pages
      })
      .addCase(fetchPortfolioNewsCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchPortfolioNewsByTicker.pending, (state) => {
        state.loading = true
        state.error = undefined
      })
      .addCase(fetchPortfolioNewsByTicker.fulfilled, (state, action) => {
        state.loading = false
        state.news = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.per_page = action.payload.per_page
        state.pages = action.payload.pages
      })
      .addCase(fetchPortfolioNewsByTicker.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const portfolioNewsActions = portfolioNewsSlice.actions
const portfolioNewsReducer = portfolioNewsSlice.reducer
export default portfolioNewsReducer
