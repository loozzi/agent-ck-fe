import {
  type GetNewsLatestParams,
  type GetNewsParams,
  type GetNewsPendingParams,
  type News,
  type NewsResponse
} from '@/types/news'
import type { AxiosResponse } from 'axios'
import apiInstance from './axios.config'

const newsService = {
  getNews: (params: GetNewsParams): Promise<AxiosResponse<NewsResponse>> => {
    return apiInstance.get<NewsResponse>('/news', { params })
  },
  getNewsPending: (params?: GetNewsPendingParams): Promise<AxiosResponse<News[]>> => {
    return apiInstance.get<News[]>('/news/pending', { params })
  },
  getNewsLatest: (params?: GetNewsLatestParams): Promise<AxiosResponse<News[]>> => {
    return apiInstance.get<News[]>('/news/latest', { params })
  }
}

export default newsService
