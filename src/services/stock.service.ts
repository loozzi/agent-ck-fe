import apiInstance from './axios.config'

const stockService = {
  getAll: async () => {
    return apiInstance.get('/stocks')
  }
}

export default stockService
