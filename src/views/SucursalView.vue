<template>
  <div class="sucursal-view">
    <div class="container">
      <div class="header">
        <h2>Seleccionar Sucursal</h2>
        <p>Hola, <strong>{{ authStore.usuario?.nombre }}</strong></p>
      </div>

      <div v-if="isLoading" class="loading-spinner"></div>

      <div v-else-if="errorMsg" class="alert alert-error">
        {{ errorMsg }}
      </div>

      <div v-else class="sucursales-grid">
        <div 
          v-for="sucursal in sucursales" 
          :key="sucursal.sucursalId"
          @click="selectSucursal(sucursal)"
          class="sucursal-card"
        >
          <div class="sucursal-icon">
            <!-- 🏢 -->
             <img src="/logo/ferreysa.png" alt="Logo Ferreysa" height="65" />
            </div>
          <h3>{{ sucursal.nombre }}</h3>
          <p class="sucursal-info">{{ sucursal.direccion }}</p>
        </div>
      </div>

      <button @click="handleLogout" class="btn btn-secondary btn-block mt-3">
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import authService from '@/services/auth.service'

const router = useRouter()
const authStore = useAuthStore()

const sucursales = ref([])
const isLoading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  try {
    const response = await authService.getSucursales(authStore.companyId)
    if (response?.isSuccessful) {
      sucursales.value = response.data
    }
    else {
      errorMsg.value = response?.message || 'Error al cargar sucursales'
    }
  } catch (error) {
    errorMsg.value = 'Error al cargar sucursales'
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

function selectSucursal(sucursal) {
    if(!sucursal) return
    authStore.setSucursal(sucursal.sucursalId, sucursal.nombre)
    router.push('/scanner')
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sucursal-view {
  min-height: 100vh;
  background-color: var(--background);
  padding: 20px 0;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.header h2 {
  color: var(--text-primary);
  margin-bottom: 8px;
}

.header p {
  color: var(--text-secondary);
}

.sucursales-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.sucursal-card {
  background: var(--surface);
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow);
}

.sucursal-card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-lg);
  background-color: var(--primary-light);
}

.sucursal-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.sucursal-card h3 {
  color: var(--text-primary);
  font-size: 16px;
  margin-bottom: 8px;
}

.sucursal-info {
  color: var(--text-secondary);
  font-size: 12px;
  margin: 0;
}
</style>
