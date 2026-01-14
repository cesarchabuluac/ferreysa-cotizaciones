import api from './api'
import { getDeviceId } from './device.service'

export default {
  async login(payload) {
    const deviceId = getDeviceId()
    const response = await api.post('/v2/Auth/login', { ...payload, deviceId })

    // Normalizar mayúsculas/minúsculas provenientes del backend (.NET suele serializar en PascalCase)
    return {
      token: response.token ?? response.Token,
      expiration: response.expiration ?? response.Expiration,
      usuario: response.usuario ?? response.Usuario
    }
  },

  async getCompanies() {
    return await api.get('/Conexiones/GetConnectionByStatus/1')
  },

  async getSucursales() {
    return await api.get('/v2/Auth/sucursales')
  },

  async validateToken() {
    return await api.get('/v2/Auth/validate')
  }
}
