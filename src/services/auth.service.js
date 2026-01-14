import api from './api'
import { getDeviceId } from './device.service'

export default {
  async login(payload) {
    const deviceId = getDeviceId()
    const response = await api.post('/v2/Auth/login', { ...payload, deviceId })

    if (!response?.isSuccessful) {
      throw new Error(response?.message || 'Login fallido')
    }

    const data = response.data || {}

    // Normalizar mayúsculas/minúsculas provenientes del backend (.NET suele serializar en PascalCase)
    return {
      token: data.token ?? data.Token,
      expiration: data.expiration ?? data.Expiration,
      refreshToken: data.refreshToken ?? data.RefreshToken,
      companyId: data.idEmpresa ?? data.companyId,
      sucursalId: data.sucursalId,
      sucursalNombre: data.nombreSucursal,
      usuario: {
        id: data.id,
        username: data.userName ?? data.username,
        nombre: data.fullName ?? data.nombre ?? data.name,
        rol: data.rol ?? data.role,
        rol_id: data.rol_id ?? data.roleId
      }
    }
  },

  async getCompanies() {
    return await api.get('/Conexiones/GetConnectionByStatus/1')
  },

  async getSucursales(idEmpresa) {
    return await api.get(`/v2/Auth/sucursales/${idEmpresa}`)
  },

  async validateToken() {
    return await api.get('/v2/Auth/validate')
  }
}
