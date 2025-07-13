import type { AxiosResponse } from 'axios'
import apiInstance from './axios.config'
import type {
  Category,
  CreateCategoryPayload,
  AllLessonsResponse,
  ChatAboutLessonResponse,
  CreateLessonPayload,
  Lesson,
  UpdateLessonPayload,
  GetAllLessionsParams
} from '@/types/lesson.type'

const LESSON_ROUTES = {
  GET_LESSON_CATEGORIES: '/lessons/categories',
  CREATE_LESSON_CATEGORY: '/lessons/categories',
  UPDATE_LESSON_CATEGORY: (categoryId: string) => `/lessons/categories/${categoryId}`,
  DELETE_LESSON_CATEGORY: (categoryId: string) => `/lessons/categories/${categoryId}`,
  GET_ALL_LESSONS: '/lessons/',
  CREATE_LESSON: '/lessons/',
  GET_LESSON_BY_ID: (lessonId: string) => `/lessons/${lessonId}`,
  UPDATE_LESSON: (lessonId: string) => `/lessons/${lessonId}`,
  DELETE_LESSON: (lessonId: string) => `/lessons/${lessonId}`,
  CHAT_ABOUT_LESSON: (lessonId: string) => `/lessons/${lessonId}/chat`
}

const lessonService = {
  getLessonsCategories: async (): Promise<AxiosResponse<Category[]>> =>
    apiInstance.get<Category[]>(LESSON_ROUTES.GET_LESSON_CATEGORIES),
  createCategory: async (payload: CreateCategoryPayload): Promise<AxiosResponse<Category>> =>
    apiInstance.post<Category>(LESSON_ROUTES.CREATE_LESSON_CATEGORY, payload),
  updateLessonCategory: async (categoryId: string, payload: CreateCategoryPayload): Promise<AxiosResponse<Category>> =>
    apiInstance.put<Category>(LESSON_ROUTES.UPDATE_LESSON_CATEGORY(categoryId), payload),
  deleteLessonCategory: async (categoryId: string): Promise<AxiosResponse<void>> =>
    apiInstance.delete<void>(LESSON_ROUTES.DELETE_LESSON_CATEGORY(categoryId)),
  getAllLessons: async (params: GetAllLessionsParams): Promise<AxiosResponse<AllLessonsResponse>> =>
    apiInstance.get<AllLessonsResponse>(LESSON_ROUTES.GET_ALL_LESSONS, { params }),
  createLesson: async (payload: CreateLessonPayload): Promise<AxiosResponse<Lesson>> =>
    apiInstance.post<Lesson>(LESSON_ROUTES.CREATE_LESSON, payload),
  getLessonById: async (lessonId: string): Promise<AxiosResponse<Lesson>> =>
    apiInstance.get<Lesson>(LESSON_ROUTES.GET_LESSON_BY_ID(lessonId)),
  updateLesson: async (lessonId: string, payload: UpdateLessonPayload): Promise<AxiosResponse<Lesson>> =>
    apiInstance.put<Lesson>(LESSON_ROUTES.UPDATE_LESSON(lessonId), payload),
  deleteLesson: async (lessonId: string): Promise<AxiosResponse<void>> =>
    apiInstance.delete<void>(LESSON_ROUTES.DELETE_LESSON(lessonId)),
  chatAboutLesson: async (lessonId: string): Promise<AxiosResponse<ChatAboutLessonResponse>> =>
    apiInstance.post<ChatAboutLessonResponse>(LESSON_ROUTES.CHAT_ABOUT_LESSON(lessonId))
}

export default lessonService
