import { createSlice } from "@reduxjs/toolkit"

interface AuthState {
  isAuthenticated: boolean
  user: {
    id: string
    name: string
    email: string
  } | null
  roles: string[]
  token: string | null
  loading: boolean
  error: string | null
}

const userSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    roles: [],
    token: null,
    loading: false,
    error: null,
  } as AuthState,
  reducers: {
    loginStart(state) {
      state.loading = true
      state.error = null
    },
    loginSuccess(state, action) {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.roles = action.payload.roles
      state.token = action.payload.token
      state.loading = false
      state.error = null
    },
    loginFailure(state, action) {
      state.loading = false
      state.error = action.payload.error
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
      state.roles = []
      state.token = null
    },
  },
})

const authReducer = userSlice.reducer
export const authActions = userSlice.actions


export default authReducer