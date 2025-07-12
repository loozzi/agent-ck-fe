import logicRuleService from '@/services/logicRule.service'
import type { CreateLogicRulePayload, GetMyLogicRuleParams, UpdateLogicRulePayload } from '@/types/logicRules'
import type { LogicRuleState } from '@/types/slices/logicRule.types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState: LogicRuleState = {
  logicRules: [],
  isLoading: false,
  error: null
}

export const createLogicRule = createAsyncThunk(
  'logicRule/createLogicRule',
  async (payload: CreateLogicRulePayload, { rejectWithValue }) => {
    try {
      const response = await logicRuleService.create(payload)
      if (response.status !== 200) {
        const errorMessage = (response as any).response.data.detail || 'Không thể tạo quy tắc logic'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }

      return response.data
    } catch (error) {
      return rejectWithValue('Không thể tạo quy tắc logic')
    }
  }
)

export const getLogicRules = createAsyncThunk(
  'logicRule/getLogicRules',
  async (params: GetMyLogicRuleParams, { rejectWithValue }) => {
    try {
      const response = await logicRuleService.getRules(params)
      if (response.status !== 200) {
        const errorMessage = (response as any).response.data.detail || 'Không thể lấy danh sách quy tắc logic'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }

      return response.data
    } catch (error) {
      return rejectWithValue('Không thể lấy danh sách quy tắc logic')
    }
  }
)

export const getLogicRuleDetail = createAsyncThunk(
  'logicRule/getLogicRuleDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await logicRuleService.getRuleDetail(id)
      if (response.status !== 200) {
        const errorMessage = (response as any).response.data.detail || 'Không thể lấy chi tiết quy tắc logic'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }

      return response.data
    } catch (error) {
      return rejectWithValue('Không thể lấy chi tiết quy tắc logic')
    }
  }
)

export const updateLogicRule = createAsyncThunk(
  'logicRule/updateLogicRule',
  async ({ id, data }: { id: string; data: UpdateLogicRulePayload }, { rejectWithValue }) => {
    try {
      const response = await logicRuleService.update(id, data)
      if (response.status !== 200) {
        const errorMessage = (response as any).response.data.detail || 'Không thể cập nhật quy tắc logic'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }

      return response.data
    } catch (error) {
      const errorMessage = (error as any).response.data.detail || 'Không thể cập nhật quy tắc logic'
      toast.error(errorMessage)
      return rejectWithValue('Không thể cập nhật quy tắc logic')
    }
  }
)

export const deleteLogicRule = createAsyncThunk(
  'logicRule/deleteLogicRule',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await logicRuleService.remove(id)
      if (response.status !== 200) {
        const errorMessage = (response as any).response.data.detail || 'Không thể xóa quy tắc logic'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }

      return id
    } catch (error) {
      return rejectWithValue('Không thể xóa quy tắc logic')
    }
  }
)

const logicRuleSlice = createSlice({
  name: 'logicRule',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createLogicRule.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createLogicRule.fulfilled, (state, action) => {
        state.isLoading = false
        state.logicRules.push(action.payload)
      })
      .addCase(createLogicRule.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(getLogicRules.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getLogicRules.fulfilled, (state, action) => {
        state.isLoading = false
        state.logicRules = action.payload
      })
      .addCase(getLogicRules.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(getLogicRuleDetail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getLogicRuleDetail.fulfilled, (state, action) => {
        const index = state.logicRules.findIndex((rule) => rule.id === action.payload.id)
        if (index !== -1) {
          state.logicRules[index] = action.payload
        } else {
          state.logicRules.push(action.payload)
        }
        state.isLoading = false
      })
      .addCase(getLogicRuleDetail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateLogicRule.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateLogicRule.fulfilled, (state, action) => {
        const index = state.logicRules.findIndex((rule) => rule.id === action.payload.id)
        if (index !== -1) {
          state.logicRules[index] = action.payload
        }
        state.isLoading = false
      })
      .addCase(updateLogicRule.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteLogicRule.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteLogicRule.fulfilled, (state, action) => {
        state.isLoading = false
        state.logicRules = state.logicRules.filter((rule) => rule.id !== action.payload)
      })
      .addCase(deleteLogicRule.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const logicRuleActions = logicRuleSlice.actions

const logicRuleReducer = logicRuleSlice.reducer
export default logicRuleReducer
