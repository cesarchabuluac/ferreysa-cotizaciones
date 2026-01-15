import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      console.warn('Service Worker registration failed')
    })
  })
}

// Prevenir zoom en Android
document.addEventListener('gesturestart', (e) => {
  e.preventDefault()
})

// Configurar viewport para mejor experiencia móvil
const viewport = document.querySelector('meta[name=viewport]')
if (viewport) {
  viewport.setAttribute('content', 
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
  )
}

app.mount('#app')
