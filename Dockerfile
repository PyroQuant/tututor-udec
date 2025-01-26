# Etapa de construcción
FROM node:20-alpine as build-stage

# Establecer el directorio de trabajo
WORKDIR /app

# 1. Definir ARG para las variables que vendrán de Coolify
ARG VITE_API_URL
ARG VITE_API_KEY

# 2. (Opcional) Exportarlas como ENV dentro del contenedor para que Vite las vea
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_KEY=$VITE_API_KEY

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación (en este punto Vite leerá las variables con prefijo `VITE_`)
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine as production-stage

# Copiar los archivos construidos desde la etapa anterior
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar la configuración personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
