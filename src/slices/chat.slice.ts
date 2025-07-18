import chatService from '@/services/chat.service'
import type { ChatHistory, ChatHistoryParams, ChatPayload } from '@/types/chat'
import type { ChatState } from '@/types/slices/chat.types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState: ChatState = {
  histories: [],
  sessionInfo: null,
  health: null,
  suggestedQuestions: [],

  loadingHistories: false,
  loadingSessionInfo: false,
  loadingHealth: false,
  error: null,
  cacheCleared: false,
  loadingSend: false
}

export const sendMessage = createAsyncThunk('chat/sendMessage', async (payload: ChatPayload, { rejectWithValue }) => {
  try {
    const response = await chatService.send(payload)
    if (response.status !== 200) {
      const errorMessage = (response as any).response?.data?.detail || 'Không thể gửi tin nhắn. Vui lòng thử lại sau.'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
    return response.data as ChatHistory
  } catch (error) {
    return rejectWithValue('Không thể gửi tin nhắn. Vui lòng thử lại sau.')
  }
})

export const fetchChatHistories = createAsyncThunk(
  'chat/fetchHistories',
  async (params: ChatHistoryParams, { rejectWithValue }) => {
    try {
      const response = await chatService.history(params)
      if (response.status !== 200) {
        const errorMessage =
          (response as any).response?.data?.detail || 'Không thể lấy lịch sử trò chuyện. Vui lòng thử lại sau.'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      return response.data
    } catch (error) {
      return rejectWithValue('Không thể lấy lịch sử trò chuyện. Vui lòng thử lại sau.')
    }
  }
)

export const clearChatCache = createAsyncThunk('chat/clearCache', async (_, { rejectWithValue }) => {
  try {
    const response = await chatService.clearCache()
    if (response.status !== 200) {
      const errorMessage =
        (response as any).response?.data?.detail || 'Không thể xóa bộ nhớ cache trò chuyện. Vui lòng thử lại sau.'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
    return true // Indicate success
  } catch (error) {
    return rejectWithValue('Không thể xóa bộ nhớ cache trò chuyện. Vui lòng thử lại sau.')
  }
})

export const fetchChatSessionInfo = createAsyncThunk('chat/fetchSessionInfo', async (_, { rejectWithValue }) => {
  try {
    const response = await chatService.session()
    if (response.status !== 200) {
      const errorMessage =
        (response as any).response?.data?.detail || 'Không thể lấy thông tin phiên trò chuyện. Vui lòng thử lại sau.'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
    return response.data
  } catch (error) {
    return rejectWithValue('Không thể lấy thông tin phiên trò chuyện. Vui lòng thử lại sau.')
  }
})

export const fetchChatHealth = createAsyncThunk('chat/fetchHealth', async (_, { rejectWithValue }) => {
  try {
    const response = await chatService.health()
    if (response.status !== 200) {
      const errorMessage =
        (response as any).response?.data?.detail ||
        'Không thể lấy trạng thái sức khỏe trò chuyện. Vui lòng thử lại sau.'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
    return response.data
  } catch (error) {
    return rejectWithValue('Không thể lấy trạng thái sức khỏe trò chuyện. Vui lòng thử lại sau.')
  }
})

export const deleteChatHistories = createAsyncThunk('chat/deleteHistories', async (_, { rejectWithValue }) => {
  try {
    const response = await chatService.clear()
    if (response.status !== 200) {
      const errorMessage =
        (response as any).response?.data?.detail || 'Không thể xóa lịch sử trò chuyện. Vui lòng thử lại sau.'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
    return true // Indicate success
  } catch (error) {
    return rejectWithValue('Không thể xóa lịch sử trò chuyện. Vui lòng thử lại sau.')
  }
})

export const fetchSuggestedQuestions = createAsyncThunk(
  'chat/fetchSuggestedQuestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatService.getSuggestedQuestions()
      if (response.status !== 200) {
        const errorMessage =
          (response as any).response?.data?.detail || 'Không thể lấy câu hỏi gợi ý. Vui lòng thử lại sau.'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      return response.data.suggested_questions
    } catch (error) {
      return rejectWithValue('Không thể lấy câu hỏi gợi ý. Vui lòng thử lại sau.')
    }
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Define your reducers here
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loadingSend = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loadingSend = false
        const newMessage = action.payload
        if (newMessage) {
          state.histories.push(newMessage)
        }
        state.error = null
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loadingSend = false
        state.error = action.payload as string
      })
      .addCase(fetchChatHistories.pending, (state) => {
        state.loadingHistories = true
        state.error = null
      })
      .addCase(fetchChatHistories.fulfilled, (state, action) => {
        state.loadingHistories = false
        state.histories = action.payload
        state.error = null
      })
      .addCase(fetchChatHistories.rejected, (state, action) => {
        state.loadingHistories = false
        state.error = action.payload as string
      })
      .addCase(clearChatCache.pending, (state) => {
        state.cacheCleared = false
        state.error = null
      })
      .addCase(clearChatCache.fulfilled, (state) => {
        state.cacheCleared = true
        state.error = null
      })
      .addCase(clearChatCache.rejected, (state, action) => {
        state.cacheCleared = false
        state.error = action.payload as string
      })
      .addCase(fetchChatSessionInfo.pending, (state) => {
        state.loadingSessionInfo = true
        state.error = null
      })
      .addCase(fetchChatSessionInfo.fulfilled, (state, action) => {
        state.loadingSessionInfo = false
        state.sessionInfo = action.payload
        state.error = null
      })
      .addCase(fetchChatSessionInfo.rejected, (state, action) => {
        state.loadingSessionInfo = false
        state.error = action.payload as string
      })
      .addCase(fetchChatHealth.pending, (state) => {
        state.loadingHealth = true
        state.error = null
      })
      .addCase(fetchChatHealth.fulfilled, (state, action) => {
        state.loadingHealth = false
        state.health = action.payload
        state.error = null
      })
      .addCase(fetchChatHealth.rejected, (state, action) => {
        state.loadingHealth = false
        state.error = action.payload as string
      })
      .addCase(deleteChatHistories.pending, (state) => {
        state.loadingHistories = true
        state.error = null
      })
      .addCase(deleteChatHistories.fulfilled, (state) => {
        state.loadingHistories = false
        state.histories = []
        state.error = null
      })
      .addCase(deleteChatHistories.rejected, (state, action) => {
        state.loadingHistories = false
        state.error = action.payload as string
      })
      .addCase(fetchSuggestedQuestions.pending, (state) => {
        state.error = null
      })
      .addCase(fetchSuggestedQuestions.fulfilled, (state, action) => {
        state.suggestedQuestions = action.payload
        state.error = null
      })
      .addCase(fetchSuggestedQuestions.rejected, (state, action) => {
        state.error = action.payload as string
        state.suggestedQuestions = []
      })
  }
})

export const chatActions = chatSlice.actions
const chatReducer = chatSlice.reducer

export default chatReducer
