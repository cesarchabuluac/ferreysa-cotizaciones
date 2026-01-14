import { ref, onUnmounted } from 'vue'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'

export function useScanner() {
  const codeReader = new BrowserMultiFormatReader()
  const isScanning = ref(false)
  const lastScannedCode = ref(null)
  const error = ref(null)
  const videoElement = ref(null)
  
  // Configuración del escáner
  const scanDelay = 500 // ms entre escaneos para evitar duplicados
  let lastScanTime = 0
  let currentStream = null

  /**
   * Iniciar el escáner de códigos de barras
   * @param {HTMLVideoElement} video - Elemento de video donde se mostrará la cámara
   * @param {Function} onDetect - Callback cuando se detecta un código
   */
  async function startScanning(video, onDetect) {
    try {
      error.value = null
      videoElement.value = video

      // Verificar soporte de getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso a la cámara')
      }

      // Solicitar acceso a la cámara trasera
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' }, // Cámara trasera
          width: { ideal: parseInt(import.meta.env.VITE_CAMERA_RESOLUTION_WIDTH) || 1280 },
          height: { ideal: parseInt(import.meta.env.VITE_CAMERA_RESOLUTION_HEIGHT) || 720 }
        },
        audio: false
      }

      currentStream = await navigator.mediaDevices.getUserMedia(constraints)
      video.srcObject = currentStream
      await video.play()

      isScanning.value = true

      // Iniciar el loop de escaneo continuo
      codeReader.decodeFromVideoElement(video, (result, err) => {
        if (result) {
          const now = Date.now()
          const code = result.getText()
          
          // Evitar escaneos duplicados
          if (now - lastScanTime > scanDelay && code !== lastScannedCode.value) {
            lastScanTime = now
            lastScannedCode.value = code
            
            // Feedback háptico
            if ('vibrate' in navigator) {
              navigator.vibrate(100)
            }
            
            // Callback con el código detectado
            if (onDetect) {
              onDetect(code)
            }
          }
        }
        
        if (err && !(err instanceof NotFoundException)) {
          console.warn('Error de escaneo:', err)
        }
      })
    } catch (err) {
      console.error('Error al iniciar escáner:', err)
      error.value = err.message || 'Error al acceder a la cámara'
      isScanning.value = false
      throw err
    }
  }

  /**
   * Detener el escáner
   */
  function stopScanning() {
    try {
      // Detener el lector de códigos
      codeReader.reset()
      
      // Detener todos los tracks del stream
      if (currentStream) {
        currentStream.getTracks().forEach(track => {
          track.stop()
        })
        currentStream = null
      }
      
      // Limpiar el elemento de video
      if (videoElement.value) {
        videoElement.value.srcObject = null
      }
      
      isScanning.value = false
      lastScannedCode.value = null
    } catch (err) {
      console.error('Error al detener escáner:', err)
    }
  }

  /**
   * Cambiar entre cámara frontal y trasera
   */
  async function switchCamera(video, onDetect) {
    stopScanning()
    
    // Alternar entre frontal y trasera
    const constraints = {
      video: {
        facingMode: { exact: 'user' }, // Cámara frontal
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    }
    
    try {
      currentStream = await navigator.mediaDevices.getUserMedia(constraints)
      await startScanning(video, onDetect)
    } catch (err) {
      // Si falla, volver a intentar con la trasera
      await startScanning(video, onDetect)
    }
  }

  /**
   * Verificar si el dispositivo tiene cámara
   */
  async function checkCameraAvailability() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const cameras = devices.filter(device => device.kind === 'videoinput')
      return cameras.length > 0
    } catch (err) {
      console.error('Error al verificar cámaras:', err)
      return false
    }
  }

  /**
   * Limpiar recursos al desmontar el componente
   */
  onUnmounted(() => {
    stopScanning()
  })

  return {
    isScanning,
    lastScannedCode,
    error,
    startScanning,
    stopScanning,
    switchCamera,
    checkCameraAvailability
  }
}
