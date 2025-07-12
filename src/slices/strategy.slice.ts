import strategyService from '@/services/strategy.service'
import type { BulkUpdateStrategyPayload, StrategyState } from '@/types/strategy.type'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState: StrategyState = {
  my_strategies: {
    prompts: [],
    logic_rules: []
  },
  recommendations: {
    user_tags: [],
    recommended_prompts: [],
    recommended_logic_rules: []
  },
  isLoading: false,
  error: null,
  isUpdating: false,
  updateError: null,
  isBulkUpdating: false,
  bulkUpdateError: null
}

export const fetchStrategiesRecommendations = createAsyncThunk(
  'strategy/fetchRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await strategyService.getRecommendations()
      toast.success('Lấy danh sách gợi ý chiến lược thành công')
      return response.data
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể lấy danh sách gợi ý chiến lược'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const addpromptStrategy = createAsyncThunk(
  'strategy/addPrompt',
  async (promptId: string, { rejectWithValue }) => {
    try {
      const response = await strategyService.addPrompt(promptId)
      toast.success('Thêm prompt vào chiến lược thành công')
      return response.data
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể thêm prompt vào chiến lược'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const deletePromptStrategy = createAsyncThunk(
  'strategy/deletePrompt',
  async (promptId: string, { rejectWithValue }) => {
    try {
      await strategyService.deletePrompt(promptId)
      toast.success('Xóa prompt khỏi chiến lược thành công')
      return promptId
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể xóa prompt khỏi chiến lược'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const addLogicRuleStrategy = createAsyncThunk(
  'strategy/addLogicRule',
  async (ruleId: string, { rejectWithValue }) => {
    try {
      const response = await strategyService.addLogicRule(ruleId)
      toast.success('Thêm quy tắc logic vào chiến lược thành công')
      return response.data
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể thêm quy tắc logic vào chiến lược'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const deleteLogicRuleStrategy = createAsyncThunk(
  'strategy/deleteLogicRule',
  async (ruleId: string, { rejectWithValue }) => {
    try {
      await strategyService.deleteLogicRule(ruleId)
      toast.success('Xóa quy tắc logic khỏi chiến lược thành công')
      return ruleId
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể xóa quy tắc logic khỏi chiến lược'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const bulkAddStrategies = createAsyncThunk(
  'strategy/bulkAdd',
  async (data: BulkUpdateStrategyPayload, { rejectWithValue }) => {
    try {
      const response = await strategyService.bulkAddStrategies(data)
      toast.success(`Chiến lược đã được ${data.action === 'activate' ? 'kích hoạt' : 'vô hiệu hóa'} thành công`)
      return response.data
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể thêm chiến lược hàng loạt'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const getMyStrategy = createAsyncThunk('strategy/getMyStrategy', async (_, { rejectWithValue }) => {
  try {
    const response = await strategyService.getMyStrategy()
    return response.data
  } catch (error) {
    const errorMessage = (error as any).response?.data.detail || 'Không thể lấy chiến lược của bạn'
    return rejectWithValue(errorMessage)
  }
})

const strategySlice = createSlice({
  name: 'strategy',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStrategiesRecommendations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStrategiesRecommendations.fulfilled, (state, action) => {
        state.isLoading = false
        state.recommendations = action.payload
      })
      .addCase(fetchStrategiesRecommendations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      .addCase(addpromptStrategy.pending, (state) => {
        state.isUpdating = true
        state.updateError = null
      })
      .addCase(addpromptStrategy.fulfilled, (state) => {
        state.isUpdating = false
      })
      .addCase(addpromptStrategy.rejected, (state, action) => {
        state.isUpdating = false
        state.updateError = action.payload as string
      })

      .addCase(deletePromptStrategy.pending, (state) => {
        state.isUpdating = true
        state.updateError = null
      })
      .addCase(deletePromptStrategy.fulfilled, (state, action) => {
        state.isUpdating = false
        state.my_strategies.prompts = state.my_strategies.prompts.filter(
          (prompt) => prompt.prompt.id !== action.payload
        )
      })
      .addCase(deletePromptStrategy.rejected, (state, action) => {
        state.isUpdating = false
        state.updateError = action.payload as string
      })

      .addCase(addLogicRuleStrategy.pending, (state) => {
        state.isUpdating = true
        state.updateError = null
      })
      .addCase(addLogicRuleStrategy.fulfilled, (state) => {
        state.isUpdating = false
      })
      .addCase(addLogicRuleStrategy.rejected, (state, action) => {
        state.isUpdating = false
        state.updateError = action.payload as string
      })

      .addCase(deleteLogicRuleStrategy.pending, (state) => {
        state.isUpdating = true
        state.updateError = null
      })
      .addCase(deleteLogicRuleStrategy.fulfilled, (state, action) => {
        state.isUpdating = false
        state.my_strategies.logic_rules = state.my_strategies.logic_rules.filter((rule) => rule.id !== action.payload)
      })
      .addCase(deleteLogicRuleStrategy.rejected, (state, action) => {
        state.isUpdating = false
        state.updateError = action.payload as string
      })
      .addCase(bulkAddStrategies.pending, (state) => {
        state.isBulkUpdating = true
        state.bulkUpdateError = null
      })
      .addCase(bulkAddStrategies.fulfilled, (state, action) => {
        state.isBulkUpdating = false
        // Update prompts and logic rules based on the action payload
        if (action.payload.prompts_updated) {
          state.my_strategies.prompts = state.my_strategies.prompts.map((prompt) => ({
            ...prompt,
            is_active: action.payload.action === 'activate'
          }))
        }
        if (action.payload.logic_rules_updated) {
          state.my_strategies.logic_rules = state.my_strategies.logic_rules.map((rule) => ({
            ...rule,
            is_active: action.payload.action === 'activate'
          }))
        }
      })
      .addCase(bulkAddStrategies.rejected, (state, action) => {
        state.isBulkUpdating = false
        state.bulkUpdateError = action.payload as string
      })
      .addCase(getMyStrategy.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getMyStrategy.fulfilled, (state, action) => {
        state.isLoading = false
        state.my_strategies = action.payload
      })
      .addCase(getMyStrategy.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const strategyActions = strategySlice.actions
const strategyReducer = strategySlice.reducer
export default strategyReducer
