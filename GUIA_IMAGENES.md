# 🎨 Guía para Agregar Imágenes y Logo de Ferreysa

## 📋 Checklist de Imágenes Necesarias

### ✅ Iconos PWA (Obligatorios)

Colocar en: `frontend/public/icons/`

- [ ] `icon-16x16.png`
- [ ] `icon-32x32.png`
- [ ] `icon-72x72.png`
- [ ] `icon-96x96.png`
- [ ] `icon-128x128.png`
- [ ] `icon-144x144.png`
- [ ] `icon-152x152.png`
- [ ] `icon-192x192.png`
- [ ] `icon-384x384.png`
- [ ] `icon-512x512.png`

### ✅ Favicon

Colocar en: `frontend/public/`

- [ ] `favicon.ico` (16x16 y 32x32 dentro del .ico)

### 📌 Imágenes Opcionales

Colocar en: `frontend/public/` o `frontend/src/assets/images/`

- [ ] `logo.png` - Logo principal de Ferreysa
- [ ] `logo-white.png` - Logo en blanco (para fondos oscuros)
- [ ] `banner.jpg` - Banner de la empresa (opcional)
- [ ] `placeholder.png` - Imagen cuando no hay foto de producto

---

## 🚀 Método Rápido: Generador Automático

### 1. Preparar Logo Original

Necesitas **1 archivo** con estas características:
- Formato: PNG con fondo transparente
- Tamaño mínimo: 512x512 px
- Tamaño recomendado: 1024x1024 px
- Forma: Cuadrada

### 2. Generar Iconos PWA

**Opción A: PWA Builder (Recomendado)**
1. Ve a: https://www.pwabuilder.com/imageGenerator
2. Haz clic en "Upload Image"
3. Sube tu logo (512x512 o mayor)
4. Descarga el ZIP
5. Extrae los archivos en `frontend/public/icons/`

**Opción B: RealFaviconGenerator**
1. Ve a: https://realfavicongenerator.net/
2. Selecciona "Select your Favicon image"
3. Sube tu logo
4. Configura cada plataforma (iOS, Android, etc.)
5. Genera y descarga
6. Extrae en `frontend/public/icons/`

**Opción C: Favicon.io**
1. Ve a: https://favicon.io/favicon-converter/
2. Sube tu logo PNG
3. Descarga el ZIP
4. Extrae en `frontend/public/icons/`

---

## 🛠️ Método Manual: Crear Iconos con Herramientas

### Windows: Paint.NET o GIMP

1. Instala GIMP: https://www.gimp.org/downloads/
2. Abre tu logo en GIMP
3. Para cada tamaño:
   - Imagen → Escalar imagen
   - Ancho: 512 (o el tamaño necesario)
   - Alto: 512
   - Exportar como PNG
   - Guardar en `frontend/public/icons/icon-512x512.png`

### Online: iLoveIMG

1. Ve a: https://www.iloveimg.com/resize-image
2. Sube tu logo
3. Selecciona "Por píxeles"
4. Ingresa 512x512 (y repite para cada tamaño)
5. Descarga y renombra según el tamaño

---

## 📦 Estructura Final

```
frontend/
├── public/
│   ├── favicon.ico              ✅ Favicon del navegador
│   ├── logo.png                 ✅ Logo principal (opcional)
│   ├── icons/
│   │   ├── icon-16x16.png       ✅ Para favicon
│   │   ├── icon-32x32.png       ✅ Para favicon
│   │   ├── icon-72x72.png       ✅ PWA Android
│   │   ├── icon-96x96.png       ✅ PWA Android
│   │   ├── icon-128x128.png     ✅ PWA Android
│   │   ├── icon-144x144.png     ✅ PWA Android
│   │   ├── icon-152x152.png     ✅ PWA iOS
│   │   ├── icon-192x192.png     ✅ PWA Android/iOS
│   │   ├── icon-384x384.png     ✅ PWA Android
│   │   └── icon-512x512.png     ✅ PWA Android (splash)
│   └── manifest.webmanifest     ✅ Ya existe
│
└── src/
    └── assets/
        └── images/              📁 Crear esta carpeta
            ├── logo-ferreysa.png
            ├── logo-white.png
            └── placeholder.png
```

---

## 💻 Usar las Imágenes en el Código

### En Componentes Vue

```vue
<template>
  <!-- Desde public/ -->
  <img src="/logo.png" alt="Ferreysa" class="logo" />
  
  <!-- Desde assets/ (recomendado para optimización) -->
  <img :src="logoUrl" alt="Ferreysa" class="logo" />
</template>

<script setup>
// Importar desde assets
import logoUrl from '@/assets/images/logo-ferreysa.png'
</script>

<style scoped>
.logo {
  width: 150px;
  height: auto;
}
</style>
```

### En CSS

```css
/* Desde public/ */
.header {
  background-image: url('/logo.png');
}

/* Desde assets/ (usar en <style> de componentes) */
.banner {
  background-image: url('@/assets/images/banner.jpg');
}
```

### En LoginView.vue (Ejemplo)

```vue
<template>
  <div class="login-container">
    <!-- Logo de Ferreysa -->
    <img src="/logo.png" alt="Ferreysa" class="logo-main" />
    
    <h1>Cotizaciones</h1>
    <p>Sistema de Piso de Venta</p>
    
    <!-- Formulario de login... -->
  </div>
</template>

<style scoped>
.logo-main {
  width: 200px;
  margin-bottom: 2rem;
}
</style>
```

---

## 🎨 Personalizar Colores

Si quieres cambiar el color del tema (actualmente azul #1976D2):

### 1. En `index.html`
```html
<meta name="theme-color" content="#TU_COLOR_AQUI">
```

### 2. En `vite.config.js`
```javascript
manifest: {
  theme_color: '#TU_COLOR_AQUI',
  background_color: '#TU_COLOR_AQUI'
}
```

### 3. En `src/assets/main.css`
```css
:root {
  --primary-color: #TU_COLOR_AQUI;
}
```

---

## ⚡ Tips Importantes

### ✅ Formato de Imágenes

- **Iconos PWA:** PNG con fondo transparente
- **Favicon:** ICO (contiene 16x16 y 32x32)
- **Logo principal:** PNG con transparencia
- **Fotos/banners:** JPG (menor peso) o PNG

### ✅ Optimización

- Comprimir imágenes: https://tinypng.com/
- Máximo 200KB por icono
- Usar PNG-8 si no necesitas muchos colores

### ✅ Nombres de Archivos

- Solo minúsculas
- Sin espacios (usar guiones)
- Ejemplo: `logo-ferreysa.png` ✅
- Evitar: `Logo Ferreysa.PNG` ❌

---

## 🔍 Verificar que Funciona

### 1. Reinicia el servidor
```bash
# Ctrl + C para detener
npm run dev
```

### 2. Abre el navegador
```
http://localhost:3000
```

### 3. Verifica en DevTools
- F12 → Application → Manifest
- Deberías ver todos los iconos cargados

### 4. Prueba la instalación PWA
- En Chrome: Clic en el icono de instalación (⊕) en la barra de direcciones
- Verifica que el icono se vea correctamente

---

## ❓ Troubleshooting

### Los iconos no se ven
✅ Verifica que los archivos existan en `public/icons/`  
✅ Reinicia el servidor de desarrollo  
✅ Limpia caché del navegador (Ctrl + Shift + R)

### Error "Cannot find module"
✅ Verifica la ruta del import  
✅ Asegúrate que el alias `@` apunta a `src/`  
✅ Reinicia VS Code

### Favicon no cambia
✅ Limpia caché del navegador  
✅ Prueba en modo incógnito  
✅ Verifica que `favicon.ico` esté en `public/`

---

## 📞 ¿Necesitas Ayuda?

Si tienes el logo de Ferreysa pero no sabes cómo generar los iconos:

1. Compárteme el logo (PNG de buena calidad)
2. Yo puedo generar todos los tamaños automáticamente
3. Te daré los archivos listos para usar

---

**Próximo paso:** Una vez que tengas las imágenes, cópialas a las carpetas indicadas y reinicia el servidor.
