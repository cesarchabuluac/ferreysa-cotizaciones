import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un status fuera del rango 2xx
      switch (error.response.status) {
        case 401:
          // Token inválido o expirado
          localStorage.removeItem('token')
          // Deja que la vista maneje el error para evitar recargar la SPA al depurar
          break
        case 403:
          console.error('Acceso denegado')
          break
        case 404:
          console.error('Recurso no encontrado')
          break
        case 500:
          console.error('Error del servidor')
          break
      }
      return Promise.reject(error.response.data)
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error('Sin respuesta del servidor')
      return Promise.reject({ message: 'Sin conexión al servidor' })
    } else {
      // Algo pasó al configurar la petición
      console.error('Error en la petición:', error.message)
      return Promise.reject(error)
    }
  }
)

export default api
