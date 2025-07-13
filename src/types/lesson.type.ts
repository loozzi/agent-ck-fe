import type { ChatRole } from './chat'

export interface Category {
  name: string
  description: string
  display_order: number
  is_active: boolean
  id: string
  created_at: string
  updated_at: string
}

export interface CreateCategoryPayload {
  name: string
  description: string
  display_order: number
  is_active: boolean
}

export interface CreateLessonPayload {
  category_id: string
  title: string
  content: string
  display_order: number
  is_active: boolean
}

export interface Lesson {
  category_id: string
  title: string
  content: string
  display_order: number
  is_active: boolean
  id: string
  created_at: string
  updated_at: string
}

export interface AllLessonsResponse {
  categories: {
    [key: string]: Lesson[]
  }
  total_categories: number
  total_lessons: number
}

export interface UpdateLessonPayload {
  category_id?: string
  title?: string
  content?: string
  display_order?: number
  is_active?: boolean
}

export interface ChatAboutLessonResponse {
  role: ChatRole
  content: string
  message_order: number
  id: string
  session_id: string
  created_at: string
}

export interface GetAllLessionsParams {
  category_name?: string
}

export interface LessonState {
  categories: Category[]
  lessons: Lesson[]
  allLessons: AllLessonsResponse
  loading: boolean
  error: string | null
  chatMessages: ChatAboutLessonResponse[]
  chatLoading: boolean
  chatError: string | null
}
