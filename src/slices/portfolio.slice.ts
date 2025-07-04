import portfolioService from '@/services/portfolio.service'
import type { AddTransactionPayload } from '@/types/portfolio'
import type { PortfolioState } from '@/types/slices/portfolio'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState: PortfolioState = {
  wallet: [],
  transactions: [],
  loading: false,
  error: null,
  lastUpdated: null
}

export const fetchWallet = createAsyncThunk('portfolio/fetchWallet', async (_, { rejectWithValue }) => {
  try {
    const response = await portfolioService.getAll()
    if (response.status !== 200) {
      const errorMessage = (response as any).response?.data?.detail || 'Không thể lấy dữ liệu ví. Vui lòng thử lại sau.'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }

    return response.data
  } catch (error) {
    return rejectWithValue('Không thể lấy dữ liệu ví. Vui lòng thử lại sau.')
  }
})

export const fetchTransactions = createAsyncThunk('portfolio/fetchTransactions', async (_, { rejectWithValue }) => {
  try {
    const response = await portfolioService.getHistory()
    if (response.status !== 200) {
      const errorMessage =
        (response as any).response?.data?.detail || 'Không thể lấy lịch sử giao dịch. Vui lòng thử lại sau.'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }

    return response.data
  } catch (error) {
    return rejectWithValue('Không thể lấy lịch sử giao dịch. Vui lòng thử lại sau.')
  }
})

export const addTransaction = createAsyncThunk(
  'portfolio/addTransaction',
  async (payload: AddTransactionPayload, { rejectWithValue }) => {
    try {
      const response = await portfolioService.addItem(payload)

      if (response.status !== 200) {
        const errorMessage =
          (response as any).response?.data?.detail || 'Không thể thêm giao dịch. Vui lòng kiểm tra lại thông tin.'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }

      return response
    } catch (error) {
      return rejectWithValue('')
    }
  }
)

export const deleteTransaction = createAsyncThunk(
  'portfolio/deleteTransaction',
  async (id: string, { rejectWithValue }) => {
    try {
      await portfolioService.deleteTransaction(id)
      toast.success('Đã xóa giao dịch thành công')
      return id
    } catch (error) {
      return rejectWithValue('Đã xóa giao dịch thành công')
    }
  }
)

export const updateTransaction = createAsyncThunk(
  'portfolio/updateTransaction',
  async ({ id, payload }: { id: string; payload: Partial<AddTransactionPayload> }, { rejectWithValue }) => {
    try {
      const response = await portfolioService.updateTransaction(id, payload)
      if (response.status !== 200) {
        const errorMessage =
          (response as any).response?.data?.detail || 'Không thể cập nhật giao dịch. Vui lòng kiểm tra lại thông tin.'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      return response.data
    } catch (error) {
      return rejectWithValue('Không thể cập nhật giao dịch. Vui lòng thử lại sau.')
    }
  }
)

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.wallet = action.payload.items || []
        state.loading = false
        state.lastUpdated = action.payload.updated_at || new Date().toISOString()
        state.error = null
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.wallet = []
      })
      .addCase(addTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload.data)
        state.loading = false
        state.error = null
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload || []
        state.loading = false
        state.error = null
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter((transaction) => transaction.id !== action.payload)
        state.loading = false
        state.error = null
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex((transaction) => transaction.id === action.payload.id)
        if (index !== -1) {
          state.transactions[index] = action.payload
        }
        state.loading = false
        state.error = null
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const portfolioActions = portfolioSlice.actions

const portfolioReducer = portfolioSlice.reducer
export default portfolioReducer
