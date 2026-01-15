import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth.service'
import { useCompaniesStore } from '@/stores/companies'
import { useCotizacionStore } from '@/stores/cotizacion'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || null)
  const usuario = ref(JSON.parse(localStorage.getItem('usuario') || 'null'))
  const companyId = ref(localStorage.getItem('companyId') || null)
  const sucursalId = ref(localStorage.getItem('sucursalId') || null)
  const sucursalNombre = ref(localStorage.getItem('sucursalNombre') || null)
  const almacenId = ref(localStorage.getItem('almacenId') || null)
  const almacenNombre = ref(localStorage.getItem('almacenNombre') || null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const hasSucursal = computed(() => !!sucursalId.value)
  const hasAlmacen = computed(() => !!almacenId.value)

  // Actions
  async function login(payload) {
    try {
      const response = await authService.login(payload)

      token.value = response.token
      usuario.value = response.usuario
      companyId.value = response.companyId ?? payload.idEmpresa ?? payload.company

      localStorage.setItem('token', token.value)
      localStorage.setItem('usuario', JSON.stringify(usuario.value))
      if (companyId.value) {
        localStorage.setItem('companyId', companyId.value)
      }

      return true
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  function setSucursal(id, nombre) {
    // Si cambia de sucursal, limpiar almacén y cotización para evitar datos cruzados
    if (sucursalId.value && sucursalId.value !== id) {
      const cotizacionStore = useCotizacionStore()
      cotizacionStore.clear()
      almacenId.value = null
      almacenNombre.value = null
      localStorage.removeItem('almacenId')
      localStorage.removeItem('almacenNombre')
    }

    sucursalId.value = id
    sucursalNombre.value = nombre
    
    localStorage.setItem('sucursalId', id)
    localStorage.setItem('sucursalNombre', nombre)
  }

  function setAlmacen(id, nombre) {
    almacenId.value = id
    almacenNombre.value = nombre
    
    localStorage.setItem('almacenId', id)
    localStorage.setItem('almacenNombre', nombre)
  }

  function logout() {
    const cotizacionStore = useCotizacionStore()
    cotizacionStore.clear()
    token.value = null
    usuario.value = null
    companyId.value = null
    sucursalId.value = null
    sucursalNombre.value = null
    almacenId.value = null
    almacenNombre.value = null
    const companiesStore = useCompaniesStore()
    companiesStore.reset()
    
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    localStorage.removeItem('companyId')
    localStorage.removeItem('sucursalId')
    localStorage.removeItem('sucursalNombre')
    localStorage.removeItem('almacenId')
    localStorage.removeItem('almacenNombre')
    //DeviceId  
    localStorage.removeItem('deviceId')
  }

  function checkAuth() {
    // Verificar si el token sigue siendo válido
    if (token.value) {
      // Aquí podrías validar el token con el backend si es necesario
      return true
    }
    return false
  }

  return {
    // State
    token,
    usuario,
    companyId,
    sucursalId,
    sucursalNombre,
    almacenId,
    almacenNombre,
    
    // Getters
    isAuthenticated,
    hasSucursal,
    hasAlmacen,
    
    // Actions
    login,
    setSucursal,
    setAlmacen,
    logout,
    checkAuth
  }
})
