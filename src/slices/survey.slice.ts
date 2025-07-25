import surveyService from '@/services/survey.service'
import type { SurveyPayload, SurveyState } from '@/types/survey'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState: SurveyState = {
  questions: null,
  currentPart: 0,
  currentQuestionIndex: 0,
  answers: {},
  isSubmitting: false,
  error: null,
  status: null,
  isLoading: false,
  isCompleted: false,
  surveyResponse: null
}

export const fetchQuestions = createAsyncThunk('survey/fetchQuestions', async (_, { rejectWithValue }) => {
  try {
    const response = await surveyService.getQuestions()
    if (response.status !== 200) {
      const errorMessage =
        (response as any).response?.data?.detail || 'Không thể lấy câu hỏi khảo sát. Vui lòng thử lại sau.'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
    return response.data
  } catch (error: any) {
    return rejectWithValue('Không thể lấy câu hỏi khảo sát. Vui lòng thử lại sau.')
  }
})

export const submitSurvey = createAsyncThunk(
  'survey/submitSurvey',
  async (data: SurveyPayload, { rejectWithValue }) => {
    try {
      const response = await surveyService.submit(data)
      if (response.status !== 200) {
        const errorMessage = (response as any).response?.data?.detail || 'Không thể gửi khảo sát. Vui lòng thử lại sau.'
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Không thể gửi khảo sát. Vui lòng thử lại sau.')
    }
  }
)

export const fetchSurveyStatus = createAsyncThunk('survey/fetchSurveyStatus', async (_, { rejectWithValue }) => {
  try {
    const response = await surveyService.getStatus()
    if (response.status !== 200) {
      const errorMessage = (response as any).response?.data?.detail || 'Lỗi khi lấy trạng thái khảo sát'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Lỗi khi lấy trạng thái khảo sát')
  }
})

export const fetchMySurvey = createAsyncThunk('survey/fetchMySurvey', async (_, { rejectWithValue }) => {
  try {
    const response = await surveyService.mySurvey()
    if (response.status !== 200) {
      const errorMessage = (response as any).response?.data?.detail || 'Không thể lấy khảo sát của bạn'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Không thể lấy khảo sát của bạn')
  }
})

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    setCurrentPart: (state, action) => {
      state.currentPart = action.payload
    },
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload
    },
    setAnswer: (state, action) => {
      const { questionId, answer } = action.payload
      state.answers[questionId] = answer
    },
    clearAnswers: (state) => {
      state.answers = {}
    },
    setCompleted: (state, action) => {
      state.isCompleted = action.payload
    },
    resetSurvey: (state) => {
      state.currentPart = 0
      state.currentQuestionIndex = 0
      state.answers = {}
      state.isCompleted = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions = action.payload
        state.isLoading = false
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(submitSurvey.pending, (state) => {
        state.isSubmitting = true
        state.error = null
      })
      .addCase(submitSurvey.fulfilled, (state, action) => {
        state.surveyResponse = action.payload
        state.isSubmitting = false
      })
      .addCase(submitSurvey.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload as string
      })
      .addCase(fetchSurveyStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSurveyStatus.fulfilled, (state, action) => {
        state.status = action.payload
        state.isLoading = false
      })
      .addCase(fetchSurveyStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchMySurvey.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMySurvey.fulfilled, (state, action) => {
        state.surveyResponse = action.payload
        state.isLoading = false
      })
      .addCase(fetchMySurvey.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { setCurrentPart, setCurrentQuestionIndex, setAnswer, clearAnswers, setCompleted, resetSurvey } =
  surveySlice.actions

const surveyReducer = surveySlice.reducer
export default surveyReducer
