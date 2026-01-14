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
        <p>v1.0.0 | By Engineer</p>
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
    await companiesStore.fetchCompanies(true)
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
  background: var(--gradient-primary);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-view::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.login-view::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  border-radius: 50%;
}

.login-container {
  width: 100%;
  max-width: 420px;
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 40px 32px;
  box-shadow: var(--shadow-xl);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
}

.logo-section {
  text-align: center;
  margin-bottom: 36px;
}

.logo-section img {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  margin-bottom: 16px;
  animation: fadeInDown 0.6s ease;
}

.logo-section h1 {
  font-size: 32px;
  margin-bottom: 8px;
  color: var(--text-primary);
  font-weight: 700;
}

.logo-section p {
  color: var(--text-secondary);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.login-form {
  margin-bottom: 24px;
  animation: fadeInUp 0.6s ease 0.2s backwards;
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
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
}

.input-field {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  font-size: 16px;
  transition: all var(--transition);
  background: var(--surface);
}

.input-field:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(139, 21, 56, 0.1);
  transform: translateY(-1px);
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
  padding: 14px 24px;
  border: none;
  border-radius: var(--radius);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: var(--gradient-primary);
  color: var(--text-white);
  box-shadow: var(--shadow-primary);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 21, 56, 0.35);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
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
  border-radius: var(--radius);
  margin-bottom: 16px;
  font-size: 14px;
  animation: slideInDown 0.3s ease;
}

.alert-error {
  background-color: #FFEBEE;
  border-left: 4px solid var(--error);
  color: var(--error);
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 480px) {
  .login-container {
    padding: 32px 24px;
  }
  
  .logo-section img {
    height: 80px;
  }
}
</style>
