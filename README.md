# TuTutor UdeC

Tu compañero en el camino al éxito académico.

## Requisitos

- Node.js 20 o superior
- npm o yarn
- Docker (para despliegue)

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Despliegue con Docker

```bash
# Construir imagen
docker build -t tututor-udec .

# Ejecutar contenedor
docker run -p 80:80 tututor-udec
```

## Despliegue en Coolify

1. Conecta tu repositorio de GitHub en Coolify
2. Configura el Build Pack como "Dockerfile"
3. Configura el puerto expuesto como 80
4. Configura las siguientes variables de entorno si son necesarias:
   - `VITE_API_URL`: URL de la API backend
   - `VITE_APP_ENV`: Entorno de la aplicación (production/development)

## Configuración de Nginx

El proyecto incluye una configuración personalizada de Nginx que maneja:
- Redirección para SPA
- Headers de seguridad
- Caché de archivos estáticos
- Soporte para fuentes de Google y recursos externos

## Estructura del Proyecto

```
├── src/                # Código fuente
├── public/            # Archivos estáticos
├── Dockerfile         # Configuración de Docker
├── nginx.conf         # Configuración de Nginx
└── .dockerignore      # Archivos ignorados en Docker
