import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/sucursal',
    name: 'Sucursal',
    component: () => import('@/views/SucursalView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/almacen',
    name: 'Almacen',
    component: () => import('@/views/AlmacenView.vue'),
    meta: { requiresAuth: true, requiresSucursal: true }
  },
  {
    path: '/scanner',
    name: 'Scanner',
    component: () => import('@/views/ScannerView.vue'),
    meta: { requiresAuth: true, requiresSucursal: true, requiresAlmacen: true }
  },
  {
    path: '/cotizacion',
    name: 'Cotizacion',
    component: () => import('@/views/CotizacionView.vue'),
    meta: { requiresAuth: true, requiresSucursal: true, requiresAlmacen: true }
  },
  {
    path: '/confirmacion/:folio',
    name: 'Confirmacion',
    component: () => import('@/views/ConfirmacionView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Verificar autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  // Verificar sucursal
  if (to.meta.requiresSucursal && !authStore.sucursalId) {
    next('/sucursal')
    return
  }
  
  // Verificar almacén
  if (to.meta.requiresAlmacen && !authStore.almacenId) {
    next('/almacen')
    return
  }
  
  // Redirigir usuarios autenticados desde login
  if (to.path === '/login' && authStore.isAuthenticated) {
    next('/sucursal')
    return
  }
  
  next()
})

export default router
