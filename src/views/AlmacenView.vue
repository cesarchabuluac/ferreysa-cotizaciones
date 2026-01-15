<template>
  <div class="almacen-view">
    <div class="container">
      <div class="header">
        <h2>Seleccionar Almacén</h2>
        <p><strong>{{ authStore.usuario?.nombre }}</strong></p>
        <p class="sucursal-info">Sucursal: {{ authStore.sucursalNombre }}</p>
      </div>

      <div v-if="isLoading" class="loading-spinner"></div>

      <div v-else-if="errorMsg" class="alert alert-error">
        {{ errorMsg }}
      </div>

      <div v-else class="almacenes-grid">
        <div 
          v-for="almacen in almacenes" 
          :key="almacen.almacen_Id"
          @click="selectAlmacen(almacen)"
          class="almacen-card"
        >
          <div class="almacen-icon">
            <i class="fa-solid fa-warehouse" aria-hidden="true"></i>
          </div>
          <h3>{{ almacen.almacen }}</h3>
          <p class="almacen-info">{{ almacen.sucursal }}</p>
        </div>
      </div>

      <div v-if="!isLoading && almacenes.length === 0" class="empty-state">
        <p>No hay almacenes disponibles para esta sucursal</p>
      </div>

      <button @click="handleBack" class="btn btn-accent btn-block">
        <span class="icon-text">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          <span>Cambiar Sucursal</span>
        </span>
      </button>
      
      <button @click="handleLogout" class="btn btn-primary btn-block mt-3">
        <span class="icon-text">
          <i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>
          <span>Cerrar Sesión</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCotizacionStore } from '@/stores/cotizacion'
import { useAlerts } from '@/composables/useAlerts'
import authService from '@/services/auth.service'

const router = useRouter()
const authStore = useAuthStore()
const cotizacionStore = useCotizacionStore()
const { confirm } = useAlerts()

const almacenes = ref([])
const isLoading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  try {
    const response = await authService.getAlmacenes(
      authStore.companyId, 
      authStore.sucursalId
    )
    
    if (response?.isSuccessful) {
      almacenes.value = response.data || []
    } else {
      errorMsg.value = response?.message || 'Error al cargar almacenes'
    }
  } catch (error) {
    errorMsg.value = 'Error al cargar almacenes'
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

async function selectAlmacen(almacen) {
  if (!almacen) return

  // Si hay artículos y se cambia de almacén, advertir que se limpia la cotización
  if (cotizacionStore.itemsCount > 0 && almacen.almacen_Id !== authStore.almacenId) {
    const accepted = await confirm({
      title: 'Cotización pendiente',
      text: 'Si cambias de almacén se borrarán los artículos del carrito.',
      icon: 'warning',
      confirmButtonText: 'Continuar y borrar',
      cancelButtonText: 'Cancelar'
    })
    if (!accepted) return
    cotizacionStore.clear()
  }
  
  authStore.setAlmacen(almacen.almacen_Id, almacen.almacen)
  router.push('/scanner')
}

async function handleBack() {
  // Si hay artículos, confirmar antes de limpiar
  if (cotizacionStore.itemsCount > 0) {
    const accepted = await confirm({
      title: 'Cotización pendiente',
      text: 'Tienes artículos en el carrito. Si cambias de sucursal se borrarán.',
      icon: 'warning',
      confirmButtonText: 'Continuar y borrar',
      cancelButtonText: 'Mantenerme aquí'
    })
    if (!accepted) return
  }

  localStorage.removeItem('almacenId')
  localStorage.removeItem('almacenNombre')
  cotizacionStore.clear()
  router.push('/sucursal')
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.almacen-view {
  min-height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
  background-color: var(--background);
  padding: 20px 0;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling en iOS */
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
  margin: 4px 0;
}

.sucursal-info {
  font-size: 14px;
  color: var(--text-secondary);
  font-style: italic;
}

.almacenes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.almacen-card {
  background: var(--surface);
  border-radius: var(--radius-md);
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition);
  box-shadow: var(--shadow-md);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.almacen-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--gradient-secondary);
  transform: scaleX(0);
  transition: transform var(--transition);
}

.almacen-card:hover::before {
  transform: scaleX(1);
}

.almacen-card:active {
  transform: scale(0.97);
  box-shadow: var(--shadow-lg);
  border-color: var(--secondary);
  background: linear-gradient(to bottom, var(--surface) 0%, #FFF3E0 100%);
}

.almacen-icon {
  font-size: 48px;
  margin-bottom: 12px;
  color: var(--secondary);
}

.almacen-card h3 {
  color: var(--text-primary);
  font-size: 16px;
  margin-bottom: 8px;
  font-weight: 600;
}

.almacen-info {
  color: var(--text-secondary);
  font-size: 12px;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}

.btn {
  padding: 14px 20px;
  border-radius: var(--radius);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition);
  border: none;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn:active {
  transform: scale(0.98);
}

.btn-block {
  display: block;
  width: 100%;
}

.btn-accent {
  background: var(--gradient-dark);
  color: var(--text-white);
  box-shadow: var(--shadow-md);
  margin-top: 24px;
}

.btn-accent:active {
  background: var(--accent-gray);
}

.btn-primary {
  background: var(--gradient-primary);
  color: var(--text-white);
  box-shadow: var(--shadow-primary);
}

.btn-primary:active {
  background: var(--primary-dark);
}

.mt-3 {
  margin-top: 12px;
}

.loading-spinner {
  border: 4px solid var(--border);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 40px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.alert {
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.alert-error {
  background-color: #fee;
  color: #c33;
  border: 1px solid #fcc;
}
</style>
