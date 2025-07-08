import type { ZaloState } from '@/types/zalo'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import zaloService from '@/services/zalo.service'
import { toast } from 'react-toastify'

const initialState: ZaloState = {
  state: '',
  code: '',
  authorization_url: '',
  userData: undefined
}

export const fetchZaloAuthUrl = createAsyncThunk('zalo/fetchZaloAuthUrl', async (_, { rejectWithValue }) => {
  try {
    const response = await zaloService.getZaloAuthUrl()
    if (response.status !== 200) {
      toast.error((response as any).response.data.detail || 'Không thể lấy URL xác thực zalo')
      return rejectWithValue('Không thể lấy URL xác thực zalo')
    }
    return response.data

    const { authorization_url, state } = response.data

    // Modify the redirect_uri in the authorization_url
    const url = new URL(authorization_url)
    url.searchParams.set('redirect_uri', 'https://localhost:3000/auth/zalo/callback')

    console.log('Zalo authorization URL:', url.toString())

    return { authorization_url: url.toString(), state }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Không thể lấy URL xác thực Zalo')
  }
})

export const sendZaloCode = createAsyncThunk(
  'zalo/sendZaloCode',
  async (data: { code: string; state: string }, { rejectWithValue }) => {
    try {
      const response = await zaloService.sendZaloCode(data)
      if (response.status !== 200) {
        toast.error((response as any).response.data.detail || 'Không thể gửi mã xác thực Zalo')
        return rejectWithValue('Không thể gửi mã xác thực Zalo')
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Không thể gửi mã xác thực Zalo')
    }
  }
)

export const getZaloData = createAsyncThunk(
  'zalo/getZaloData',
  async (params: { access_token: string }, { rejectWithValue }) => {
    try {
      const response = await zaloService.getZaloData(params)
      if (response.status !== 200) {
        toast.error((response as any).response.data.detail || 'Không thể lấy dữ liệu Zalo')
        return rejectWithValue('Không thể lấy dữ liệu Zalo')
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Không thể lấy dữ liệu Zalo')
    }
  }
)

const zaloSlice = createSlice({
  name: 'zalo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchZaloAuthUrl.pending, (state) => {
        state.authorization_url = ''
      })
      .addCase(fetchZaloAuthUrl.fulfilled, (state, action) => {
        state.authorization_url = action.payload.authorization_url
        state.state = action.payload.state
      })
      .addCase(fetchZaloAuthUrl.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(sendZaloCode.pending, (state) => {
        state.code = ''
      })
      .addCase(sendZaloCode.fulfilled, (state, action) => {
        state.code = action.payload.code
      })
      .addCase(sendZaloCode.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(getZaloData.pending, (state) => {
        state.userData = undefined
      })
      .addCase(getZaloData.fulfilled, (state, action) => {
        state.userData = action.payload
      })
      .addCase(getZaloData.rejected, (state, action) => {
        state.error = action.payload as string
      })
  }
})

export const zaloActions = zaloSlice.actions
const zaloReducer = zaloSlice.reducer
export default zaloReducer
