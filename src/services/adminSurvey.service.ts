import type {
  CreateSurveyQuestionPayload,
  GetAllSurveyQuestionsParams,
  SurveyQuestion
} from '@/types/adminSurvey.types'
import apiInstance from './axios.config'
import type { AxiosResponse } from 'axios'

const ADMIN_ROUTE_SURVEY = '/admin/survey/questions'

const adminSurveyService = {
  getSurveyQuestions: async (params: GetAllSurveyQuestionsParams): Promise<AxiosResponse<SurveyQuestion[]>> =>
    apiInstance.get(ADMIN_ROUTE_SURVEY, { params }),
  createServeyQuestion: async (payload: CreateSurveyQuestionPayload): Promise<AxiosResponse<SurveyQuestion>> =>
    apiInstance.post(ADMIN_ROUTE_SURVEY, payload),
  updateSurveyQuestion: async (
    id: number,
    payload: CreateSurveyQuestionPayload
  ): Promise<AxiosResponse<SurveyQuestion>> => apiInstance.put(`${ADMIN_ROUTE_SURVEY}/${id}`, payload),
  deleteSurveyQuestion: async (id: number): Promise<AxiosResponse<void>> =>
    apiInstance.delete(`${ADMIN_ROUTE_SURVEY}/${id}`),
  getSurveyQuestionById: async (id: number): Promise<AxiosResponse<SurveyQuestion>> =>
    apiInstance.get(`${ADMIN_ROUTE_SURVEY}/${id}`),
  forceRedoSurveyQuestion: async (): Promise<AxiosResponse<void>> => apiInstance.post(`/admin/survey/force-redo`)
}

export default adminSurveyService
