# Around The U.S. — Aplicacion Full-Stack (Frontend + Backend)

Proyecto final full-stack del bootcamp TripleTen: red social de fotografías con autenticación JWT completa, API REST propia y frontend en React con una landing animada y un sistema de temas visuales.

## Demo en produccion

**Frontend (Vercel):** https://web-project-api-full-jade.vercel.app
**Backend API (Render):** https://around-backend-l7gc.onrender.com

> Nota: el backend está en el plan gratuito de Render — la primera petición tras un período de inactividad puede tardar unos segundos mientras el servidor arranca. La app muestra una pantalla de carga con mensaje explicativo mientras esto ocurre.

## Descripcion / Objetivo

Integración completa de frontend React y backend Node.js/Express para la red social "Around The U.S." Los visitantes llegan primero a una landing con un mosaico de fotos animado, y desde ahí pueden registrarse, iniciar sesión y gestionar sus tarjetas de lugares fotográficos, con datos persistidos en MongoDB Atlas y comunicación segura mediante JWT. La aplicación incluye un selector de 5 temas visuales (colores, tipografías y formas distintas) que se puede cambiar dentro de la app.

## Tecnologias y herramientas

### Backend

- Node.js LTS + Express 4
- MongoDB Atlas con Mongoose (esquemas, validaciones)
- bcryptjs — hashing de contraseñas
- jsonwebtoken — tokens JWT (7 días de expiración)
- celebrate / Joi — validación de entradas
- validator — validación de URLs
- cors — cross-origin resource sharing
- helmet — cabeceras de seguridad HTTP
- dotenv — variables de entorno
- nodemon — hot reload en desarrollo
- ESLint (Airbnb Base)

### Frontend

- React 19 (componentes funcionales, hooks)
- Vite como bundler
- React Router DOM v7, incluyendo la View Transitions API nativa para transiciones suaves entre pantallas
- Context API para estado global
- Sistema de temas con CSS Custom Properties (5 temas visuales seleccionables)
- Google Fonts (Space Grotesk, Fraunces, Outfit, Playfair Display, Space Mono)
- CSS por componente (BEM adaptado)
- ESLint con reglas de React Hooks

## Funcionalidades principales

- **Landing animada:** mosaico de fotos con scroll infinito como fondo compartido entre la landing y las pantallas de acceso, con transición suave hacia Login/Register.
- **Autenticacion JWT end-to-end:** registro (`/signup`), inicio de sesión (`/signin`) con token JWT almacenado en `localStorage`, validación de sesión persistente al recargar la página y cierre de sesión.
- **Sistema de temas:** 5 temas visuales (Clásico, Viaje, Océano, Atardecer, Mono), cada uno con su propia paleta de color, tipografía y forma de botones, seleccionables desde un control en el header y persistidos en `localStorage`.
- **Rutas y sesión:** la ruta raíz decide entre mostrar la landing o la vista principal según si hay sesión activa; el backend valida el token en cada solicitud a rutas privadas con middleware `auth.js`.
- **CRUD de tarjetas y usuarios:** crear, visualizar, eliminar tarjetas (solo las propias) y dar/quitar like; editar perfil y avatar. Todo persistido en MongoDB y sincronizado con la API.
- **Experiencia de carga cuidada:** pantalla de carga con marca propia mientras se verifica la sesión, y aviso explicativo en los formularios de acceso si el backend tarda en despertar (plan gratuito de Render).
- **Seguridad del backend:** contraseñas hasheadas y nunca expuestas (`select: false`), validación completa de entradas con Celebrate/Joi, control de acceso por propiedad de recursos (403 para accesos no autorizados).
- **Logging y manejo de errores:** registro de todas las solicitudes en `request.log` y errores en `error.log` (formato JSON); manejo centralizado de errores con clases HTTP personalizadas y respuestas consistentes.
- **CORS y variables de entorno:** configuración CORS para comunicación frontend-backend en distintos dominios; JWT_SECRET, MONGODB_URI y ALLOWED_ORIGIN gestionados con `.env`.

## Infraestructura de despliegue

| Capa | Plataforma | URL |
|------|-----------|-----|
| Frontend | Vercel | https://web-project-api-full-jade.vercel.app |
| Backend | Render | https://around-backend-l7gc.onrender.com |
| Base de datos | MongoDB Atlas (AWS São Paulo) | cluster0.gqui4bh.mongodb.net |

## Rol

Proyecto individual: desarrollo completo full-stack — arquitectura del backend (API, modelos, auth, validaciones, logging) e integración del frontend React con autenticación y rutas protegidas.

## Resultado / Impacto

- Aplicación desplegada y accesible en https://web-project-api-full-jade.vercel.app
- 11 endpoints REST implementados con autenticación y validación completas (incluye `/health` para monitoreo externo).
- Flujo de autenticación seguro de extremo a extremo: hash de contraseña → JWT → rutas protegidas → persistencia de sesión.
- Landing con mosaico animado y sistema de 5 temas visuales, construido con CSS Custom Properties para poder cambiar colores, tipografía y formas sin duplicar componentes.
- Backend protegido con helmet (cabeceras HTTP), CORS configurado y variables de entorno para datos sensibles.
- Sistema de logging para auditoría de requests y errores en producción.

## Instalacion y ejecucion local

### Backend

```bash
cd backend
npm install
```

Crear `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/aroundb
JWT_SECRET=tu_clave_secreta
PORT=3000
ALLOWED_ORIGIN=http://localhost:5173
NODE_ENV=development
```

```bash
npm run dev     # Desarrollo con nodemon
npm start       # Producción
```

### Frontend

```bash
cd frontend
npm install
```

Crear `frontend/.env.local`:
```
VITE_AUTH_BASE_URL=http://localhost:3000
VITE_MAIN_API_BASE_URL=http://localhost:3000
```

```bash
npm run dev     # http://localhost:5173
npm run build
```

## Estructura del proyecto

```
web_project_api_full/
├── backend/
│   ├── app.js
│   ├── controllers/    # users.js, cards.js
│   ├── routes/         # users.js, cards.js
│   ├── models/         # user.js, card.js
│   ├── middlewares/    # auth.js
│   ├── errors/         # httpErrors.js
│   └── utils/          # logger.js, validator.js
└── frontend/
    └── src/
        ├── components/ # Landing, AuthMosaicBackground, Login, Register, Main,
        │                # Card, Header, ThemeSwitcher, BeamsBackground, icons, etc.
        ├── contexts/   # CurrentUserContext
        ├── hooks/      # useSlowSubmitHint
        ├── assets/blocks/themes.css  # Variables CSS de los 5 temas visuales
        └── utils/      # apiInstance.js, auth.js
```

## Repositorio

- GitHub: https://github.com/Javiermll/web_project_api_full
