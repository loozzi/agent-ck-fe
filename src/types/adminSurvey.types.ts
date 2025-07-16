export interface SurveyQuestion {
  id: number
  question_id: string
  question_text: string
  question_type: string
  options: string[]
  is_required: boolean
  is_active: boolean
  order: number
  part: string
  part_title: string
  max_selections: number
  created_at: string
  updated_at: string
}

export interface CreateSurveyQuestionPayload {
  question_id: string
  question_text: string
  question_type: string
  options: string[]
  is_required: boolean
  is_active: boolean
  order: number
  part: string
  part_title: string
  max_selections: number
}

export interface GetAllSurveyQuestionsParams {
  part?: 'part1' | 'part2' | 'part3'
  is_active?: boolean
}

export interface AdminSurveyState {
  questions: SurveyQuestion[]
  questionDetail: SurveyQuestion | null
  isLoading: boolean
  error: string | null
  selectedQuestion: SurveyQuestion | null
}
