export interface Question {
  id: number
  question: string
  options: string[]
  phase: 1 | 2 | 3
  category?: string
}

export interface Answer {
  questionId: number
  selectedOption: number
  timestamp: string
}

export interface MBTIResult {
  id: string
  userId: string
  answers: Answer[]
  result: {
    type: string
    description: string
    traits: {
      extraversion: number
      introversion: number
      sensing: number
      intuition: number
      thinking: number
      feeling: number
      judging: number
      perceiving: number
    }
  }
  completedAt: string
  score: number
}

export interface MBTIState {
  // Questions
  questions: Question[]
  questionsLoading: boolean
  questionsError: string | null

  // Current test session
  currentQuestionIndex: number
  answers: { [questionId: number]: number }
  selectedAnswer: number | null
  isCompleted: boolean
  testId: string | null

  // Submit state
  submitting: boolean
  submitError: string | null

  // Results
  result: MBTIResult | null
  resultLoading: boolean
  resultError: string | null
}

export interface GetQuestionsRequest {
  limit?: number
  phase?: 1 | 2 | 3
}

export interface GetQuestionsResponse {
  questions: Question[]
  total: number
}

export interface SubmitAnswersRequest {
  testId?: string
  answers: Answer[]
  userId: string
}

export interface SubmitAnswersResponse {
  result: MBTIResult
  message: string
}

export interface SaveAnswerRequest {
  questionId: number
  selectedOption: number
  testId?: string
}

// API Error response
export interface ApiError {
  message: string
  code?: string
  details?: any
}
