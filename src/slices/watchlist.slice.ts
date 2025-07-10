import watchListService from '@/services/watchlist.service'
import type {
  AddToWatchlistPayload,
  BulkAddToWatchlistPayload,
  UpdateWatchlistItemPayload,
  WatchlistDetailsResponse,
  WatchlistResponse,
  WatchlistUpdatePayload
} from '@/types/watchlist'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

interface WatchlistState {
  watchlist?: WatchlistResponse
  watchlistDetail?: WatchlistDetailsResponse
  isLoading: boolean
  error: string | null
}

const initialState: WatchlistState = {
  watchlist: undefined,
  watchlistDetail: undefined,
  isLoading: false,
  error: null
}

// Async Thunks
export const fetchWatchlistSummary = createAsyncThunk('watchlist/fetchSummary', async (_, { rejectWithValue }) => {
  try {
    const response = await watchListService.getSummary()
    if (response.status !== 200) {
      const errorMessage = 'Không thể lấy danh sách watchlist'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
    return response.data
  } catch {
    return rejectWithValue('Không thể lấy danh sách watchlist. Vui lòng thử lại sau.')
  }
})

export const fetchWatchlistDetail = createAsyncThunk('watchlist/fetchDetail', async (_, { rejectWithValue }) => {
  try {
    const response = await watchListService.getDetail()
    if (response.status !== 200) {
      const errorMessage = 'Không thể lấy chi tiết watchlist'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
    return response.data
  } catch {
    return rejectWithValue('Không thể lấy chi tiết watchlist. Vui lòng thử lại sau.')
  }
})

export const updateWatchlist = createAsyncThunk(
  'watchlist/update',
  async (payload: WatchlistUpdatePayload, { rejectWithValue }) => {
    try {
      const response = await watchListService.updateWatchlist(payload)
      if (response.status !== 200) {
        const errorMessage = 'Không thể cập nhật watchlist'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      toast.success('Cập nhật watchlist thành công')
      return response.data
    } catch {
      return rejectWithValue('Không thể cập nhật watchlist. Vui lòng thử lại sau.')
    }
  }
)

export const addToWatchlist = createAsyncThunk(
  'watchlist/addItem',
  async (payload: AddToWatchlistPayload, { rejectWithValue }) => {
    try {
      const response = await watchListService.addItem(payload)
      if (response.status !== 200) {
        const errorMessage = 'Không thể thêm cổ phiếu vào watchlist'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      toast.success('Đã thêm cổ phiếu vào watchlist')
      return response.data
    } catch {
      return rejectWithValue('Không thể thêm cổ phiếu vào watchlist. Vui lòng thử lại sau.')
    }
  }
)

export const bulkAddToWatchlist = createAsyncThunk(
  'watchlist/bulkAddItems',
  async (payload: BulkAddToWatchlistPayload, { rejectWithValue }) => {
    try {
      const response = await watchListService.bulkAddItems(payload)
      if (response.status !== 200) {
        const errorMessage = 'Không thể thêm nhiều cổ phiếu vào watchlist'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      toast.success(`Đã thêm ${response.data.length} cổ phiếu vào watchlist`)
      return response.data
    } catch {
      return rejectWithValue('Không thể thêm nhiều cổ phiếu vào watchlist. Vui lòng thử lại sau.')
    }
  }
)

export const updateWatchlistItem = createAsyncThunk(
  'watchlist/updateItem',
  async ({ itemId, payload }: { itemId: string; payload: UpdateWatchlistItemPayload }, { rejectWithValue }) => {
    try {
      const response = await watchListService.updateWatchlistItem(itemId, payload)
      if (response.status !== 200) {
        const errorMessage = 'Không thể cập nhật cổ phiếu trong watchlist'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      toast.success('Cập nhật cổ phiếu thành công')
      return response.data
    } catch {
      return rejectWithValue('Không thể cập nhật cổ phiếu trong watchlist. Vui lòng thử lại sau.')
    }
  }
)

export const deleteWatchlistItem = createAsyncThunk(
  'watchlist/deleteItem',
  async (itemId: string, { rejectWithValue }) => {
    try {
      await watchListService.deleteWatchlistItem(itemId)
      toast.success('Đã xóa cổ phiếu khỏi watchlist')
      return itemId
    } catch {
      return rejectWithValue('Không thể xóa cổ phiếu khỏi watchlist. Vui lòng thử lại sau.')
    }
  }
)

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    setWatchlist: (state, action) => {
      state.watchlist = action.payload
    },
    setWatchlistDetail: (state, action) => {
      state.watchlistDetail = action.payload
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Watchlist Summary
      .addCase(fetchWatchlistSummary.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchWatchlistSummary.fulfilled, (state, action) => {
        state.watchlist = action.payload
        state.isLoading = false
      })
      .addCase(fetchWatchlistSummary.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Watchlist Detail
      .addCase(fetchWatchlistDetail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchWatchlistDetail.fulfilled, (state, action) => {
        state.watchlistDetail = action.payload
        state.isLoading = false
      })
      .addCase(fetchWatchlistDetail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Watchlist
      .addCase(updateWatchlist.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateWatchlist.fulfilled, (state, action) => {
        // Update the watchlist data
        if (state.watchlist) {
          state.watchlist = { ...state.watchlist, ...action.payload }
        }
        state.isLoading = false
      })
      .addCase(updateWatchlist.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Add Item to Watchlist
      .addCase(addToWatchlist.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        // Add the new item to watchlistDetail if it exists
        if (state.watchlistDetail?.items) {
          state.watchlistDetail.items.push(action.payload)
        }
        state.isLoading = false
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Bulk Add Items to Watchlist
      .addCase(bulkAddToWatchlist.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(bulkAddToWatchlist.fulfilled, (state, action) => {
        // Add the new items to watchlistDetail if it exists
        if (state.watchlistDetail?.items) {
          state.watchlistDetail.items.push(...action.payload)
        }
        state.isLoading = false
      })
      .addCase(bulkAddToWatchlist.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Watchlist Item
      .addCase(updateWatchlistItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateWatchlistItem.fulfilled, (state, action) => {
        // Update the specific item in watchlistDetail if it exists
        if (state.watchlistDetail?.items) {
          const index = state.watchlistDetail.items.findIndex((item) => item.id === action.payload.id)
          if (index !== -1) {
            state.watchlistDetail.items[index] = action.payload
          }
        }
        state.isLoading = false
      })
      .addCase(updateWatchlistItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete Watchlist Item
      .addCase(deleteWatchlistItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteWatchlistItem.fulfilled, (state, action) => {
        // Remove the item from watchlistDetail if it exists
        if (state.watchlistDetail?.items) {
          state.watchlistDetail.items = state.watchlistDetail.items.filter((item) => item.id !== action.payload)
        }
        state.isLoading = false
      })
      .addCase(deleteWatchlistItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const watchlistActions = watchlistSlice.actions
const watchlistReducer = watchlistSlice.reducer
export default watchlistReducer
