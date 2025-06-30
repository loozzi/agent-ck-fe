import type { SurveyPayload, SurveyQuestionResponse, SurveyResponse, SurveyStatusResponse } from '@/types/survey'
import apiInstance from './axios.config'

const surveyService = {
  submit: async (data: SurveyPayload): Promise<SurveyResponse | any> => {
    return apiInstance.post<SurveyResponse>('/survey/submit', data)
  },
  getStatus: async (): Promise<SurveyStatusResponse | any> => {
    return apiInstance.get<SurveyStatusResponse>('/survey/status')
  },
  mySurvey: async (): Promise<SurveyResponse | any> => {
    return apiInstance.get<SurveyResponse>('/survey/my-survey')
  },
  getQuestions: async (): Promise<SurveyQuestionResponse | any> => {
    return apiInstance.get<SurveyQuestionResponse>('/survey/questions')
  }
}

export default surveyService
