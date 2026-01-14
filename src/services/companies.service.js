import api from './api'

export default {
  async getCompanies() {
    return await api.get('/Conexiones/GetConnectionByStatus/1')
  }
}
