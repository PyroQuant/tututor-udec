# Etapa de construcción
FROM node:20-alpine as build-stage
WORKDIR /app

# Definir ARG para recibirlo de Coolify
ARG VITE_API_URL
ARG VITE_API_KEY

# Crear el .env con esas variables
RUN echo "VITE_API_URL=$VITE_API_URL" >> .env
RUN echo "VITE_API_KEY=$VITE_API_KEY" >> .env

# ...Luego el resto:
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
