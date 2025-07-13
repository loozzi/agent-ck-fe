import type { RecommendationState } from '@/types/recommendation.types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import recommendationService from '@/services/recommendation.service'
import type {
  RecommendationResponse,
  GenerateRecommendationPayload,
  GenerateRecommendationResponse
} from '@/types/recommendation.types'
import { toast } from 'react-toastify'

const initialState: RecommendationState = {
  recommendationData: undefined,
  loading: false,
  error: null
}

export const fetchRecommendations = createAsyncThunk<RecommendationResponse>(
  'recommendation/fetchRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await recommendationService.get()
      return response.data
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể lấy dữ liệu khuyến nghị'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const generateRecommendation = createAsyncThunk<GenerateRecommendationResponse, GenerateRecommendationPayload>(
  'recommendation/generateRecommendation',
  async (data, { rejectWithValue }) => {
    try {
      const response = await recommendationService.generate(data)
      return response.data
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể tạo khuyến nghị'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

const recommendationSlice = createSlice({
  name: 'recommendation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false
        state.recommendationData = action.payload
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(generateRecommendation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(generateRecommendation.fulfilled, (state) => {
        state.loading = false
        toast.success('Khuyến nghị đã được tạo thành công')
      })
      .addCase(generateRecommendation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const recommendationActions = recommendationSlice.actions
const recommendationReducer = recommendationSlice.reducer
export default recommendationReducer
