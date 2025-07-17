import type { EmailState, EmailUpdateRequest, EmailVerificationRequest } from '@/types/email.types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import emailService from '@/services/email.service'

const initialState: EmailState = {
  emailStatus: {
    current_email: '',
    email_verified: false,
    pending_email: '',
    id_zalo_default_email: false,
    has_custom_email: false
  },
  timeRemaining: 0,
  verificationSent: false,
  error: null,
  loading: false
}

export const fetchEmailStatus = createAsyncThunk('email/fetchStatus', async (_, { rejectWithValue }) => {
  try {
    const response = await emailService.getEmailStatus()
    return response.data
  } catch (error) {
    const errorMessage = (error as any).response?.data?.detail || 'Không thể lấy trạng thái email'
    toast.error(errorMessage)
    return rejectWithValue(errorMessage)
  }
})

export const changeEmail = createAsyncThunk('email/change', async (data: EmailUpdateRequest, { rejectWithValue }) => {
  try {
    const response = await emailService.changeEmail(data)
    return response.data
  } catch (error) {
    console.log(error)
    const errorMessage = (error as any).response?.data?.detail || 'Không thể thay đổi email'
    toast.error(errorMessage)
    return rejectWithValue(errorMessage)
  }
})

export const verifyEmail = createAsyncThunk(
  'email/verify',
  async (data: EmailVerificationRequest, { rejectWithValue }) => {
    try {
      const response = await emailService.verifyEmail(data)
      return response.data
    } catch (error) {
      const errorMessage = (error as any).response?.data?.detail || 'Không thể xác minh email'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const resendVerification = createAsyncThunk('email/resendVerification', async (_, { rejectWithValue }) => {
  try {
    const response = await emailService.resendVerification()
    return response.data
  } catch (error) {
    const errorMessage = (error as any).response?.data?.detail || 'Không thể gửi lại mã xác minh'
    toast.error(errorMessage)
    return rejectWithValue(errorMessage)
  }
})

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    resetEmailState: (state) => {
      state.emailStatus = initialState.emailStatus
      state.verificationSent = initialState.verificationSent
      state.timeRemaining = initialState.timeRemaining
      state.error = initialState.error
      state.loading = initialState.loading
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmailStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEmailStatus.fulfilled, (state, action) => {
        state.loading = false
        state.emailStatus = action.payload
        state.error = null
      })
      .addCase(fetchEmailStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(changeEmail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(changeEmail.fulfilled, (state, action) => {
        state.loading = false
        state.emailStatus = {
          ...state.emailStatus,
          pending_email: action.payload.pending_email
        }
        state.verificationSent = action.payload.verification_sent
        state.timeRemaining = 120 // 2 phút
      })
      .addCase(changeEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(verifyEmail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false
        state.emailStatus = {
          ...state.emailStatus,
          current_email: action.payload.email,
          email_verified: action.payload.verified
        }
        state.verificationSent = false
        toast.success(action.payload.message)
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(resendVerification.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resendVerification.fulfilled, (state, action) => {
        state.loading = false
        state.emailStatus = {
          ...state.emailStatus,
          pending_email: action.payload.pending_email
        }
        state.verificationSent = true
        state.timeRemaining = 120 // 2 phút
        toast.success(action.payload.message)
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { resetEmailState, setTimeRemaining } = emailSlice.actions
const emailReducer = emailSlice.reducer
export default emailReducer
