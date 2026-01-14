import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth.service'

export const useCompaniesStore = defineStore('companies', () => {
  const companies = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const hasCompanies = computed(() => companies.value.length > 0)

  // Actions
  async function fetchCompanies(force = false) {
    if (companies.value.length && !force) {
      return companies.value
    }

    try {
      loading.value = true
      error.value = null
      
      const response = await authService.getCompanies()

      //De lo que viene de la API
      companies.value = response.data.filter(e => e.login === true).map(company => ({
        id: company.idEmpresa,
        name: company.nombre
      }))

    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar empresas'
      console.error('Error fetching companies:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function reset() {
    companies.value = []
    loading.value = false
    error.value = null
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    companies,
    loading,
    error,
    // Getters
    hasCompanies,
    // Actions
    fetchCompanies,
    reset,
    clearError
  }
})
