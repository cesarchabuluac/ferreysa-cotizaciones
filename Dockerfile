# ===== BUILD STAGE =====
FROM node:18-alpine AS build

# Argumentos de build
ARG VITE_API_BASE_URL

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --prefer-offline --no-audit

# Copiar código fuente
COPY . .

# Configurar variables de entorno para build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV NODE_ENV=production

# Build de la aplicación
RUN npm run build

# ===== PRODUCTION STAGE =====
FROM nginx:alpine AS production

# Copiar archivos compilados
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Crear usuario no-root
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser && \
    chown -R appuser:appuser /usr/share/nginx/html && \
    chown -R appuser:appuser /var/cache/nginx && \
    chown -R appuser:appuser /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appuser /var/run/nginx.pid

# Cambiar a usuario no-root
USER appuser

# Exponer puerto
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
