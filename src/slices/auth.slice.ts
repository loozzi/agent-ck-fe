import authService from '@/services/auth.service'
import subscriptionService from '@/services/subscription.service'
import userService from '@/services/user.service'
import type { AuthState, ZaloCompleteLoginPayload } from '@/types/auth'
import type { SignInPayload, SignUpPayload } from '@/types/payload'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  sessions: undefined,
  active_sessions: 0,
  token: null,
  loading: false,
  refreshToken: null,
  signUpSuccess: false
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

export const getSessionsAction = createAsyncThunk('auth/getSessions', async (_, { rejectWithValue }) => {
  try {
    const response = await authService.getSessions()
    if (response.status === 200) {
      return response.data
    } else {
      return rejectWithValue('Không thể lấy danh sách phiên đăng nhập')
    }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi lấy danh sách phiên đăng nhập')
  }
})

export const signOutAction = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  try {
    const response = await authService.signOut()
    if (response.status === 200) {
      toast.success('Đăng xuất thành công')
      return true
    } else {
      return rejectWithValue('Không thể đăng xuất')
    }
  } catch (error) {
    toast.error('Đã xảy ra lỗi khi đăng xuất')
    return rejectWithValue(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng xuất')
  }
})

export const zaloCompleteLogin = createAsyncThunk(
  'auth/zaloCompleteLogin',
  async (payload: ZaloCompleteLoginPayload, { rejectWithValue }) => {
    try {
      const response = await authService.completeLogin(payload)
      if (response.status === 200) {
        toast.success('Đăng nhập Zalo thành công')
        return response.data
      } else {
        toast.error((response as any).response.data.detail || 'Đăng nhập Zalo không thành công')
        return rejectWithValue('Đăng nhập Zalo không thành công')
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi đăng nhập Zalo')
      return rejectWithValue(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng nhập Zalo')
    }
  }
)

const userSlice = createSlice({
  name: 'auth',
  initialState: initialState,
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
      .addCase(getSessionsAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getSessionsAction.fulfilled, (state, action) => {
        state.sessions = action.payload.sessions
        state.active_sessions = action.payload.active_sessions
        state.loading = false
      })
      .addCase(getSessionsAction.rejected, (state) => {
        state.loading = false
        state.sessions = undefined
        state.active_sessions = 0
      })
      .addCase(signOutAction.pending, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.refreshToken = null
        state.loading = false
        state.signUpSuccess = false
      })
      .addCase(signOutAction.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.refreshToken = null
        state.loading = false
        state.signUpSuccess = false
      })
      .addCase(signOutAction.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.refreshToken = null
        state.loading = false
        state.signUpSuccess = false
      })
      .addCase(zaloCompleteLogin.pending, (state) => {
        state.loading = true
      })
      .addCase(zaloCompleteLogin.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.signUpSuccess = true
        state.user = action.payload.user
        state.token = action.payload.access_token
        state.refreshToken = action.payload.refresh_token
        state.loading = false
        if (!action.payload.user.onboarding_completed) {
          window.location.href = '/survey'
        }
      })
      .addCase(zaloCompleteLogin.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.refreshToken = null
      })
  }
})

const authReducer = userSlice.reducer
export const authActions = userSlice.actions

export default authReducer
