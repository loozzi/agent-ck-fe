import chatService from '@/services/chat.service'
import type { ChatHistory, ChatHistoryParams, ChatPayload } from '@/types/chat'
import type { ChatState } from '@/types/slices/chat.types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState: ChatState = {
  histories: [],
  sessionInfo: null,
  health: null,

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
      return rejectWithValue('Failed to send message')
    }
    return response.data as ChatHistory

  } catch (error) {
    return rejectWithValue('Failed to send message')
  }
})

export const fetchChatHistories = createAsyncThunk(
  'chat/fetchHistories',
  async (params: ChatHistoryParams, { rejectWithValue }) => {
    try {
      const response = await chatService.history(params)
      if (response.status !== 200) {
        return rejectWithValue('Failed to fetch chat histories')
      }
      return response.data
    } catch (error) {
      return rejectWithValue('Failed to fetch chat histories')
    }
  }
)

export const clearChatCache = createAsyncThunk('chat/clearCache', async (_, { rejectWithValue }) => {
  try {
    const response = await chatService.clearCache()
    if (response.status !== 200) {
      return rejectWithValue('Failed to clear chat cache')
    }
    return true // Indicate success
  } catch (error) {
    return rejectWithValue('Failed to clear chat cache')
  }
})

export const fetchChatSessionInfo = createAsyncThunk('chat/fetchSessionInfo', async (_, { rejectWithValue }) => {
  try {
    const response = await chatService.session()
    if (response.status !== 200) {
      return rejectWithValue('Failed to fetch chat session info')
    }
    return response.data
  } catch (error) {
    return rejectWithValue('Failed to fetch chat session info')
  }
})

export const fetchChatHealth = createAsyncThunk('chat/fetchHealth', async (_, { rejectWithValue }) => {
  try {
    const response = await chatService.health()
    if (response.status !== 200) {
      return rejectWithValue('Failed to fetch chat health')
    }
    return response.data
  } catch (error) {
    return rejectWithValue('Failed to fetch chat health')
  }
})

export const deleteChatHistories = createAsyncThunk('chat/deleteHistories', async (_, { rejectWithValue }) => {
  try {
    const response = await chatService.clear()
    if (response.status !== 200) {
      return rejectWithValue('Failed to delete chat histories')
    }
    return true // Indicate success
  } catch (error) {
    return rejectWithValue('Failed to delete chat histories')
  }
})

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
        state.error = (action.payload as string) || 'Failed to send message'
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
        state.error = (action.payload as string) || 'Failed to fetch chat histories'
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
        state.error = (action.payload as string) || 'Failed to clear chat cache'
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
        state.error = (action.payload as string) || 'Failed to fetch chat session info'
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
        state.error = (action.payload as string) || 'Failed to fetch chat health'
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
        state.error = (action.payload as string) || 'Failed to delete chat histories'
      })
  }
})

export const chatActions = chatSlice.actions
const chatReducer = chatSlice.reducer

export default chatReducer
