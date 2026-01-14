const DEVICE_ID_STORAGE_KEY = 'deviceId'

export function getDeviceId() {
  const existing = localStorage.getItem(DEVICE_ID_STORAGE_KEY)
  if (existing) {
    return existing
  }

  const deviceId = generateDeviceId()
  localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId)
  return deviceId
}

function generateDeviceId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID()
  }

  const randomPart = Math.random().toString(16).slice(2)
  const timestamp = Date.now().toString(16)
  return `dev-${timestamp}-${randomPart}`
}
