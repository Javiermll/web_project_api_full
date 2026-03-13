# CLAUDE.md — web_project_api_full

## Proyecto: Around The U.S.
Red social de fotos (proyecto final TripleTen). Permite subir tarjetas con imágenes, dar likes, editar perfil, con autenticación JWT completa.

- **Demo actual:** https://usaround.mooo.com (Google Cloud VM — ya no en uso target)
- **API actual:** https://api.usaround.mooo.com
- **GitHub:** https://github.com/Javiermll/web_project_api_full

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend Framework | React | 19.1.0 |
| Frontend Bundler | Vite | 7.0.4 |
| Frontend Routing | React Router | 7.9.5 |
| Backend Framework | Express | 4.18.2 |
| Base de Datos | MongoDB + Mongoose | 8.19.2 |
| Autenticación | JWT (jsonwebtoken) | 9.0.3 |
| Validación | Celebrate + Joi | 15.0.3 |
| Seguridad | Helmet + bcryptjs | — |

---

## Estructura

```
web_project_api_full/
├── backend/
│   ├── app.js                  # Entry point Express, conexión MongoDB
│   ├── controllers/
│   │   ├── users.js            # Lógica usuarios (JWT_SECRET hardcoded aquí)
│   │   └── cards.js
│   ├── routes/
│   │   ├── users.js
│   │   └── cards.js
│   ├── models/
│   │   ├── user.js             # Schema Mongoose
│   │   └── card.js
│   ├── middlewares/
│   │   └── auth.js             # JWT verify (JWT_SECRET hardcoded aquí)
│   └── errors/httpErrors.js    # Clases de error custom
│
└── frontend/
    ├── src/
    │   ├── components/App.jsx  # Componente raíz, routing, estado global
    │   ├── utils/apiInstance.js # Cliente API con Bearer token automático
    │   └── utils/auth.js       # Login/register/token utils
    ├── .env.local              # VITE_AUTH_BASE_URL, VITE_MAIN_API_BASE_URL
    └── vite.config.js
```

---

## Plan de Despliegue: Vercel + Render + MongoDB Atlas

### ¿Es posible? SÍ. El proyecto es perfectamente compatible.

**Arquitectura objetivo:**
```
Vercel (Frontend React/Vite)
    ↓ HTTPS requests
Render (Backend Express Node.js)
    ↓ Mongoose connection string
MongoDB Atlas (Base de datos cloud)
```

---

## Cambios Necesarios (TODO)

### 1. Backend — Variables de entorno (CRÍTICO)

**Archivo:** `backend/app.js`
- [ ] Reemplazar `mongodb://localhost:27017/aroundb` → `process.env.MONGODB_URI`
- [ ] CORS: reemplazar `https://usaround.mooo.com` → `process.env.ALLOWED_ORIGIN`
- [ ] Puerto: ya usa `process.env.PORT || 3000` ✅

**Archivo:** `backend/controllers/users.js`
- [ ] Reemplazar `"CLAVE_SECRETA_DE_EJEMPLO"` → `process.env.JWT_SECRET`

**Archivo:** `backend/middlewares/auth.js`
- [ ] Reemplazar `"CLAVE_SECRETA_DE_EJEMPLO"` → `process.env.JWT_SECRET`

**Archivo:** `backend/app.js`
- [ ] Eliminar o proteger endpoint `GET /crash-test`

### 2. Backend — Archivo `.env` para desarrollo local

Crear `backend/.env` (no comittear):
```
MONGODB_URI=mongodb://localhost:27017/aroundb
JWT_SECRET=tu_clave_secreta_segura
PORT=3000
ALLOWED_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 3. Backend — Configurar para Render

Render necesita:
- `render.yaml` (opcional pero recomendado) o configuración manual
- Build command: `npm install`
- Start command: `node app.js` (o `npm start`)
- Variables de entorno en el dashboard de Render:
  - `MONGODB_URI` → connection string de Atlas
  - `JWT_SECRET` → clave segura aleatoria
  - `ALLOWED_ORIGIN` → URL de Vercel (ej: `https://usaround.vercel.app`)
  - `NODE_ENV` → `production`

### 4. Frontend — Variables de entorno para Vercel

Reemplazar en Vercel Dashboard (o en `.env.production`):
```
VITE_AUTH_BASE_URL=https://tu-app.onrender.com
VITE_MAIN_API_BASE_URL=https://tu-app.onrender.com
```

**Nota:** `VITE_MAIN_API_TOKEN` en `.env.local` parece un token fijo de prueba, revisar si aún se usa o puede eliminarse.

### 5. MongoDB Atlas

- Crear cluster gratuito en https://cloud.mongodb.com
- Crear usuario de BD
- Whitelist IP: `0.0.0.0/0` (para Render)
- Obtener connection string: `mongodb+srv://user:pass@cluster.mongodb.net/aroundb`
- Crear en Atlas los índices necesarios (email único en users)

---

## Problemas de Seguridad a Corregir

| Problema | Archivo | Prioridad |
|---------|---------|-----------|
| JWT_SECRET hardcoded | `middlewares/auth.js`, `controllers/users.js` | ALTA |
| MongoDB URI hardcoded | `backend/app.js` | ALTA |
| CORS hardcoded | `backend/app.js` | ALTA |
| `/crash-test` endpoint expuesto | `backend/app.js` | MEDIA |
| Token fijo en frontend env | `frontend/.env.local` | BAJA |

---

## Endpoints de la API

### Públicos
- `POST /signin` — Login → `{ token }`
- `POST /signup` — Registro → `{ success, data }`

### Protegidos (Bearer JWT)
- `GET /users/me` — Usuario actual
- `PATCH /users/me` — Actualizar perfil
- `PATCH /users/me/avatar` — Actualizar avatar
- `GET /cards` — Tarjetas del usuario
- `POST /cards` — Crear tarjeta
- `DELETE /cards/:id` — Eliminar tarjeta propia
- `PUT /cards/:id/likes` — Dar like
- `DELETE /cards/:id/likes` — Quitar like

---

## Orden de Pasos para el Despliegue

1. **Corregir variables de entorno** en backend (eliminar hardcoding)
2. **Crear cuenta MongoDB Atlas** y cluster gratuito
3. **Subir backend a Render** (configurar env vars con URI de Atlas)
4. **Subir frontend a Vercel** (configurar env vars con URL de Render)
5. **Actualizar CORS** en backend con URL real de Vercel
6. **Probar flujo completo** (registro → login → tarjetas)

---

## Estado Actual

- [x] Variables de entorno corregidas en backend
- [x] MongoDB Atlas configurado
- [ ] Backend desplegado en Render
- [ ] Frontend desplegado en Vercel
- [ ] CORS actualizado con URL de Vercel
- [ ] Tests de integración pasados
