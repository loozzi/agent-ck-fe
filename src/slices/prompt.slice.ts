import promtService from '@/services/prompt.service'
import type { CreatePromptPayload, DocumentUploadPayload, UpdatePromtPayload } from '@/types/prompts'
import type { PromptState } from '@/types/slices/prompt.type'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState: PromptState = {
  prompts: [],
  promptDetail: null,
  stats: null,
  categorizedContent: null,
  isLoading: false,
  error: null
}

export const createPrompt = createAsyncThunk(
  'prompt/createPrompt',
  async (payload: CreatePromptPayload, { rejectWithValue }) => {
    try {
      const response = await promtService.create(payload)
      if (response.status !== 200) {
        const errorMessage = (response as any).response.data.detail || 'Không thể tạo prompt'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }

      return response.data
    } catch (error) {
      return rejectWithValue('Không thể tạo prompt')
    }
  }
)

export const getPrompts = createAsyncThunk(
  'prompt/getPrompts',
  async (params: { category?: string; is_active?: boolean }, { rejectWithValue }) => {
    try {
      const response = await promtService.getPrompts(params)
      if (response.status !== 200) {
        const errorMessage = (response as any).response.data.detail || 'Không thể lấy danh sách prompt'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }

      return response.data
    } catch (error) {
      return rejectWithValue('Không thể lấy danh sách prompt')
    }
  }
)

export const getPromptDetail = createAsyncThunk('prompt/getPromptDetail', async (id: string, { rejectWithValue }) => {
  try {
    const response = await promtService.getPromptDetail(id)
    if (response.status !== 200) {
      const errorMessage = (response as any).response.data.detail || 'Không thể lấy chi tiết prompt'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }

    return response.data
  } catch (error) {
    return rejectWithValue('Không thể lấy chi tiết prompt')
  }
})

export const updatePrompt = createAsyncThunk(
  'prompt/updatePrompt',
  async ({ id, data }: { id: string; data: UpdatePromtPayload }, { rejectWithValue }) => {
    try {
      const response = await promtService.update(id, data)
      if (response.status !== 200) {
        const errorMessage = (response as any).response.data.detail || 'Không thể cập nhật prompt'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }

      return response.data
    } catch (error) {
      return rejectWithValue('Không thể cập nhật prompt')
    }
  }
)

export const removePrompt = createAsyncThunk('prompt/removePrompt', async (id: string, { rejectWithValue }) => {
  try {
    const response = await promtService.remove(id)
    if (response.status !== 200) {
      const errorMessage = (response as any).response.data.detail || 'Không thể xóa prompt'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }

    return id
  } catch (error) {
    return rejectWithValue('Không thể xóa prompt')
  }
})

export const getStats = createAsyncThunk('prompt/getStats', async (_, { rejectWithValue }) => {
  try {
    const response = await promtService.getStats()
    if (response.status !== 200) {
      const errorMessage = (response as any).response.data.detail || 'Không thể lấy thống kê'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }

    return response.data
  } catch (error) {
    return rejectWithValue('Không thể lấy thống kê')
  }
})

export const uploadDocument = createAsyncThunk(
  'prompt/uploadDocument',
  async (payload: DocumentUploadPayload, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('file', payload.file)
      formData.append('title', payload.title)
      if (payload.description) {
        formData.append('description', payload.description)
      }
      if (payload.category) {
        formData.append('category', Array.isArray(payload.category) ? payload.category.join(',') : payload.category)
      }

      const response = await promtService.uploadDocument(formData)
      if (response.status !== 200) {
        const errorMessage = (response as any).response.data.detail || 'Không thể tải lên tài liệu'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }

      return response.data
    } catch (error) {
      return rejectWithValue('Không thể tải lên tài liệu')
    }
  }
)

export const getCategorizedContent = createAsyncThunk(
  'prompt/getCategorizedContent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await promtService.getCategorizedContent()
      if (response.status !== 200) {
        const errorMessage = (response as any).response.data.detail || 'Không thể lấy nội dung phân loại'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }

      return response.data
    } catch (error) {
      return rejectWithValue('Không thể lấy nội dung phân loại')
    }
  }
)

const promptSlice = createSlice({
  name: 'prompt',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPrompt.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createPrompt.fulfilled, (state, action) => {
        state.isLoading = false
        state.prompts.push(action.payload)
        toast.success('Tạo prompt thành công')
      })
      .addCase(createPrompt.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      .addCase(getPrompts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getPrompts.fulfilled, (state, action) => {
        state.isLoading = false
        state.prompts = action.payload
      })
      .addCase(getPrompts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      .addCase(getPromptDetail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getPromptDetail.fulfilled, (state, action) => {
        state.isLoading = false
        state.promptDetail = action.payload
      })
      .addCase(getPromptDetail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      .addCase(updatePrompt.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updatePrompt.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.prompts.findIndex((prompt) => prompt.id === action.payload.id)
        if (index !== -1) {
          state.prompts[index] = action.payload
          toast.success('Cập nhật prompt thành công')
        }
      })
      .addCase(updatePrompt.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      .addCase(removePrompt.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(removePrompt.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.prompts.findIndex((prompt) => prompt.id === action.payload)
        if (index !== -1) {
          state.prompts.splice(index, 1)
          toast.success('Xóa prompt thành công')
        }
      })
      .addCase(removePrompt.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      .addCase(getStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = action.payload
      })
      .addCase(getStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(uploadDocument.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isLoading = false
        state.prompts.push(action.payload)
        toast.success('Tải lên tài liệu thành công')
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(getCategorizedContent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getCategorizedContent.fulfilled, (state, action) => {
        state.isLoading = false
        state.categorizedContent = action.payload
      })
      .addCase(getCategorizedContent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const promptActions = promptSlice.actions

const promptReducer = promptSlice.reducer
export default promptReducer
