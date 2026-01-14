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
    path: '/scanner',
    name: 'Scanner',
    component: () => import('@/views/ScannerView.vue'),
    meta: { requiresAuth: true, requiresSucursal: true }
  },
  {
    path: '/cotizacion',
    name: 'Cotizacion',
    component: () => import('@/views/CotizacionView.vue'),
    meta: { requiresAuth: true, requiresSucursal: true }
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
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresSucursal && !authStore.sucursalId) {
    next('/sucursal')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/sucursal')
  } else {
    next()
  }
})

export default router
