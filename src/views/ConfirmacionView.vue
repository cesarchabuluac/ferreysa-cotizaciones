<template>
  <div class="confirmacion-view">
    <div class="container">
      <!-- Success State -->
      <div class="success-animation">
        <div class="checkmark-circle">
          <div class="checkmark">
            <i class="fa-solid fa-check" aria-hidden="true"></i>
          </div>
        </div>
      </div>

      <h1 class="title">¡Cotización Creada!</h1>

      <div class="folio-display">
        <p class="folio-label">Folio</p>
        <p class="folio-number">{{ folio }}</p>
      </div>

      <div class="info-card">
        <p class="info-text">
          El cliente debe llevar este folio a caja para realizar el cobro.
        </p>
      </div>

      <div class="actions">
        <button 
          @click="imprimirTicket" 
          class="btn btn-primary btn-block"
          :disabled="isImpriendo"
        >
          <span v-if="!isImpriendo" class="icon-text">
            <i class="fa-solid fa-print" aria-hidden="true"></i>
            <span>Imprimir Ticket</span>
          </span>
          <span v-else>Imprimiendo...</span>
        </button>

        <button 
          @click="nuevaCotizacion" 
          class="btn btn-success btn-block mt-2"
        >
          <span class="icon-text">
            <i class="fa-solid fa-plus" aria-hidden="true"></i>
            <span>Nueva Cotización</span>
          </span>
        </button>

        <button 
          @click="verDetalle" 
          class="btn btn-secondary btn-block mt-2"
        >
          <span class="icon-text">
            <i class="fa-regular fa-file-lines" aria-hidden="true"></i>
            <span>Ver Detalle</span>
          </span>
        </button>
      </div>

      <!-- Compartir (Web Share API) -->
      <div v-if="canShare" class="share-section mt-3">
        <button @click="compartir" class="btn-share">
          <span class="icon-text">
            <i class="fa-solid fa-share-from-square" aria-hidden="true"></i>
            <span>Compartir Folio</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useVibration } from '@/composables/useVibration'
import cotizacionesService from '@/services/cotizaciones.service'

const router = useRouter()
const route = useRoute()
const { vibrateSuccess } = useVibration()

const folio = ref(route.params.folio)
const isImpriendo = ref(false)
const cotizacionDetalle = ref(null)

const canShare = computed(() => {
  return navigator.share !== undefined
})

onMounted(() => {
  vibrateSuccess()
})

async function imprimirTicket() {
  try {
    isImpriendo.value = true
    
    // Obtener datos de impresión desde el backend
    const datosImpresion = await cotizacionesService.imprimir(folio.value)
    
    // Aquí implementarías la lógica de impresión
    // Puede ser: Bluetooth printer, Cloud Print, o generar PDF
    
    // Por ahora, abrir ventana de impresión del navegador
    imprimirEnNavegador(datosImpresion)
    
  } catch (error) {
    alert('Error al imprimir: ' + error.message)
  } finally {
    isImpriendo.value = false
  }
}

function imprimirEnNavegador(datos) {
  // Crear HTML para impresión
  const ventanaImpresion = window.open('', '_blank')
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cotización ${folio.value}</title>
      <style>
        body { font-family: monospace; width: 80mm; margin: 0 auto; padding: 10px; }
        h1 { text-align: center; font-size: 18px; margin: 10px 0; }
        .folio { text-align: center; font-size: 24px; font-weight: bold; margin: 15px 0; }
        .info { font-size: 12px; margin-bottom: 10px; }
        .linea { border-top: 1px dashed #000; margin: 10px 0; }
        table { width: 100%; font-size: 11px; }
        .total { font-size: 14px; font-weight: bold; text-align: right; }
        @media print {
          body { width: auto; }
        }
      </style>
    </head>
    <body>
      <h1>COTIZACIÓN</h1>
      <div class="folio">FOLIO: ${folio.value}</div>
      <div class="linea"></div>
      <div class="info">
        Fecha: ${new Date().toLocaleDateString('es-MX')}<br>
        Hora: ${new Date().toLocaleTimeString('es-MX')}<br>
        Sucursal: ${datos.sucursal || 'N/A'}
      </div>
      <div class="linea"></div>
      <p><strong>Presentar este ticket en caja para realizar el cobro</strong></p>
      <div class="linea"></div>
    </body>
    </html>
  `
  
  ventanaImpresion.document.write(html)
  ventanaImpresion.document.close()
  
  setTimeout(() => {
    ventanaImpresion.print()
  }, 250)
}

async function compartir() {
  try {
    await navigator.share({
      title: 'Cotización Ferreysa',
      text: `Folio de cotización: ${folio.value}\n\nPresentar en caja para realizar el cobro.`,
    })
  } catch (error) {
    console.log('Error al compartir:', error)
  }
}

function nuevaCotizacion() {
  router.push('/scanner')
}

async function verDetalle() {
  try {
    cotizacionDetalle.value = await cotizacionesService.obtenerPorFolio(folio.value)
    // Mostrar modal con detalle (por implementar)
    alert('Detalle de cotización:\n' + JSON.stringify(cotizacionDetalle.value, null, 2))
  } catch (error) {
    alert('Error al obtener detalle: ' + error.message)
  }
}
</script>

<style scoped>
.confirmacion-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 400px;
}

.success-animation {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.checkmark-circle {
  width: 120px;
  height: 120px;
  background-color: var(--success-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleIn 0.5s ease;
}

.checkmark {
  color: white;
  font-size: 60px;
  font-weight: bold;
  animation: fadeIn 0.5s ease 0.3s both;
}

.checkmark i {
  font-size: 60px;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.title {
  color: white;
  text-align: center;
  font-size: 28px;
  margin-bottom: 24px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.folio-display {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.folio-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.folio-number {
  font-size: 36px;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
  letter-spacing: 2px;
}

.info-card {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-text {
  font-size: 14px;
  color: var(--text-primary);
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

.actions {
  margin-bottom: 16px;
}

.share-section {
  text-align: center;
}

.btn-share {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-share:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.98);
}
</style>
