import type {
  NewsFormatCheckConflictPayload,
  NewsFormatCheckConflictResponse,
  GetNewsFormatsParams,
  NewsFormatCreatePayload,
  NewsFormatResponse,
  NewsFormatsResponse,
  TestNewsFormatPayload,
  TestNewsFormatResponse
} from '@/types/news_format'

import apiInstance from './axios.config'
import type { AxiosResponse } from 'axios'

const API_ROUTE = {
  CHECK_FORMAT_CONFLICT: '/news-formats/check-conflict',
  CREATE_FORMAT: '/news-formats',
  GET_FORMATS: '/news-formats',
  GET_FORMAT_BY_ID: (id: string) => `/news-formats/${id}`,
  UPDATE_FORMAT: (id: string) => `/news-formats/${id}`,
  DELETE_FORMAT: (id: string) => `/news-formats/${id}`,
  TEST_FORMAT: '/news-formats/test'
}

const newsFormatService = {
  checkFormatConflict: (
    payload: NewsFormatCheckConflictPayload
  ): Promise<AxiosResponse<NewsFormatCheckConflictResponse>> =>
    apiInstance.post(API_ROUTE.CHECK_FORMAT_CONFLICT, payload),
  createFormat: (payload: NewsFormatCreatePayload): Promise<AxiosResponse<NewsFormatResponse>> =>
    apiInstance.post(API_ROUTE.CREATE_FORMAT, payload),
  getFormats: (params?: GetNewsFormatsParams): Promise<AxiosResponse<NewsFormatsResponse>> =>
    apiInstance.get(API_ROUTE.GET_FORMATS, { params }),
  getFormatById: (id: string): Promise<AxiosResponse<NewsFormatResponse>> =>
    apiInstance.get(API_ROUTE.GET_FORMAT_BY_ID(id)),
  updateFormat: (id: string, payload: Partial<NewsFormatCreatePayload>): Promise<AxiosResponse<NewsFormatResponse>> =>
    apiInstance.put(API_ROUTE.UPDATE_FORMAT(id), payload),
  deleteFormat: (id: string): Promise<AxiosResponse<NewsFormatResponse>> =>
    apiInstance.delete(API_ROUTE.DELETE_FORMAT(id)),
  testFormat: (payload: TestNewsFormatPayload): Promise<AxiosResponse<TestNewsFormatResponse>> =>
    apiInstance.post(API_ROUTE.TEST_FORMAT, payload)
}

export default newsFormatService
