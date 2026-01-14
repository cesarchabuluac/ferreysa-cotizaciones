import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || null)
  const usuario = ref(JSON.parse(localStorage.getItem('usuario') || 'null'))
  const companyId = ref(localStorage.getItem('companyId') || null)
  const sucursalId = ref(localStorage.getItem('sucursalId') || null)
  const sucursalNombre = ref(localStorage.getItem('sucursalNombre') || null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const hasSucursal = computed(() => !!sucursalId.value)

  // Actions
  async function login(payload) {
    try {
      const response = await authService.login(payload)

      token.value = response.token
      usuario.value = response.usuario
      companyId.value = payload.idEmpresa ?? payload.company

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
    sucursalId.value = id
    sucursalNombre.value = nombre
    
    localStorage.setItem('sucursalId', id)
    localStorage.setItem('sucursalNombre', nombre)
  }

  function logout() {
    token.value = null
    usuario.value = null
    companyId.value = null
    sucursalId.value = null
    sucursalNombre.value = null
    
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    localStorage.removeItem('companyId')
    localStorage.removeItem('sucursalId')
    localStorage.removeItem('sucursalNombre')
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
    
    // Getters
    isAuthenticated,
    hasSucursal,
    
    // Actions
    login,
    setSucursal,
    logout,
    checkAuth
  }
})
