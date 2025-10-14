export interface NewsFormatCheckConflictPayload {
  active_days: number[]
  active_hour: number
  exclude_id?: string
}

export interface NewsFormatCheckConflictResponse {
  conflict: boolean
  conflicting_format: string
  message: string
}

export interface NewsFormatCreatePayload {
  name: string
  content: string
  active_days: number[]
  active_hour: number
  test_result: string
}

export interface NewsFormatResponse extends NewsFormatCreatePayload {
  id: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface GetNewsFormatsParams {
  page?: number
  per_page?: number
}

export interface NewsFormatsResponse {
  formats: NewsFormatResponse[]
  total: number
  page: number
  per_page: number
}

export interface TestNewsFormatPayload {
  content: string
}

export interface TestNewsFormatResponse {
  success: boolean
  result: string
  error: string
}

export interface NewsFormatState {
  formats: NewsFormatResponse[]
  conflictFormat?: string
  total: number
  page: number
  per_page: number
  loadingFetchFormats: boolean
  loadingCreateFormat: boolean
  loadingUpdateFormat: boolean
  loadingDeleteFormat: boolean
  loadingTestFormat: boolean
}
