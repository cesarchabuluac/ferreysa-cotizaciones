<template>
  <div class="login-view">
    <div class="login-container">
      <div class="logo-section">
        <!-- <h1> -->
            <!-- 🏪 -->
             <img src="/logo/ferreysa.png" alt="Logo Ferreysa" height="100" />
             <!-- Cotizaciones -->
            <!-- </h1> -->
        <p>Cotizaciones | Piso de Venta</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="username" class="input-label">Usuario</label>
          <input
            id="username"
            v-model="credentials.username"
            type="text"
            class="input-field"
            placeholder="Ingresa tu usuario"
            required
            autocomplete="username"
          />
        </div>

        <div class="input-group">
          <label for="password" class="input-label">Contraseña</label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            class="input-field"
            placeholder="Ingresa tu contraseña"
            required
            autocomplete="current-password"
          />
        </div>

        <!-- Input select companies -->
         <div class="input-group">
            <label for="company" class="input-label">Empresa</label>
            <select
              id="company"
              v-model="credentials.company"
              class="input-field"
              required
              :disabled="loadingCompanies"
            >
              <option value="">{{ loadingCompanies ? 'Cargando empresas...' : 'Selecciona una empresa' }}</option>
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
         </div>

        <div v-if="errorMsg" class="alert alert-error">
          {{ errorMsg }}
        </div>

        <button 
          type="submit" 
          class="btn btn-primary btn-block"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Iniciar Sesión</span>
          <span v-else>Iniciando...</span>
        </button>
      </form>

      <div class="app-info">
        <p>v1.0.0 | PWA</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCompaniesStore } from '@/stores/companies'

const router = useRouter()
const authStore = useAuthStore()
const companiesStore = useCompaniesStore()

const credentials = ref({
  username: 'admin',
  password: 'Adm1n2024_',
  company: '1'
})

const isLoading = ref(false)
const errorMsg = ref('')

// Computed para acceder a las empresas del store
const companies = computed(() => companiesStore.companies)
const loadingCompanies = computed(() => companiesStore.loading)

// Cargar empresas al montar el componente
onMounted(async () => {
  try {
    await companiesStore.fetchCompanies()
  } catch (error) {
    console.error('Error al cargar empresas:', error)
    errorMsg.value = 'Error al cargar las empresas disponibles'
  }
})

async function handleLogin() {
  try {
    isLoading.value = true
    errorMsg.value = ''

    // Validar que se seleccionó una empresa
    if (!credentials.value.company) {
      errorMsg.value = 'Debes seleccionar una empresa'
      isLoading.value = false
      return
    }

    const payload = {
      username: credentials.value.username,
      password: credentials.value.password,
      idEmpresa: credentials.value.company
    }

    await authStore.login(payload)
    
    
    // Redirigir a selección de sucursal
    router.push('/sucursal')
  } catch (error) {
    errorMsg.value = error.message || 'Usuario o contraseña incorrectos'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-view {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.logo-section {
  text-align: center;
  margin-bottom: 32px;
}

.logo-section h1 {
  font-size: 32px;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.logo-section p {
  color: var(--text-secondary);
  font-size: 14px;
}

.login-form {
  margin-bottom: 24px;
}

.app-info {
  text-align: center;
  color: var(--text-secondary);
  font-size: 12px;
  margin-top: 24px;
}

/* Form styles */
.input-group {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  background: white;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
}

.input-field:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}

select.input-field {
  cursor: pointer;
}

select.input-field:disabled {
  cursor: not-allowed;
}

/* Button styles */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-block {
  width: 100%;
}

/* Alert styles */
.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}

.alert-error {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
}
</style>
