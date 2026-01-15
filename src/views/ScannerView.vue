<template>
  <div class="scanner-view">
    <!-- Header -->
    <div class="scanner-header">
      <button @click="goBack" class="btn-icon">
        ← Volver
      </button>
      <div class="header-info">
        <span class="sucursal-name">{{ authStore.sucursalNombre }}</span>
        <span class="items-count">{{ cotizacionStore.itemsCount }} artículos</span>
      </div>
      <button 
        @click="verCotizacion" 
        class="btn-icon"
        :disabled="cotizacionStore.itemsCount === 0"
      >
        🛒 Ver
      </button>
    </div>

    <!-- Scanner Component -->
    <BarcodeScanner @code-detected="handleCodeDetected" />

    <!-- Loading Overlay -->
    <div v-if="isLoadingArticulo" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Buscando artículo...</p>
    </div>

    <!-- Artículo encontrado modal -->
    <transition name="slide-up">
      <div v-if="articuloEncontrado" class="articulo-modal">
        <div class="articulo-content">
          <h3>✓ Artículo Encontrado</h3>
          <div class="articulo-info">
            <p class="articulo-clave">{{ articuloEncontrado.clave_Articulo }}</p>
            <p class="articulo-descripcion">{{ articuloEncontrado.nombre }}</p>
            <p class="articulo-precio">${{ formatPrice(articuloEncontrado.precio) }}</p>
            <p class="articulo-existencia">
              Existencia: <strong>{{ articuloEncontrado.existencia }}</strong> Unidad Medidad: <strong>{{ articuloEncontrado.unidad_Venta }}</strong>
            </p>
          </div>
          <button @click="agregarArticulo" class="btn btn-success btn-block">
            Agregar a Cotización
          </button>
          <button @click="cerrarModal" class="btn btn-secondary btn-block mt-1">
            Cancelar
          </button>
        </div>
      </div>
    </transition>

    <!-- Error toast -->
    <transition name="fade">
      <div v-if="errorMsg" class="error-toast">
        {{ errorMsg }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCotizacionStore } from '@/stores/cotizacion'
import { useVibration } from '@/composables/useVibration'
import BarcodeScanner from '@/components/Scanner/BarcodeScanner.vue'
import articulosService from '@/services/articulos.service'

const router = useRouter()
const authStore = useAuthStore()
const cotizacionStore = useCotizacionStore()
const { vibrateSuccess, vibrateError } = useVibration()

const isLoadingArticulo = ref(false)
const articuloEncontrado = ref(null)
const errorMsg = ref('')

async function handleCodeDetected(codigo) {
  try {
    isLoadingArticulo.value = true
    errorMsg.value = ''
    
    const articulo = await articulosService.buscarPorCodigo(
      codigo, 
      authStore.sucursalId,
      authStore.companyId
    )
    
    if (articulo) {
      articuloEncontrado.value = articulo
      vibrateSuccess()
    } else {
      throw new Error('Artículo no encontrado')
    }
  } catch (error) {
    vibrateError()
    errorMsg.value = error.message || 'Artículo no encontrado'
    setTimeout(() => {
      errorMsg.value = ''
    }, 3000)
  } finally {
    isLoadingArticulo.value = false
  }
}

function agregarArticulo() {
  cotizacionStore.addItem(articuloEncontrado.value)
  vibrateSuccess()
  articuloEncontrado.value = null
}

function cerrarModal() {
  articuloEncontrado.value = null
}

function verCotizacion() {
  router.push('/cotizacion')
}

function goBack() {
  router.push('/sucursal')
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}
</script>

<style scoped>
.scanner-view {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #000;
}

.scanner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 10;
}

.btn-icon {
  background: transparent;
  border: none;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.btn-icon:active {
  background-color: rgba(255, 255, 255, 0.2);
}

.btn-icon:disabled {
  opacity: 0.5;
}

.header-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.sucursal-name {
  font-size: 14px;
  font-weight: 600;
}

.items-count {
  font-size: 12px;
  opacity: 0.9;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  color: white;
}

.loading-overlay p {
  margin-top: 16px;
  font-size: 16px;
}

.articulo-modal {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-radius: 20px 20px 0 0;
  padding: 24px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  z-index: 100;
  max-height: 70vh;
  overflow-y: auto;
}

.articulo-content h3 {
  color: var(--success-color);
  margin-bottom: 16px;
  text-align: center;
}

.articulo-info {
  background-color: var(--background);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.articulo-clave {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.articulo-descripcion {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.articulo-precio {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.articulo-existencia {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.error-toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--error-color);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  z-index: 101;
  font-size: 14px;
  font-weight: 600;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
