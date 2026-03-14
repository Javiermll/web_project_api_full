# Frontend — Around The U.S.

Aplicación React que consume la API REST propia. Permite registrarse, iniciar sesión y gestionar tarjetas fotográficas con autenticación JWT persistente.

**Demo en producción:** https://web-project-api-full-jade.vercel.app

---

## Stack tecnológico

| Paquete | Versión | Para qué sirve |
|---------|---------|----------------|
| react | 19.1.0 | Librería de UI — componentes, estado, ciclo de vida |
| vite | 7.0.4 | Bundler y servidor de desarrollo (reemplaza Create React App) |
| react-router-dom | 7.9.5 | Enrutamiento del lado del cliente (SPA sin recarga de página) |

No hay Redux ni ninguna librería de estado global externa. El estado vive en `App.jsx` y se distribuye mediante **Context API** de React.

---

## Estructura del proyecto

```
frontend/
├── public/                        # Archivos estáticos (favicon, etc.)
├── src/
│   ├── components/
│   │   ├── App.jsx                # Raíz: estado global, routing, handlers
│   │   ├── ProtectedRoute/        # HOC que redirige a /signin si no hay sesión
│   │   ├── Header/                # Barra superior: logo, email, cerrar sesión
│   │   ├── Footer/                # Pie de página (oculto en páginas de auth)
│   │   ├── Main/                  # Vista principal autenticada con tarjetas
│   │   ├── Card/                  # Componente de tarjeta individual
│   │   ├── Login/                 # Página de inicio de sesión — layout split-panel (panel izquierdo oscuro + formulario derecho claro)
│   │   ├── Register/              # Página de registro — mismo layout split-panel que Login
│   │   ├── BeamsBackground/       # Fondo estático de la página principal: gradientes radiales azul/púrpura/cian sobre #0a0a0f
│   │   └── InfoTooltip/           # Modal de resultado (éxito/error)
│   ├── contexts/
│   │   └── CurrentUserContext.js  # Context de React con los datos del usuario actual
│   └── utils/
│       ├── apiInstance.js         # Clase Api: todas las llamadas HTTP al backend
│       └── auth.js                # Funciones de autenticación y manejo del token JWT
├── .env.local                     # Variables de entorno locales (no se commitea)
└── vite.config.js                 # Configuración de Vite (plugins, alias, etc.)
```

---

## Arquitectura de la aplicación

### Flujo de datos

```
Backend API (Render)
      │
      ▼
utils/apiInstance.js   → clase Api con fetch + token automático
      │
      ▼
App.jsx (estado central)
  ├── currentUser {}   → datos del usuario logueado
  ├── cards []         → lista de tarjetas
  ├── email ""         → email mostrado en el Header
  └── tooltip {}       → estado del modal de resultado
      │
      ├── CurrentUserContext.Provider  → pasa currentUser a cualquier componente
      │
      ├── <Header />           → recibe email y onSignOut
      ├── <Main />             → recibe cards, handlers de CRUD
      │   └── <Card />
      ├── <Login />            → solo dispara onSubmit, no llama al API
      ├── <Register />         → solo dispara onSubmit, no llama al API
      └── <InfoTooltip />      → recibe open/success/message
```

**Principio clave:** los formularios (`Login`, `Register`) no tienen lógica de API. Solo llaman al callback `onSubmit` que reciben como prop. Toda la lógica asíncrona está centralizada en `App.jsx` (los handlers `handleLogin`, `handleRegister`, etc.).

---

## Autenticación y manejo del token

### `utils/auth.js`

Centraliza todo lo relacionado con el token JWT:

```
getToken()      → lee "jwt" de localStorage
saveToken(t)    → guarda el token en localStorage
logout()        → elimina "jwt" de localStorage
isAuthenticated() → devuelve true si existe el token
verifyToken(jwt)  → llama a GET /users/me con el token para validarlo
login({ email, password }) → llama a POST /signin, devuelve { token }
register({ email, password }) → llama a POST /signup
```

### Persistencia de sesión al recargar la página

Al montar `App.jsx` se ejecuta un `useEffect` con este flujo:

```
¿Hay token en localStorage?
      │
   No ─── setCheckingToken(false) → muestra la app en modo no autenticado
      │
   Sí ─── verifyToken(jwt)
              │
           Éxito → setEmail(res.data.email) → loadData() (cards + perfil)
              │
           Error → logout() → limpia localStorage (token expirado o inválido)
              │
           finally → setCheckingToken(false) → renderiza la app
```

Mientras `checkingToken` es `true`, se muestra `<div className="preloader">Cargando...</div>` para evitar un parpadeo de contenido no autenticado antes de verificar la sesión.

---

## Cliente HTTP (`utils/apiInstance.js`)

Se exporta una única instancia de la clase `Api`. Todos los métodos usan el método privado `_request()` que:

1. Lee el token con `getToken()` en cada llamada (no en el constructor, por si cambia)
2. Añade el header `Authorization: Bearer <token>` automáticamente si existe
3. Parsea la respuesta como JSON
4. Si `res.ok` es `false`, lanza un `Error` con el `message` del servidor

```js
// Así se usa en App.jsx — el token se adjunta solo:
api.getUserInfo()           // GET /users/me
api.getInitialCards()       // GET /cards
api.addCard({ name, link }) // POST /cards
api.deleteCard(id)          // DELETE /cards/:id
api.changeLikeCardStatus(id, liked) // PUT o DELETE /cards/:id/likes según `liked`
api.updateUserInfo(body)    // PATCH /users/me
api.updateAvatar(body)      // PATCH /users/me/avatar
```

La URL base (`VITE_MAIN_API_BASE_URL`) se lee desde las variables de entorno de Vite en build time, no en runtime.

---

## Enrutamiento

`react-router-dom` v7 gestiona tres rutas en `App.jsx`:

```
/          → <ProtectedRoute> envuelve <Main />
               Si no hay sesión → redirige a /signin
/signin    → <Login />
/signup    → <Register />
*          → redirige a / si autenticado, o a /signin si no
```

`ProtectedRoute` es un componente wrapper que comprueba `isAuthenticated()` y devuelve `<Navigate to="/signin" replace />` si no hay token, o los hijos si sí lo hay.

El `Footer` solo se renderiza cuando `location.pathname` no es `/signin` ni `/signup`, replicando el comportamiento del diseño original.

---

## Estado global con Context API

`CurrentUserContext.js` crea un Context de React. En `App.jsx`:

```jsx
<CurrentUserContext.Provider value={{ currentUser }}>
  {/* Todos los componentes hijos pueden acceder a currentUser */}
</CurrentUserContext.Provider>
```

Un componente descendiente (como `Card`) puede leer el usuario actual sin necesidad de prop drilling:

```js
const { currentUser } = useContext(CurrentUserContext);
// Usa currentUser._id para saber si la tarjeta le pertenece al usuario
```

---

## Diseño UI

### Fondo de la página principal (`BeamsBackground`)

La vista principal usa un fondo oscuro generado con tres gradientes radiales CSS superpuestos sobre el color base `#0a0a0f`:
- Azul eléctrico (hsl 210) en el cuadrante superior-izquierdo
- Púrpura (hsl 260) en el inferior-derecho
- Cian (hsl 190) en la parte superior-central

El componente `BeamsBackground` devuelve un `<div>` con `position: fixed; inset: 0` para cubrir siempre el viewport completo sin importar el scroll. Tiene `z-index: 0` y `pointer-events: none` para no interferir con los elementos interactivos.

El contenido principal (`main.content`) tiene `position: relative; z-index: 1` para apilarse encima del fondo. El `Header` usa `z-index: 10` y el `Footer` usa `z-index: 2` para garantizar que siempre sean visibles.

### Layout split-panel en páginas de autenticación

`Login` y `Register` usan un layout de dos columnas dentro de una tarjeta centrada (`max-width: 860px`):

```
┌──────────────────────────────────────────────────┐
│   Panel izquierdo (oscuro)  │  Panel derecho      │
│   Logo + tagline + glow     │  Formulario claro   │
│   radial gradient           │  (#f8f8f8)          │
└──────────────────────────────────────────────────┘
```

En mobile (`max-width: 600px`) el panel izquierdo se oculta con `display: none` y solo se muestra el formulario.

### Cabecera en páginas de autenticación

`Header.jsx` detecta si la ruta actual es `/signin` o `/signup` con `useLocation()` y **oculta los links de navegación** en esas páginas. Solo muestra el logo, manteniendo la cabecera limpia durante el flujo de autenticación.

---

## CSS — arquitectura de importaciones

Todo el CSS se centraliza en `src/index.css`, que importa cada archivo en orden usando `@import`:

```css
/* index.css */
@import url(./assets/vendor/normalize.css);
@import url(./assets/blocks/page.css);
@import url(./components/Header/Header.css);
/* ... etc */
```

**Regla crítica:** las sentencias `@import` deben ir al principio del archivo, antes de cualquier otra regla CSS. Si se coloca una regla (`@keyframes`, selectores, etc.) antes de un `@import`, ese import y todos los siguientes son **ignorados** por la especificación CSS. En desarrollo con Vite esto puede pasar desapercibido porque el dev server inyecta CSS via JavaScript, pero en el build de producción (Rollup) los imports inválidos se descartan completamente, dejando la app sin estilos.

---

## Lógica de likes

En `App.jsx`, `handleCardLike` detecta si el usuario ya dio like antes de llamar al API:

```js
const liked = card.likes.some(
  (like) =>
    (typeof like === "string" && like === currentUser._id) ||
    (typeof like === "object" && like._id === currentUser._id)
);
// Si liked → DELETE /cards/:id/likes (quitar like)
// Si !liked → PUT /cards/:id/likes (dar like)
```

El doble check de tipo (`string` vs `object`) maneja dos casos: cuando el backend devuelve el array de likes como IDs en crudo, o cuando los popula como objetos completos.

---

## Variables de entorno

Vite expone variables de entorno al código del navegador **solo si empiezan con `VITE_`**.

Crear `frontend/.env.local` para desarrollo local (no se commitea):

```env
VITE_AUTH_BASE_URL=http://localhost:3000
VITE_MAIN_API_BASE_URL=http://localhost:3000
```

En Vercel (producción) se configuran en el dashboard del proyecto bajo "Environment Variables":

```env
VITE_AUTH_BASE_URL=https://around-backend-l7gc.onrender.com
VITE_MAIN_API_BASE_URL=https://around-backend-l7gc.onrender.com
```

Vite incrusta estos valores **en el momento del build**, no en runtime. Cambiar una variable en Vercel requiere un nuevo despliegue para que tome efecto.

---

## Instalación y ejecución local

```bash
cd frontend
npm install

# Crear .env.local con las variables de arriba

npm run dev      # Servidor de desarrollo → http://localhost:5173
npm run build    # Genera la carpeta dist/ lista para producción
npm run preview  # Sirve el build de dist/ localmente para verificarlo
npm run lint     # Ejecuta ESLint con reglas de React Hooks
```
