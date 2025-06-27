import authService from '@/services/auth.service'
import userService from '@/services/user.service'
import type { SignInPayload, SignUpPayload } from '@/types/payload'
import type { UserResponse } from '@/types/response'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

interface AuthState {
  isAuthenticated: boolean
  user: UserResponse | null
  token: string | null
  refreshToken?: string | null
  loading: boolean
  signUpSuccess?: boolean
}

export const signInAction = createAsyncThunk('auth/signIn', async (payload: SignInPayload, { rejectWithValue }) => {
  try {
    const response = await authService.signIn(payload)
    console.log('SignIn Response:', response)
    if (response.status === 200) {
      toast.success('Đăng nhập thành công')
      const { access_token, refresh_token, token_type } = response.data
      return {
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenType: token_type
      }
    } else {
      toast.error(response.response.data.detail)
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
      console.error('GetMe Error:', response)
      return rejectWithValue('Không thể lấy thông tin người dùng')
    }
  } catch (error) {
    console.error('GetMe Error:', error)
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
      toast.error(response.response.data.detail)
      return rejectWithValue('Đăng ký không thành công')
    }
  } catch (error) {
    toast.error('Đã xảy ra lỗi khi đăng ký')
    return rejectWithValue(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng ký')
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
    },
    updateToken: (state, action) => {
      state.token = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
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
      .addCase(signInAction.rejected, (state, action) => {
        state.loading = false
      })
      .addCase(signUpAction.pending, (state) => {
        state.loading = true
      })
      .addCase(signUpAction.fulfilled, (state, action) => {
        state.loading = false
        state.signUpSuccess = true
      })
      .addCase(signUpAction.rejected, (state, action) => {
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
      .addCase(getMeAction.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
      })
      .addDefaultCase((state) => {
        // Handle any other actions that don't match
      })
  }
})

const authReducer = userSlice.reducer
export const authActions = userSlice.actions

export default authReducer
