# Around The U.S. — Aplicacion Full-Stack (Frontend + Backend)

Proyecto final full-stack del bootcamp TripleTen: red social de fotografías con autenticación JWT completa, API REST propia y frontend en React.

## Demo en produccion

**Frontend (Vercel):** https://web-project-api-full-jade.vercel.app
**Backend API (Render):** https://around-backend-l7gc.onrender.com

> Nota: el backend está en el plan gratuito de Render — la primera petición tras un período de inactividad puede tardar ~30 segundos mientras el servidor arranca.

## Descripcion / Objetivo

Integración completa de frontend React y backend Node.js/Express para la red social "Around The U.S." Los usuarios pueden registrarse, iniciar sesión y gestionar sus tarjetas de lugares fotográficos, con datos persistidos en MongoDB Atlas y comunicación segura mediante JWT.

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
- React Router DOM v7
- Context API para estado global
- CSS por componente (BEM adaptado)
- ESLint con reglas de React Hooks

## Funcionalidades principales

- **Autenticacion JWT end-to-end:** registro (`/signup`), inicio de sesión (`/signin`) con token JWT almacenado en `localStorage`, validación de sesión persistente al recargar la página y cierre de sesión.
- **Rutas protegidas:** `ProtectedRoute` en el frontend redirige usuarios no autenticados; el backend valida el token en cada solicitud a rutas privadas con middleware `auth.js`.
- **CRUD de tarjetas y usuarios:** crear, visualizar, eliminar tarjetas (solo las propias) y dar/quitar like; editar perfil y avatar. Todo persistido en MongoDB y sincronizado con la API.
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
- 10 endpoints REST implementados con autenticación y validación completas.
- Flujo de autenticación seguro de extremo a extremo: hash de contraseña → JWT → rutas protegidas → persistencia de sesión.
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
        ├── components/ # Card, Login, Register, Header, BeamsBackground, etc.
        ├── contexts/   # CurrentUserContext
        └── utils/      # apiInstance.js, auth.js
```

## Repositorio

- GitHub: https://github.com/Javiermll/web_project_api_full
