# CLAUDE.md — web_project_api_full

## Proyecto: Around The U.S.

Red social de fotografías (proyecto final TripleTen). Los usuarios se registran, inician sesión y gestionan tarjetas de lugares con imágenes, likes y perfil editable. Autenticación JWT completa end-to-end.

- **Frontend (Vercel):** https://web-project-api-full-jade.vercel.app
- **Backend API (Render):** https://around-backend-l7gc.onrender.com
- **Base de datos:** MongoDB Atlas — cluster0.gqui4bh.mongodb.net
- **GitHub:** https://github.com/Javiermll/web_project_api_full

> El backend corre en el plan gratuito de Render. La primera petición tras inactividad puede tardar ~30 s mientras el servidor arranca.

---

## Stack

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React | 19.1.0 |
| Bundler | Vite | 7.0.4 |
| Routing | React Router DOM | 7.9.5 |
| Backend | Node.js + Express | 4.18.2 |
| Base de datos | MongoDB Atlas + Mongoose | 8.19.2 |
| Auth | jsonwebtoken (JWT, 7 días) | 9.0.3 |
| Validación | Celebrate + Joi | 15.0.3 |
| Seguridad | Helmet + bcryptjs | — |
| Logging | Winston | — |

---

## Estructura del proyecto

```
web_project_api_full/
├── backend/
│   ├── app.js                  # Entry point: conecta MongoDB → arranca Express
│   ├── controllers/
│   │   ├── users.js            # Registro, login, perfil, avatar
│   │   └── cards.js            # CRUD tarjetas + likes ($addToSet / $pull)
│   ├── routes/
│   │   ├── users.js            # Define URLs y validaciones Celebrate para usuarios
│   │   └── cards.js            # Define URLs y validaciones Celebrate para tarjetas
│   ├── models/
│   │   ├── user.js             # Schema Mongoose — password con select:false
│   │   └── card.js             # Schema Mongoose — owner y likes como ObjectId refs
│   ├── middlewares/
│   │   └── auth.js             # Verifica JWT → inyecta req.user._id
│   ├── errors/
│   │   └── httpErrors.js       # Clases BadRequestError, NotFoundError, ForbiddenError
│   └── utils/
│       ├── logger.js           # Winston: request.log y error.log (formato JSON)
│       └── validator.js        # Validación de URLs reutilizable con Celebrate
│
└── frontend/
    └── src/
        ├── index.css           # Centraliza todos los @import de CSS (deben ir PRIMERO)
        ├── components/
        │   ├── App.jsx             # Raíz: estado global, routing, todos los handlers
        │   ├── ProtectedRoute/     # Redirige a /signin si no hay token
        │   ├── Header/             # Logo + email + cerrar sesión; oculta nav en auth pages
        │   ├── Footer/             # Pie de página; oculto en /signin y /signup
        │   ├── Main/               # Vista principal autenticada
        │   ├── Card/               # Tarjeta individual con like y delete
        │   ├── Login/              # Página de inicio de sesión — layout split-panel
        │   ├── Register/           # Página de registro — mismo layout split-panel
        │   ├── BeamsBackground/    # Fondo estático: gradientes radiales sobre #0a0a0f
        │   └── InfoTooltip/        # Modal de resultado éxito/error
        ├── contexts/
        │   └── CurrentUserContext.js  # Context con datos del usuario autenticado
        └── utils/
            ├── apiInstance.js      # Clase Api: fetch + Authorization header automático
            └── auth.js             # login(), register(), verifyToken(), getToken(), logout()
```

---

## Variables de entorno

### Backend (`backend/.env` — no commitear)

```env
MONGODB_URI=mongodb://localhost:27017/aroundb
JWT_SECRET=cualquier_cadena_larga_y_aleatoria
PORT=3000
ALLOWED_ORIGIN=http://localhost:5173
NODE_ENV=development
```

En Render: configuradas en el dashboard con los valores de producción.

### Frontend (`frontend/.env.local` — no commitear)

```env
VITE_AUTH_BASE_URL=http://localhost:3000
VITE_MAIN_API_BASE_URL=http://localhost:3000
```

En Vercel: configuradas en el dashboard. Vite las incrusta **en build time**, no en runtime — cambiarlas requiere un nuevo deploy.

---

## Diseño UI

### Fondo de la página principal

`BeamsBackground` renderiza un `<div position:fixed; inset:0>` con tres gradientes radiales CSS superpuestos (azul hsl-210, púrpura hsl-260, cian hsl-190) sobre `#0a0a0f`. No usa canvas ni animaciones — es puramente CSS, sin dependencias externas.

Stacking context:
- `BeamsBackground` → z-index: 0 (fondo)
- `.content` (Main) → z-index: 1
- `.footer` → z-index: 2
- `.header` → z-index: 10

### Páginas de autenticación

`Login` y `Register` usan un layout split-panel: panel izquierdo oscuro con glow radial + panel derecho claro con el formulario. En mobile (< 600px) el panel izquierdo se oculta. El `Header` oculta los nav links en `/signin` y `/signup` detectando la ruta con `useLocation()`.

---

## Gotchas conocidos

### CSS @import debe ir siempre primero

Las reglas `@import` en CSS deben preceder a cualquier otra regla. Si se coloca un `@keyframes`, selector u otra regla **antes** de un `@import`, ese import y todos los siguientes son ignorados por la especificación CSS. En Vite dev server esto no se nota (inyecta CSS via JS), pero en el build de producción (Rollup) los imports inválidos se descartan y la app pierde todos sus estilos.

### Render plan gratuito — cold start

El servicio de Render duerme tras ~15 min de inactividad. La primera petición puede tardar 30 s. Esto causa que la pantalla de login muestre un error 401/504 momentáneo en el primer acceso. El usuario debe esperar y reintentar.

---

## Endpoints

### Públicos

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/signup` | Registro → `201 { success, data }` |
| POST | `/signin` | Login → `200 { token }` |

### Protegidos (`Authorization: Bearer <token>`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users/me` | Datos del usuario actual |
| PATCH | `/users/me` | Actualizar nombre y ocupación |
| PATCH | `/users/me/avatar` | Actualizar avatar |
| GET | `/cards` | Listar todas las tarjetas |
| POST | `/cards` | Crear tarjeta |
| DELETE | `/cards/:id` | Eliminar tarjeta propia (403 si no es el dueño) |
| PUT | `/cards/:id/likes` | Dar like (`$addToSet`) |
| DELETE | `/cards/:id/likes` | Quitar like (`$pull`) |

---

## Comandos de desarrollo

```bash
# Backend
cd backend && npm install
npm run dev     # nodemon — http://localhost:3000
npm start       # producción
npm run lint    # ESLint Airbnb

# Frontend
cd frontend && npm install
npm run dev     # Vite — http://localhost:5173
npm run build   # Genera dist/
npm run preview # Sirve dist/ localmente
npm run lint    # ESLint React Hooks
```

---

## Infraestructura de despliegue

| Capa | Plataforma | Config |
|------|-----------|--------|
| Frontend | Vercel | Root: `frontend`, env vars en dashboard |
| Backend | Render | Root: `backend`, start: `node app.js`, env vars en dashboard |
| Base de datos | MongoDB Atlas M0 (free) | Network: `0.0.0.0/0` para Render |
