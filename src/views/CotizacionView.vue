<template>
  <div class="cotizacion-view">
    <!-- Header -->
    <div class="cotizacion-header">
      <button @click="goBack" class="btn-icon">
        <span class="icon-text">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          <span>Volver</span>
        </span>
      </button>
      <h2>Cotización</h2>
      <button @click="limpiar" class="btn-icon" v-if="cotizacionStore.itemsCount > 0">
        <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
        <span class="sr-only">Limpiar cotización</span>
      </button>
    </div>

    <!-- Content -->
    <div class="cotizacion-content">
      <!-- Lista vacía -->
      <div v-if="cotizacionStore.itemsCount === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fa-solid fa-box-open" aria-hidden="true"></i>
        </div>
        <h3>No hay artículos</h3>
        <p>Escanea artículos para agregarlos a la cotización</p>
        <button @click="goBack" class="btn btn-primary">
          Ir a Escáner
        </button>
      </div>

      <!-- Lista de artículos -->
      <div v-else class="items-list">
        <div 
          v-for="(item, index) in cotizacionStore.items" 
          :key="index"
          class="item-card"
        >
          <div class="item-info">
            <p class="item-clave">{{ item.claveArticulo }}</p>
            <p class="item-descripcion">{{ item.descripcion }}</p>
            <p class="item-precio">${{ formatPrice(item.precioUnitario) }}</p>
          </div>

          <div class="item-controls">
            <div class="quantity-control">
              <button 
                @click="decrementQuantity(index)"
                class="qty-btn"
              >
                -
              </button>
              <input 
                type="number" 
                v-model.number="item.unidades"
                @change="updateQuantity(index, item.unidades)"
                class="qty-input"
                min="1"
              />
              <button 
                @click="incrementQuantity(index)"
                class="qty-btn"
              >
                +
              </button>
            </div>

            <div class="item-total">
              <span class="total-label">Total:</span>
              <span class="total-amount">${{ formatPrice(calcularTotalItem(item)) }}</span>
            </div>

            <button 
              @click="removeItem(index)"
              class="btn-remove"
            >
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
              <span class="sr-only">Eliminar artículo</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer con resumen -->
    <div v-if="cotizacionStore.itemsCount > 0" class="cotizacion-footer">
      <div class="resumen">
        <div class="resumen-row">
          <span>Subtotal:</span>
          <span>${{ formatPrice(cotizacionStore.subtotal) }}</span>
        </div>
        <div class="resumen-row">
          <span>IVA (8%):</span>
          <span>${{ formatPrice(cotizacionStore.totalImpuestos) }}</span>
        </div>
        <div class="resumen-row total-row">
          <span>Total:</span>
          <span>${{ formatPrice(cotizacionStore.total) }}</span>
        </div>
      </div>

      <button 
        @click="confirmarCotizacion" 
        class="btn btn-success btn-block"
        :disabled="isProcessing"
      >
        <span v-if="!isProcessing" class="icon-text">
          <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
          <span>Confirmar Cotización</span>
        </span>
        <span v-else>Procesando...</span>
      </button>
    </div>

    <!-- Error -->
    <div v-if="errorMsg" class="alert alert-error error-fixed">
      {{ errorMsg }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCotizacionStore } from '@/stores/cotizacion'
import { useVibration } from '@/composables/useVibration'
import { useAlerts } from '@/composables/useAlerts'
import cotizacionesService from '@/services/cotizaciones.service'

const router = useRouter()
const authStore = useAuthStore()
const cotizacionStore = useCotizacionStore()
const { vibrateSuccess, vibrateError } = useVibration()
const { confirm, error: showError } = useAlerts()

const isProcessing = ref(false)
const errorMsg = ref('')

function goBack() {
  router.push('/scanner')
}

async function limpiar() {
  const accepted = await confirm({
    title: 'Limpiar cotización',
    text: 'Se eliminarán todos los artículos de la lista.',
    icon: 'warning',
    confirmButtonText: 'Sí, limpiar',
    cancelButtonText: 'Cancelar'
  })
  if (!accepted) return
  cotizacionStore.clear()
  goBack()
}

function incrementQuantity(index) {
  cotizacionStore.updateQuantity(index, cotizacionStore.items[index].unidades + 1)
}

function decrementQuantity(index) {
  const newQty = cotizacionStore.items[index].unidades - 1
  if (newQty > 0) {
    cotizacionStore.updateQuantity(index, newQty)
  } else {
    removeItem(index)
  }
}

function updateQuantity(index, cantidad) {
  cotizacionStore.updateQuantity(index, cantidad)
}

async function removeItem(index) {
  const accepted = await confirm({
    title: 'Eliminar artículo',
    text: '¿Quieres quitar este artículo de la cotización?',
    icon: 'warning',
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  })
  if (accepted) {
    cotizacionStore.removeItem(index)
  }
}

/**
 * Calcula el total de un artículo
 * NOTA: Por ahora no se incluye impuestos en subtotal de la partida ya que se aplica de forma global
 * @param item 
 */
function calcularTotalItem(item) {
  const subtotal = item.precioUnitario * item.unidades
  const descuento = subtotal * (item.pctjeDscto / 100)
  const neto = subtotal - descuento
  const impuesto = neto * (item.tasaImpuesto / 100)
  return neto //+ impuesto
}

async function confirmarCotizacion() {
  try {
    isProcessing.value = true
    errorMsg.value = ''

    // Preparar DTO
    const cotizacionDTO = cotizacionStore.getCotizacionDTO(
      authStore.sucursalId,
      authStore.usuario.id
    )

    // Enviar al backend
    const result = await cotizacionesService.crear(cotizacionDTO)

    vibrateSuccess()

    // Limpiar cotización
    cotizacionStore.clear()

    // Navegar a confirmación
    router.push(`/confirmacion/${result.folio}`)
  } catch (error) {
    vibrateError()
    errorMsg.value = error.message || 'Error al crear la cotización'
    showError('Error', errorMsg.value)
    setTimeout(() => {
      errorMsg.value = ''
    }, 5000)
  } finally {
    isProcessing.value = false
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}
</script>

<style scoped>
.cotizacion-view {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background);
}

.cotizacion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: var(--surface);
  box-shadow: var(--shadow);
  z-index: 10;
}

.cotizacion-header h2 {
  color: var(--text-primary);
  font-size: 20px;
  margin: 0;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: var(--primary-color);
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px;
  line-height: 1;
}

.cotizacion-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 280px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 16px;
  color: var(--border-dark);
}

.empty-state h3 {
  color: var(--text-primary);
  margin-bottom: 8px;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card {
  background: var(--surface);
  border-radius: 12px;
  padding: 16px;
  box-shadow: var(--shadow);
}

.item-info {
  margin-bottom: 12px;
}

.item-clave {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.item-descripcion {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.item-precio {
  font-size: 16px;
  color: var(--primary-color);
  font-weight: 700;
  margin: 0;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--background);
  border-radius: 8px;
  padding: 4px;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: none;
  background-color: var(--primary-color);
  /* color: white; */
  border-radius: 6px;
  font-size: 32px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}

.qty-btn:active {
  background-color: var(--primary-dark);
}

.qty-input {
  width: 50px;
  text-align: center;
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.item-total {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.total-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.total-amount {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.btn-remove {
  width: 36px;
  height: 36px;
  border: none;
  background-color: var(--error-color);
  /* color: white; */
  border-radius: 6px;
  font-size: 20px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cotizacion-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--surface);
  padding: 16px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.resumen {
  margin-bottom: 16px;
}

.resumen-row {
  display: flex;
  justify-content: space-between;
  /* padding: 8px 0; */
  font-size: 16px;
  color: var(--text-primary);
}

.total-row {
  border-top: 2px solid var(--divider-color);
  padding-top: 12px;
  margin-top: 8px;
  font-size: 22px;
  font-weight: 700;
  color: var(--primary-color);
}

.error-fixed {
  position: fixed;
  top: 80px;
  left: 16px;
  right: 16px;
  z-index: 100;
}
</style>
