import newsService from '@/services/news.service'
import type { GetNewsParams, GetNewsPendingParams } from '@/types/news'
import type { NewsState } from '@/types/slices/news.typs'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState: NewsState = {
  isLoading: false,
  error: null,
  news: [],
  total: 0,
  page: 1,
  perPage: 10,
  pages: 0,
  pendingNews: [],
  latestNews: []
}

export const fetchNews = createAsyncThunk('news/fetchNews', async (params: GetNewsParams, { rejectWithValue }) => {
  try {
    const response = await newsService.getNews(params)
    if (response.status !== 200) {
      const errorMessage = (response as any).response.data?.detail || 'Không thể lấy tin tức'
      return rejectWithValue(errorMessage)
    }
    const { data } = response
    return data
  } catch (error) {
    return rejectWithValue((error as any).response?.data?.message || 'An error occurred')
  }
})

export const fetchPendingNews = createAsyncThunk(
  'news/fetchPendingNews',
  async (params: GetNewsPendingParams, { rejectWithValue }) => {
    try {
      const response = await newsService.getNewsPending(params)
      if (response.status !== 200) {
        const errorMessage = (response as any).response.data?.detail || 'Không thể lấy tin tức đang chờ'
        return rejectWithValue(errorMessage)
      }
      return response.data
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'An error occurred')
    }
  }
)

export const fetchLatestNews = createAsyncThunk(
  'news/fetchLatestNews',
  async (params: GetNewsPendingParams, { rejectWithValue }) => {
    try {
      const response = await newsService.getNewsLatest(params)
      if (response.status !== 200) {
        const errorMessage = (response as any).response.data?.detail || 'Không thể lấy tin tức mới nhất'
        return rejectWithValue(errorMessage)
      }
      return response.data
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'An error occurred')
    }
  }
)

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.isLoading = false
        state.news = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.perPage = action.payload.per_page
        state.pages = action.payload.pages
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchPendingNews.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPendingNews.fulfilled, (state, action) => {
        state.isLoading = false
        state.pendingNews = action.payload
      })
      .addCase(fetchPendingNews.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchLatestNews.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLatestNews.fulfilled, (state, action) => {
        state.isLoading = false
        state.latestNews = action.payload
      })
      .addCase(fetchLatestNews.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const newsActions = newsSlice.actions
const newsReducer = newsSlice.reducer
export default newsReducer
