# 🎨 Guía de Tema Ferreysa - PWA Cotizaciones

## ✨ Diseño Implementado

Tu PWA ahora utiliza una paleta de colores profesional basada en la identidad de Ferreysa, optimizada para aplicaciones móviles y construcción/ferretería.

---

## 🎨 Paleta de Colores Principal

### Colores Ferreysa

```css
/* Color Principal - Vino/Borgoña del Logo */
--primary: #8B1538
--primary-dark: #6B0F2A
--primary-light: #C41E3A
--primary-lighter: #FFE5EC

/* Gradiente Principal */
--gradient-primary: linear-gradient(135deg, #8B1538 0%, #C41E3A 100%)
```

### Colores Secundarios - Construcción

```css
/* Naranja - Acción y Energía */
--secondary: #FF6F00
--secondary-dark: #E65100
--secondary-light: #FFB74D

/* Gradiente Secundario */
--gradient-secondary: linear-gradient(135deg, #FF6F00 0%, #FFB74D 100%)
```

### Colores de Acento - Profesional

```css
/* Gris Industrial */
--accent-gray: #37474F
--accent-steel: #546E7A
--accent-blue: #1565C0

/* Gradiente Oscuro */
--gradient-dark: linear-gradient(135deg, #37474F 0%, #546E7A 100%)
```

---

## 🎯 Aplicación del Tema por Vista

### 1. **LoginView** 🔐

**Fondo:**
- Gradiente vino/borgoña (--gradient-primary)
- Efectos radiales blancos sutiles para profundidad
- Animaciones fadeIn suaves

**Card:**
- Fondo blanco con sombra elevada
- Bordes redondeados (16px)
- Backdrop filter blur para efecto glassmorphism

**Botón Login:**
- Gradiente principal (#8B1538 → #C41E3A)
- Sombra especial con tinte vino
- Hover con elevación
- Texto uppercase bold

---

### 2. **SucursalView** 🏢

**Cards de Sucursales:**
- Barra superior animada con gradiente primario
- Hover: Barra se expande de izquierda a derecha
- Active: Fondo degradado vino claro
- Logo Ferreysa en cada card
- Sombra media elevada

**Botón Cerrar Sesión:**
- Gradiente principal vino/borgoña
- Efecto de presión scale(0.98)

---

### 3. **AlmacenView** 📦

**Cards de Almacenes:**
- Barra superior animada con gradiente naranja
- Hover: Efecto expandible
- Active: Fondo degradado naranja claro
- Icono 📦 para identificación rápida

**Botones:**
- "Cambiar Sucursal": Gradiente gris industrial
- "Cerrar Sesión": Gradiente vino/borgoña

---

## 🔧 Clases CSS Globales

### Botones

```css
/* Primario - Vino Ferreysa */
.btn-primary
  → Gradiente vino/borgoña
  → Sombra con tinte vino
  → Para acciones principales

/* Secundario - Naranja Construcción */
.btn-secondary
  → Gradiente naranja
  → Para acciones secundarias

/* Acento - Gris Industrial */
.btn-accent
  → Gradiente gris oscuro
  → Para acciones neutras

/* Éxito - Verde Construcción */
.btn-success
  → Verde construcción #2E7D32
  → Para confirmaciones
```

---

### Inputs

```css
.input-field:focus
  → Borde color vino (#8B1538)
  → Sombra suave vino con alpha
  → Elevación sutil
```

---

### Alerts

```css
.alert-error   → Rojo construcción
.alert-success → Verde construcción
.alert-warning → Naranja advertencia
.alert-info    → Azul información
```

---

## 💡 Efectos y Animaciones

### Cards Interactivos

```css
/* Barra Superior Animada */
.card::before {
  height: 4px;
  background: gradiente;
  transform: scaleX(0);
  transition: 0.2s;
}

.card:hover::before {
  transform: scaleX(1);
}
```

### Animaciones de Entrada

- **fadeInDown**: Logo en Login
- **fadeInUp**: Formulario en Login
- **slideInDown**: Alertas

---

## 📐 Sistema de Diseño

### Sombras

```css
--shadow-sm:  0 1px 2px rgba(0,0,0,0.05)
--shadow:     0 2px 8px rgba(0,0,0,0.1)
--shadow-md:  0 4px 12px rgba(0,0,0,0.12)
--shadow-lg:  0 8px 24px rgba(0,0,0,0.15)
--shadow-xl:  0 12px 32px rgba(0,0,0,0.18)

/* Especial con tinte vino */
--shadow-primary: 0 4px 12px rgba(139,21,56,0.25)
```

### Bordes Redondeados

```css
--radius-sm: 6px   → Inputs pequeños
--radius: 8px      → Botones, inputs
--radius-md: 12px  → Cards
--radius-lg: 16px  → Containers
--radius-xl: 24px  → Headers especiales
```

### Transiciones

```css
--transition-fast: 0.15s ease  → Hover rápido
--transition: 0.2s ease        → Default
--transition-slow: 0.3s ease   → Animaciones suaves
```

---

## 🎯 Uso de Colores por Tipo de Acción

| Acción | Color | Uso |
|--------|-------|-----|
| **Principal** | Vino/Borgoña | Login, Logout, Confirmar |
| **Secundaria** | Naranja | Acciones alternativas |
| **Navegación** | Gris Industrial | Regresar, Cambiar |
| **Éxito** | Verde Construcción | Confirmaciones positivas |
| **Error** | Rojo | Advertencias, cancelar |
| **Info** | Azul | Información adicional |

---

## 📱 Responsive Design

### Mobile First

- Padding adaptativo (32px desktop → 24px mobile)
- Logo escalable (100px → 80px en móviles)
- Grid responsivo con auto-fill
- Touch targets mínimo 44x44px

### PWA Optimizations

- `-webkit-overflow-scrolling: touch` para scroll suave
- `backdrop-filter` para efectos modernos
- Sombras optimizadas para performance
- Transiciones hardware-accelerated

---

## 🔄 Consistencia Visual

### Todos los Cards Siguen el Patrón:

1. ✅ Fondo blanco con sombra media
2. ✅ Barra superior de 4px con gradiente
3. ✅ Animación de expansión en hover
4. ✅ Efecto de presión en active
5. ✅ Border radius 12px
6. ✅ Transición 0.2s

### Todos los Botones Siguen el Patrón:

1. ✅ Font-weight 700 (bold)
2. ✅ Uppercase con letter-spacing
3. ✅ Padding 14px vertical
4. ✅ Border radius 8px
5. ✅ Sombra apropiada al color
6. ✅ Transform scale en active

---

## 🎨 Jerarquía Visual

### Nivel 1 - Primario (Vino/Borgoña)
- Acciones críticas: Login, Logout
- Botones de confirmación

### Nivel 2 - Secundario (Naranja)
- Cards de almacenes
- Acciones alternativas importantes

### Nivel 3 - Acento (Gris)
- Navegación: Regresar, Cambiar
- Acciones neutras

### Nivel 4 - Estados
- Verde: Éxito, disponible
- Rojo: Error, advertencia
- Azul: Información

---

## ✅ Checklist de Implementación

- [x] Paleta de colores Ferreysa definida
- [x] Gradientes principales creados
- [x] LoginView con tema vino/borgoña
- [x] SucursalView con cards animados
- [x] AlmacenView con tema naranja
- [x] Botones globales actualizados
- [x] Sistema de sombras mejorado
- [x] Animaciones suaves implementadas
- [x] Responsive design optimizado
- [x] PWA touch interactions

---

## 🚀 Próximas Mejoras Opcionales

1. **Dark Mode** - Variante oscura del tema
2. **Micro-interacciones** - Confetti al completar cotización
3. **Skeleton Screens** - Placeholders mientras carga
4. **Pull to Refresh** - Gesto nativo PWA
5. **Haptic Feedback** - Vibración en acciones importantes
6. **Tema Personalizado** - Permitir al usuario elegir colores

---

## 📚 Recursos de Diseño

**Inspiración:**
- Material Design 3 (Google)
- iOS Human Interface Guidelines
- Ferreysa Corporate Identity

**Herramientas Usadas:**
- CSS Custom Properties
- CSS Grid & Flexbox
- CSS Animations
- Backdrop Filter
- Box Shadow

---

**Versión del Tema:** 1.0.0  
**Fecha:** 2026-01-14  
**Diseño:** Ferreysa Construcción y Ferretería  
**Optimizado para:** PWA Mobile-First
