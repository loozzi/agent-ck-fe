import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { mbtiApi } from '@/services/mbti.service'
import type {
  MBTIState,
  Answer,
  GetQuestionsRequest,
  SubmitAnswersRequest,
  SaveAnswerRequest,
  ApiError
} from '@/types/slices/mbti.types'

// Initial state
const initialState: MBTIState = {
  // Questions
  questions: [],
  questionsLoading: false,
  questionsError: null,

  // Current test session
  currentQuestionIndex: 0,
  answers: {},
  selectedAnswer: null,
  isCompleted: false,
  testId: null,

  // Submit state
  submitting: false,
  submitError: null,

  // Results
  result: null,
  resultLoading: false,
  resultError: null
}

// Async thunks
export const fetchQuestions = createAsyncThunk(
  'mbti/fetchQuestions',
  async (params: GetQuestionsRequest = {}, { rejectWithValue }) => {
    try {
      const response = await mbtiApi.getQuestions(params)
      return response
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.response?.data?.message || 'Không thể tải câu hỏi',
        code: error.response?.status?.toString(),
        details: error.response?.data
      }
      return rejectWithValue(apiError)
    }
  }
)

export const saveAnswer = createAsyncThunk('mbti/saveAnswer', async (data: SaveAnswerRequest, { rejectWithValue }) => {
  try {
    // Chỉ để tương thích - không thực sự gọi API
    // Answers sẽ được lưu local trong confirmAnswer action
    return { ...data, success: true }
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Không thể lưu câu trả lời',
      code: error.response?.status?.toString(),
      details: error.response?.data
    }
    return rejectWithValue(apiError)
  }
})

export const submitAnswers = createAsyncThunk(
  'mbti/submitAnswers',
  async (userId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { mbti: MBTIState }
      const { answers, testId } = state.mbti

      // Convert answers object to Answer array
      const answersArray: Answer[] = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId: parseInt(questionId),
        selectedOption,
        timestamp: new Date().toISOString()
      }))

      const requestData: SubmitAnswersRequest = {
        testId: testId || undefined,
        answers: answersArray,
        userId
      }

      const response = await mbtiApi.submitAnswers(requestData)
      return response
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.response?.data?.message || 'Không thể nộp bài trắc nghiệm',
        code: error.response?.status?.toString(),
        details: error.response?.data
      }
      return rejectWithValue(apiError)
    }
  }
)

export const fetchResult = createAsyncThunk('mbti/fetchResult', async (testId: string, { rejectWithValue }) => {
  try {
    const response = await mbtiApi.getResult(testId)
    return response
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Không thể tải kết quả',
      code: error.response?.status?.toString(),
      details: error.response?.data
    }
    return rejectWithValue(apiError)
  }
})

// Slice
const mbtiSlice = createSlice({
  name: 'mbti',
  initialState,
  reducers: {
    // Navigation actions
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload
      // Load selected answer for current question
      const currentQuestion = state.questions[action.payload]
      if (currentQuestion) {
        const savedAnswer = state.answers[currentQuestion.id]
        state.selectedAnswer = savedAnswer !== undefined ? savedAnswer : null
      }
    },

    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1
        // Load selected answer for new current question
        const currentQuestion = state.questions[state.currentQuestionIndex]
        if (currentQuestion) {
          const savedAnswer = state.answers[currentQuestion.id]
          state.selectedAnswer = savedAnswer !== undefined ? savedAnswer : null
        }
      }
    },

    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1
        // Load selected answer for new current question
        const currentQuestion = state.questions[state.currentQuestionIndex]
        if (currentQuestion) {
          const savedAnswer = state.answers[currentQuestion.id]
          state.selectedAnswer = savedAnswer !== undefined ? savedAnswer : null
        }
      }
    },

    // Answer selection
    selectAnswer: (state, action: PayloadAction<number>) => {
      state.selectedAnswer = action.payload
    },
    confirmAnswer: (state) => {
      if (state.selectedAnswer !== null) {
        const currentQuestion = state.questions[state.currentQuestionIndex]
        if (currentQuestion) {
          // Lưu answer vào local state
          state.answers[currentQuestion.id] = state.selectedAnswer

          // Check if test is completed (tất cả câu đã được trả lời)
          if (Object.keys(state.answers).length === state.questions.length) {
            state.isCompleted = true
          } else if (state.currentQuestionIndex < state.questions.length - 1) {
            // Move to next question
            state.currentQuestionIndex += 1
            const nextQuestion = state.questions[state.currentQuestionIndex]
            if (nextQuestion) {
              const savedAnswer = state.answers[nextQuestion.id]
              state.selectedAnswer = savedAnswer !== undefined ? savedAnswer : null
            }
          }
        }
      }
    },

    // Test management
    resetTest: (state) => {
      state.currentQuestionIndex = 0
      state.answers = {}
      state.selectedAnswer = null
      state.isCompleted = false
      state.testId = null
      state.result = null
      state.submitError = null
      state.resultError = null
    },

    setTestId: (state, action: PayloadAction<string>) => {
      state.testId = action.payload
    },

    // Clear errors
    clearErrors: (state) => {
      state.questionsError = null
      state.submitError = null
      state.resultError = null
    }
  },
  extraReducers: (builder) => {
    // Fetch Questions
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.questionsLoading = true
        state.questionsError = null
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questionsLoading = false
        state.questions = action.payload.questions
        state.questionsError = null
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.questionsLoading = false
        state.questionsError = (action.payload as ApiError)?.message || 'Có lỗi xảy ra'
      }) // Save Answer
    builder
      .addCase(saveAnswer.pending, () => {
        // Optional: Add loading state for individual answer saves
      })
      .addCase(saveAnswer.fulfilled, () => {
        // Answer is already saved in local state by confirmAnswer action
      })
      .addCase(saveAnswer.rejected, (_, action) => {
        // Optional: Handle save answer errors
        console.error('Save answer failed:', action.payload)
      })

    // Submit Answers
    builder
      .addCase(submitAnswers.pending, (state) => {
        state.submitting = true
        state.submitError = null
      })
      .addCase(submitAnswers.fulfilled, (state, action) => {
        state.submitting = false
        state.result = action.payload.result
        state.testId = action.payload.result.id
        state.submitError = null
      })
      .addCase(submitAnswers.rejected, (state, action) => {
        state.submitting = false
        state.submitError = (action.payload as ApiError)?.message || 'Có lỗi xảy ra khi nộp bài'
      })

    // Fetch Result
    builder
      .addCase(fetchResult.pending, (state) => {
        state.resultLoading = true
        state.resultError = null
      })
      .addCase(fetchResult.fulfilled, (state, action) => {
        state.resultLoading = false
        state.result = action.payload
        state.resultError = null
      })
      .addCase(fetchResult.rejected, (state, action) => {
        state.resultLoading = false
        state.resultError = (action.payload as ApiError)?.message || 'Có lỗi xảy ra khi tải kết quả'
      })
  }
})

// Export actions
export const {
  setCurrentQuestionIndex,
  nextQuestion,
  previousQuestion,
  selectAnswer,
  confirmAnswer,
  resetTest,
  setTestId,
  clearErrors
} = mbtiSlice.actions

// Export reducer
export default mbtiSlice.reducer

// Selectors
export const selectMBTI = (state: { mbti: MBTIState }) => state.mbti
export const selectCurrentQuestion = (state: { mbti: MBTIState }) => {
  const { questions, currentQuestionIndex } = state.mbti
  return questions[currentQuestionIndex] || null
}
export const selectProgress = (state: { mbti: MBTIState }) => {
  const { questions, currentQuestionIndex } = state.mbti
  return questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0
}
export const selectIsAnswered = (state: { mbti: MBTIState }) => {
  const { selectedAnswer } = state.mbti
  return selectedAnswer !== null
}
export const selectAnsweredCount = (state: { mbti: MBTIState }) => {
  return Object.keys(state.mbti.answers).length
}
