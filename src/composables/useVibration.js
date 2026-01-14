import { ref } from 'vue'

export function useVibration() {
  const isSupported = ref('vibrate' in navigator)

  /**
   * Vibración simple
   * @param {number} duration - Duración en ms
   */
  function vibrate(duration = 100) {
    if (isSupported.value) {
      navigator.vibrate(duration)
    }
  }

  /**
   * Patrón de vibración para éxito
   */
  function vibrateSuccess() {
    if (isSupported.value) {
      navigator.vibrate([100, 50, 100])
    }
  }

  /**
   * Patrón de vibración para error
   */
  function vibrateError() {
    if (isSupported.value) {
      navigator.vibrate([200, 100, 200])
    }
  }

  /**
   * Detener vibración
   */
  function stopVibration() {
    if (isSupported.value) {
      navigator.vibrate(0)
    }
  }

  return {
    isSupported,
    vibrate,
    vibrateSuccess,
    vibrateError,
    stopVibration
  }
}
