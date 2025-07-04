import authService from '@/services/auth.service'
import subscriptionService from '@/services/subscription.service'
import userService from '@/services/user.service'
import type { SignInPayload, SignUpPayload } from '@/types/payload'
import type { UserResponse } from '@/types/response'
import type { UserSubscription } from '@/types/subscription'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

interface AuthState {
  isAuthenticated: boolean
  user: UserResponse | null
  token: string | null
  refreshToken?: string | null
  loading: boolean
  signUpSuccess?: boolean
  subscription?: UserSubscription
}

export const signInAction = createAsyncThunk('auth/signIn', async (payload: SignInPayload, { rejectWithValue }) => {
  try {
    const response = await authService.signIn(payload)
    if (response.status === 200) {
      toast.success('Đăng nhập thành công')
      const { access_token, refresh_token, token_type } = response.data
      return {
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenType: token_type
      }
    } else {
      toast.error((response as any).response.data.detail || 'Đăng nhập không thành công')
      return rejectWithValue('Sai tài khoản hoặc mật khẩu')
    }
  } catch (error) {
    toast.error('Đã xảy ra lỗi khi đăng nhập')
    return rejectWithValue(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng nhập')
  }
})

export const getMeAction = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const response = await userService.getMe()
    if (response.status === 200) {
      return response.data
    } else {
      return rejectWithValue('Không thể lấy thông tin người dùng')
    }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi lấy thông tin người dùng')
  }
})

export const signUpAction = createAsyncThunk('auth/signUp', async (payload: SignUpPayload, { rejectWithValue }) => {
  try {
    const response = await authService.signUp(payload)
    if (response.status === 200) {
      toast.success('Đăng ký thành công')
      return response.data
    } else {
      console.error('SignUp Error:', response)
      toast.error((response as any).response.data.detail)
      return rejectWithValue('Đăng ký không thành công')
    }
  } catch (error) {
    toast.error('Đã xảy ra lỗi khi đăng ký')
    return rejectWithValue(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng ký')
  }
})

export const getSubscriptionStatus = createAsyncThunk('auth/getSubscriptionStatus', async (_, { rejectWithValue }) => {
  try {
    const response = await subscriptionService.getStatus()
    if (response.status === 200) {
      return response.data
    } else {
      return rejectWithValue('Không thể lấy trạng thái đăng ký')
    }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi lấy trạng thái đăng ký')
  }
})

const userSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    roles: [],
    token: null,
    loading: false,
    refreshToken: null,
    signUpSuccess: false
  } as AuthState,
  reducers: {
    signOut: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.refreshToken = null
      state.signUpSuccess = false
      state.loading = false
    },
    updateToken: (state, action) => {
      const { accessToken, refreshToken } = action.payload
      state.token = accessToken
      state.refreshToken = refreshToken
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAction.pending, (state) => {
        state.loading = true
      })
      .addCase(signInAction.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.token = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.loading = false
      })
      .addCase(signInAction.rejected, (state) => {
        state.loading = false
      })
      .addCase(signUpAction.pending, (state) => {
        state.loading = true
      })
      .addCase(signUpAction.fulfilled, (state) => {
        state.loading = false
        state.signUpSuccess = true
      })
      .addCase(signUpAction.rejected, (state) => {
        state.loading = false
      })
      .addCase(getMeAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getMeAction.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
      })
      .addCase(getMeAction.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
      })
      .addCase(getSubscriptionStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(getSubscriptionStatus.fulfilled, (state, action) => {
        state.subscription = {
          status: action.payload.status,
          subscription_type: action.payload.subscription_type,
          start_date: action.payload.start_date,
          end_date: action.payload.end_date,
          is_active: action.payload.is_active,
          created_at: action.payload.created_at
        }
        state.loading = false
      })
      .addCase(getSubscriptionStatus.rejected, (state) => {
        state.loading = false
        state.subscription = undefined
      })
      .addDefaultCase(() => {})
  }
})

const authReducer = userSlice.reducer
export const authActions = userSlice.actions

export default authReducer
