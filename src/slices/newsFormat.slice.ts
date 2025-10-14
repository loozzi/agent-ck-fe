import newsFormatService from '@/services/newsFormat.service'
import type {
  GetNewsFormatsParams,
  NewsFormatCheckConflictPayload,
  NewsFormatCreatePayload,
  NewsFormatState,
  TestNewsFormatPayload
} from '@/types/news_format'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState: NewsFormatState = {
  formats: [],
  conflictFormat: undefined,
  total: 0,
  page: 1,
  per_page: 10,
  loadingFetchFormats: false,
  loadingCreateFormat: false,
  loadingUpdateFormat: false,
  loadingDeleteFormat: false,
  loadingTestFormat: false
}

export const fetchNewsFormats = createAsyncThunk(
  'newsFormat/fetchNewsFormats',
  async (params: GetNewsFormatsParams, { rejectWithValue }) => {
    try {
      const response = await newsFormatService.getFormats(params)
      if (response.status !== 200) {
        toast.error('Failed to fetch news formats')
        return rejectWithValue((response as any).response?.data || 'Failed to fetch news formats')
      }
      return response.data
    } catch (error) {
      toast.error('Failed to fetch news formats')
      return rejectWithValue(error)
    }
  }
)

export const createNewsFormat = createAsyncThunk(
  'newsFormat/createNewsFormat',
  async (payload: NewsFormatCreatePayload, { rejectWithValue }) => {
    try {
      const response = await newsFormatService.createFormat(payload)
      if (response.status !== 200) {
        toast.error('Failed to create news format')
        return rejectWithValue((response as any).response?.data || 'Failed to create news format')
      }
      return response.data
    } catch (error) {
      toast.error('Failed to create news format')
      return rejectWithValue(error)
    }
  }
)

export const updateNewsFormat = createAsyncThunk(
  'newsFormat/updateNewsFormat',
  async ({ id, payload }: { id: string; payload: Partial<NewsFormatCreatePayload> }, { rejectWithValue }) => {
    try {
      const response = await newsFormatService.updateFormat(id, payload)
      if (response.status !== 200) {
        toast.error('Failed to update news format')
        return rejectWithValue((response as any).response?.data || 'Failed to update news format')
      }
      return response.data
    } catch (error) {
      toast.error('Failed to update news format')
      return rejectWithValue(error)
    }
  }
)

export const deleteNewsFormat = createAsyncThunk(
  'newsFormat/deleteNewsFormat',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await newsFormatService.deleteFormat(id)
      if (response.status !== 200) {
        toast.error('Failed to delete news format')
        return rejectWithValue((response as any).response?.data || 'Failed to delete news format')
      }
      return response.data
    } catch (error) {
      toast.error('Failed to delete news format')
      return rejectWithValue(error)
    }
  }
)

export const testNewsFormat = createAsyncThunk(
  'newsFormat/testNewsFormat',
  async (payload: TestNewsFormatPayload, { rejectWithValue }) => {
    try {
      const response = await newsFormatService.testFormat(payload)
      if (response.status !== 200) {
        toast.error('Failed to test news format')
        return rejectWithValue((response as any).response?.data || 'Failed to test news format')
      }
      return response.data
    } catch (error) {
      toast.error('Failed to test news format')
      return rejectWithValue(error)
    }
  }
)

export const checkNewsFormatConflict = createAsyncThunk(
  'newsFormat/checkNewsFormatConflict',
  async (payload: NewsFormatCheckConflictPayload, { rejectWithValue }) => {
    try {
      const response = await newsFormatService.checkFormatConflict(payload)
      if (response.status !== 200) {
        toast.error('Failed to check news format conflict')
        return rejectWithValue((response as any).response?.data || 'Failed to check news format conflict')
      }
      return response.data
    } catch (error) {
      toast.error('Failed to check news format conflict')
      return rejectWithValue(error)
    }
  }
)

const newsFormatSlice = createSlice({
  name: 'newsFormat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsFormats.pending, (state) => {
        state.loadingFetchFormats = true
      })
      .addCase(fetchNewsFormats.fulfilled, (state, action) => {
        state.loadingFetchFormats = false
        state.formats = action.payload.formats
        state.total = action.payload.total
        state.page = action.payload.page
        state.per_page = action.payload.per_page
      })
      .addCase(fetchNewsFormats.rejected, (state) => {
        state.loadingFetchFormats = false
      })
      .addCase(createNewsFormat.pending, (state) => {
        state.loadingCreateFormat = true
      })
      .addCase(createNewsFormat.fulfilled, (state, action) => {
        state.loadingCreateFormat = false
        state.formats.unshift(action.payload)
        state.total += 1
      })
      .addCase(createNewsFormat.rejected, (state) => {
        state.loadingCreateFormat = false
      })
      .addCase(updateNewsFormat.pending, (state) => {
        state.loadingUpdateFormat = true
      })
      .addCase(updateNewsFormat.fulfilled, (state, action) => {
        state.loadingUpdateFormat = false
        const index = state.formats.findIndex((format) => format.id === action.payload.id)
        if (index !== -1) {
          state.formats[index] = action.payload
        }
      })
      .addCase(updateNewsFormat.rejected, (state) => {
        state.loadingUpdateFormat = false
      })
      .addCase(deleteNewsFormat.pending, (state) => {
        state.loadingDeleteFormat = true
      })
      .addCase(deleteNewsFormat.fulfilled, (state, action) => {
        state.loadingDeleteFormat = false
        state.formats = state.formats.filter((format) => format.id !== action.payload.id)
        state.total -= 1
      })
      .addCase(deleteNewsFormat.rejected, (state) => {
        state.loadingDeleteFormat = false
      })
      .addCase(testNewsFormat.pending, (state) => {
        state.loadingTestFormat = true
      })
      .addCase(testNewsFormat.fulfilled, (state) => {
        state.loadingTestFormat = false
      })
      .addCase(testNewsFormat.rejected, (state) => {
        state.loadingTestFormat = false
      })
      .addCase(checkNewsFormatConflict.pending, (_state) => {
        // No loading state for conflict check
      })
      .addCase(checkNewsFormatConflict.fulfilled, (state, action) => {
        // No loading state for conflict check
        state.conflictFormat = action.payload.conflicting_format
      })
      .addCase(checkNewsFormatConflict.rejected, (_state) => {
        // No loading state for conflict check
      })
  }
})

const newsFormatReducer = newsFormatSlice.reducer
export default newsFormatReducer
