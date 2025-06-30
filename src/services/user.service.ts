import apiInstance from './axios.config'

const userService = {
  getMe: async () => {
    return apiInstance.get('/user/me')
  }
}

export default userService
