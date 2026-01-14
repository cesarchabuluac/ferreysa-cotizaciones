import api from './api'

export default {
  async getCompanies() {
    return await api.get('/api/Conexiones/GetConnectionByStatus/1')
  }
}
