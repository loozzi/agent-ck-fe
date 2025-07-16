import adminSurveyService from '@/services/adminSurvey.service'
import type {
  AdminSurveyState,
  CreateSurveyQuestionPayload,
  GetAllSurveyQuestionsParams
} from '@/types/adminSurvey.types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState: AdminSurveyState = {
  questions: [],
  questionDetail: null,
  isLoading: false,
  error: null,
  selectedQuestion: null
}
export const fetchSurveyQuestions = createAsyncThunk(
  'adminSurvey/fetchSurveyQuestions',
  async (params: GetAllSurveyQuestionsParams, { rejectWithValue }) => {
    try {
      const response = await adminSurveyService.getSurveyQuestions(params)
      toast.success('Lấy danh sách câu hỏi khảo sát thành công')
      return response.data
    } catch (error) {
      const errorMessage =
        (error as unknown as { response?: { data?: { detail?: string } } }).response?.data?.detail ||
        'Không thể lấy danh sách câu hỏi khảo sát'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const createSurveyQuestion = createAsyncThunk(
  'adminSurvey/createSurveyQuestion',
  async (payload: CreateSurveyQuestionPayload, { rejectWithValue }) => {
    try {
      const response = await adminSurveyService.createServeyQuestion(payload)
      toast.success('Tạo câu hỏi khảo sát thành công')
      return response.data
    } catch (error) {
      const errorMessage =
        (error as unknown as { response?: { data?: { detail?: string } } }).response?.data?.detail ||
        'Không thể tạo câu hỏi khảo sát'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const updateSurveyQuestion = createAsyncThunk(
  'adminSurvey/updateSurveyQuestion',
  async ({ id, payload }: { id: number; payload: CreateSurveyQuestionPayload }, { rejectWithValue }) => {
    try {
      const response = await adminSurveyService.updateSurveyQuestion(id, payload)
      toast.success('Cập nhật câu hỏi khảo sát thành công')
      return response.data
    } catch (error) {
      const errorMessage =
        (error as unknown as { response?: { data?: { detail?: string } } }).response?.data?.detail ||
        'Không thể cập nhật câu hỏi khảo sát'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const deleteSurveyQuestion = createAsyncThunk(
  'adminSurvey/deleteSurveyQuestion',
  async (id: number, { rejectWithValue }) => {
    try {
      await adminSurveyService.deleteSurveyQuestion(id)
      toast.success('Xóa câu hỏi khảo sát thành công')
      return id
    } catch (error) {
      const errorMessage =
        (error as unknown as { response?: { data?: { detail?: string } } }).response?.data?.detail ||
        'Không thể xóa câu hỏi khảo sát'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const fetchSurveyQuestionById = createAsyncThunk(
  'adminSurvey/fetchSurveyQuestionById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await adminSurveyService.getSurveyQuestionById(id)
      return response.data
    } catch (error) {
      const errorMessage =
        (error as unknown as { response?: { data?: { detail?: string } } }).response?.data?.detail ||
        'Không thể lấy chi tiết câu hỏi khảo sát'
      return rejectWithValue(errorMessage)
    }
  }
)

const adminSurveySlice = createSlice({
  name: 'adminSurvey',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSurveyQuestions.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSurveyQuestions.fulfilled, (state, action) => {
        state.isLoading = false
        state.questions = action.payload
      })
      .addCase(fetchSurveyQuestions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      .addCase(createSurveyQuestion.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createSurveyQuestion.fulfilled, (state, action) => {
        state.isLoading = false
        state.questions.push(action.payload)
      })
      .addCase(createSurveyQuestion.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      .addCase(updateSurveyQuestion.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateSurveyQuestion.fulfilled, (state, action) => {
        state.isLoading = false
        state.questions = state.questions.map((q) => (q.id === action.payload.id ? action.payload : q))
      })
      .addCase(updateSurveyQuestion.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      .addCase(deleteSurveyQuestion.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteSurveyQuestion.fulfilled, (state, action) => {
        state.isLoading = false
        state.questions = state.questions.filter((q) => q.id !== action.payload)
      })
      .addCase(deleteSurveyQuestion.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      .addCase(fetchSurveyQuestionById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSurveyQuestionById.fulfilled, (state, action) => {
        state.isLoading = false
        state.questionDetail = action.payload
      })
      .addCase(fetchSurveyQuestionById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

const adminSurveyReducer = adminSurveySlice.reducer
export default adminSurveyReducer
