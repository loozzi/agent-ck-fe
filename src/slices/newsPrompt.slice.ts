import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import newsPromptService from '@/services/newsPrompt.service'
import type {
  GetNewsPromptsParams,
  CreateNewsPromptPayload,
  GetNewsPromptsResponse,
  NewsPrompt,
  NewsPromptState,
  TestNewsPromptPayload,
  TestNewsPromptResponse
} from '@/types/news_prompt'

const initialState: NewsPromptState = {
  prompts: [],
  isLoading: false,
  error: undefined,
  total: 0,
  page: 1,
  per_page: 10
}

export const fetchNewsPrompts = createAsyncThunk(
  'newsPrompt/fetchNewsPrompts',
  async (params: GetNewsPromptsParams, { rejectWithValue }) => {
    try {
      const response = await newsPromptService.getNewsPrompts(params)
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể lấy danh sách prompts'
        return rejectWithValue(errorMessage)
      }
      const { data } = response
      if (!data || !Array.isArray(data.prompts)) {
        return rejectWithValue('Không có dữ liệu prompts')
      }
      return data as GetNewsPromptsResponse
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Không thể lấy danh sách prompts')
    }
  }
)

export const fetchNewsPromptsById = createAsyncThunk(
  'newsPrompt/fetchNewsPromptById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await newsPromptService.getNewsPromptById(id)
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể lấy prompt'
        return rejectWithValue(errorMessage)
      }
      return response.data as NewsPrompt
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Không thể lấy prompt')
    }
  }
)

export const createNewsPrompt = createAsyncThunk(
  'newsPrompt/createNewsPrompt',
  async (payload: CreateNewsPromptPayload, { rejectWithValue }) => {
    try {
      const response = await newsPromptService.createNewsPrompt(payload)
      if (response.status !== 201) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể tạo prompt'
        return rejectWithValue(errorMessage)
      }
      return response.data as NewsPrompt
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Không thể tạo prompt')
    }
  }
)

export const testNewsPrompt = createAsyncThunk(
  'newsPrompt/testNewsPrompt',
  async (payload: TestNewsPromptPayload, { rejectWithValue }) => {
    try {
      const response = await newsPromptService.testNewsPrompt(payload)
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể kiểm tra prompt'
        return rejectWithValue(errorMessage)
      }
      return response.data as TestNewsPromptResponse
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Không thể kiểm tra prompt')
    }
  }
)

export const updateNewsPrompt = createAsyncThunk(
  'newsPrompt/updateNewsPrompt',
  async (payload: { id: string; data: Partial<CreateNewsPromptPayload> }, { rejectWithValue }) => {
    try {
      const response = await newsPromptService.updateNewsPrompt(payload.id, payload.data)
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể cập nhật prompt'
        return rejectWithValue(errorMessage)
      }
      return response.data as NewsPrompt
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Không thể cập nhật prompt')
    }
  }
)

export const deleteNewsPrompt = createAsyncThunk(
  'newsPrompt/deleteNewsPrompt',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await newsPromptService.deleteNewsPrompt(id)
      if (response.status !== 204) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể xóa prompt'
        return rejectWithValue(errorMessage)
      }
      return id
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Không thể xóa prompt')
    }
  }
)

const newsPromptSlice = createSlice({
  name: 'newsPrompt',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsPrompts.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(fetchNewsPrompts.fulfilled, (state, action) => {
        state.prompts = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.per_page = action.payload.per_page
        state.isLoading = false
      })
      .addCase(fetchNewsPrompts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createNewsPrompt.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(createNewsPrompt.fulfilled, (state, action) => {
        state.prompts.unshift(action.payload)
        state.isLoading = false
      })
      .addCase(createNewsPrompt.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateNewsPrompt.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(updateNewsPrompt.fulfilled, (state, action) => {
        const index = state.prompts.findIndex((prompt) => prompt.id === action.payload.id)
        if (index !== -1) {
          state.prompts[index] = action.payload
        }
        state.isLoading = false
      })
      .addCase(updateNewsPrompt.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteNewsPrompt.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(deleteNewsPrompt.fulfilled, (state, action) => {
        state.prompts = state.prompts.filter((prompt) => prompt.id !== action.payload)
        state.isLoading = false
      })
      .addCase(deleteNewsPrompt.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(testNewsPrompt.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(testNewsPrompt.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(testNewsPrompt.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchNewsPromptsById.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(fetchNewsPromptsById.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(fetchNewsPromptsById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

const newsPromptReducer = newsPromptSlice.reducer
export default newsPromptReducer
