import type { ZaloState } from '@/types/zalo'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import zaloService from '@/services/zalo.service'
import { toast } from 'react-toastify'
import { API_BASE_URL } from '@/configs/env.config'

const initialState: ZaloState = {
  state: '',
  code: '',
  authorization_url: '',
  zaloResponse: undefined,
  userData: undefined,
  followStatus: undefined
}

export const fetchZaloAuthUrl = createAsyncThunk('zalo/fetchZaloAuthUrl', async (_, { rejectWithValue }) => {
  try {
    window.location.href = API_BASE_URL + 'auth/zalo/login'
    // if (response.status !== 200) {
    //   toast.error((response as any).response.data.detail || 'Không thể lấy URL xác thực zalo')
    //   return rejectWithValue('Không thể lấy URL xác thực zalo')
    // }

    // const { authorization_url, state } = response.data

    // // Modify the redirect_uri in the authorization_url
    // const url = new URL(authorization_url)
    // url.searchParams.set('redirect_uri', AUTHORIZATION_URL_CALLBACK)

    // return { authorization_url: url.toString(), state }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Không thể lấy URL xác thực Zalo')
  }
})

export const sendZaloCode = createAsyncThunk(
  'zalo/sendZaloCode',
  async (data: { code: string; state: string }, { rejectWithValue }) => {
    console.log('Sending Zalo code:', data)
    try {
      const response = await zaloService.sendZaloCode(data)
      if (response.status !== 200) {
        toast.error((response as any).response.data.detail || 'Không thể gửi mã xác thực Zalo')
        return rejectWithValue('Không thể gửi mã xác thực Zalo')
      }
      console.log('Zalo code response:', response.data)
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

export const checkZaloFollowStatus = createAsyncThunk('zalo/checkZaloFollowStatus', async (_, { rejectWithValue }) => {
  try {
    const response = await zaloService.getZaloFollowStatus()
    if (response.status !== 200) {
      toast.error((response as any).response.data.detail || 'Không thể kiểm tra trạng thái theo dõi Zalo')
      return rejectWithValue('Không thể kiểm tra trạng thái theo dõi Zalo')
    }
    return response.data
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Không thể kiểm tra trạng thái theo dõi Zalo')
  }
})

const zaloSlice = createSlice({
  name: 'zalo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendZaloCode.pending, (state) => {
        state.code = ''
      })
      .addCase(sendZaloCode.fulfilled, (state, action) => {
        state.zaloResponse = action.payload
        state.code = action.payload.oauth_data.authorization_code
        state.state = action.payload.oauth_data.state
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
      .addCase(checkZaloFollowStatus.pending, (state) => {
        state.followStatus = undefined
      })
      .addCase(checkZaloFollowStatus.fulfilled, (state, action) => {
        state.followStatus = action.payload
      })
      .addCase(checkZaloFollowStatus.rejected, (state, action) => {
        state.error = action.payload as string
      })
  }
})

export const zaloActions = zaloSlice.actions
const zaloReducer = zaloSlice.reducer
export default zaloReducer
