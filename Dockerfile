# Etapa de construcción
FROM node:20-alpine as build-stage

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación
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
