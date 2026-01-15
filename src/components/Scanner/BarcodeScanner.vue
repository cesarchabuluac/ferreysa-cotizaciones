<template>
  <div class="scanner-container">
    <div class="video-wrapper">
      <video 
        ref="videoRef" 
        class="scanner-video"
        playsinline
        autoplay
        muted
      ></video>
      
      <!-- Overlay con guías de escaneo -->
      <div class="scanner-overlay">
        <div class="scan-area">
          <div class="corner corner-tl"></div>
          <div class="corner corner-tr"></div>
          <div class="corner corner-bl"></div>
          <div class="corner corner-br"></div>
          <div class="scan-line" v-if="isScanning"></div>
        </div>
      </div>

      <!-- Instrucciones -->
      <div class="instructions">
        <p>{{ instructionText }}</p>
      </div>
    </div>

    <!-- Controles -->
    <div class="controls">
      <button 
        v-if="!isScanning" 
        @click="handleStart" 
        class="btn btn-primary btn-block"
        :disabled="hasError"
      >
        <span v-if="!hasError" class="icon-text">
          <i class="fa-solid fa-camera" aria-hidden="true"></i>
          <span>Iniciar Escáner</span>
        </span>
        <span v-else class="icon-text">
          <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
          <span>Error de Cámara</span>
        </span>
      </button>
      
      <button 
        v-else 
        @click="handleStop" 
        class="btn btn-secondary btn-block"
      >
        <span class="icon-text">
          <i class="fa-solid fa-stop" aria-hidden="true"></i>
          <span>Detener Escáner</span>
        </span>
      </button>

      <!-- Input manual como fallback -->
      <div class="manual-input mt-2">
        <input 
          v-model="manualCode"
          type="text"
          inputmode="numeric"
          placeholder="O ingresa el código manualmente"
          class="input-field"
          @keyup.enter="handleManualInput"
        >
        <button 
          @click="handleManualInput" 
          class="btn btn-success"
          :disabled="!manualCode"
          aria-label="Agregar código manual"
        >
          <i class="fa-solid fa-check" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <!-- Último código escaneado -->
    <div v-if="lastCode" class="last-scanned">
      <p><strong>Último código:</strong> {{ lastCode }}</p>
    </div>

    <!-- Error -->
    <div v-if="errorMessage" class="alert alert-error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useScanner } from '@/composables/useScanner'
import { useVibration } from '@/composables/useVibration'

const emit = defineEmits(['code-detected'])

const videoRef = ref(null)
const manualCode = ref('')
const lastCode = ref(null)

const { 
  isScanning, 
  error, 
  startScanning, 
  stopScanning,
  checkCameraAvailability 
} = useScanner()

const { vibrateSuccess } = useVibration()

const hasError = computed(() => !!error.value)
const errorMessage = computed(() => error.value)

const instructionText = computed(() => {
  if (hasError.value) return 'No se pudo acceder a la cámara'
  if (isScanning.value) return 'Apunta la cámara al código de barras'
  return 'Presiona el botón para iniciar el escáner'
})

async function handleStart() {
  try {
    await startScanning(videoRef.value, handleCodeDetected)
  } catch (err) {
    console.error('Error al iniciar escáner:', err)
  }
}

function handleStop() {
  stopScanning()
}

function handleCodeDetected(code) {
  lastCode.value = code
  vibrateSuccess()
  emit('code-detected', code)
}

function handleManualInput() {
  if (manualCode.value) {
    handleCodeDetected(manualCode.value)
    manualCode.value = ''
  }
}

onMounted(async () => {
  // Verificar disponibilidad de cámara
  const hasCamera = await checkCameraAvailability()
  if (!hasCamera) {
    error.value = 'No se detectó ninguna cámara en el dispositivo'
  }
})

onBeforeUnmount(() => {
  stopScanning()
})
</script>

<style scoped>
.scanner-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #000;
}

.video-wrapper {
  position: relative;
  flex: 1;
  overflow: hidden;
  background-color: #000;
}

.scanner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.scan-area {
  position: relative;
  width: 80%;
  max-width: 400px;
  aspect-ratio: 16/9;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 3px solid #fff;
}

.corner-tl {
  top: -3px;
  left: -3px;
  border-right: none;
  border-bottom: none;
}

.corner-tr {
  top: -3px;
  right: -3px;
  border-left: none;
  border-bottom: none;
}

.corner-bl {
  bottom: -3px;
  left: -3px;
  border-right: none;
  border-top: none;
}

.corner-br {
  bottom: -3px;
  right: -3px;
  border-left: none;
  border-top: none;
}

.scan-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4CAF50, transparent);
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0% {
    top: 0%;
  }
  50% {
    top: 100%;
  }
  100% {
    top: 0%;
  }
}

.instructions {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: #fff;
  font-size: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  padding: 0 20px;
}

.controls {
  padding: 16px;
  background-color: #fff;
}

.manual-input {
  display: flex;
  gap: 8px;
}

.manual-input .input-field {
  flex: 1;
}

.manual-input .btn {
  width: 60px;
  padding: 12px;
}

.last-scanned {
  padding: 12px 16px;
  background-color: #E8F5E9;
  text-align: center;
}

.last-scanned p {
  margin: 0;
  color: #2E7D32;
  font-size: 14px;
}
</style>
