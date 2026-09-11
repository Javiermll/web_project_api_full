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
│   │   ├── App.jsx                # Raíz: estado global, routing, handlers, tema activo
│   │   ├── Landing/                # Pantalla de bienvenida antes del login (sin sesión)
│   │   ├── AuthMosaicBackground/   # Mosaico de fotos animado — fondo fijo compartido por Landing/Login/Register
│   │   ├── Header/                 # Barra superior: logo, email, cerrar sesión, selector de tema (solo con sesión)
│   │   ├── ThemeSwitcher/          # Selector de los 5 temas visuales, persistido en localStorage
│   │   ├── Footer/                 # Pie de página (oculto en landing y páginas de auth)
│   │   ├── Main/                   # Vista principal autenticada con tarjetas
│   │   ├── Card/                   # Componente de tarjeta individual
│   │   ├── Login/                  # Página de inicio de sesión — tarjeta flotante sobre el mosaico
│   │   ├── Register/               # Página de registro — mismo formato de tarjeta que Login
│   │   ├── BeamsBackground/        # Fondo de la vista principal — lee `var(--app-bg)` del tema activo
│   │   ├── icons/                  # Íconos SVG en línea (currentColor, se adaptan al tema)
│   │   └── InfoTooltip/            # Modal de resultado (éxito/error)
│   ├── contexts/
│   │   └── CurrentUserContext.js  # Context de React con los datos del usuario actual
│   ├── hooks/
│   │   └── useSlowSubmitHint.js   # Muestra un aviso si un submit tarda (cold start de Render)
│   ├── assets/blocks/
│   │   └── themes.css             # Variables CSS de los 5 temas visuales
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
  ├── theme ""         → tema visual activo, persistido en localStorage
  └── tooltip {}       → estado del modal de resultado
      │
      ├── CurrentUserContext.Provider  → pasa currentUser a cualquier componente
      │
      ├── <Header />           → recibe email, onSignOut, theme y onThemeChange
      │   └── <ThemeSwitcher />
      ├── <Main />             → recibe cards, handlers de CRUD
      │   └── <Card />
      ├── <Landing />          → se muestra en "/" cuando no hay sesión
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

Mientras `checkingToken` es `true`, se muestra una pantalla de carga con marca propia (logo con pulso, spinner y mensaje "Conectando con el servidor…" sobre el mismo mosaico animado de la landing) para evitar un parpadeo de contenido no autenticado antes de verificar la sesión, y para que la espera del cold start de Render se sienta intencional en vez de una app trabada.

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
/          → isAuthenticated() ? <Main /> : <Landing />
/signin    → <Login />
/signup    → <Register />
*          → redirige a / si autenticado, o a /signin si no
```

La ruta raíz decide directamente entre `<Main />` y `<Landing />` según `isAuthenticated()`, sin necesidad de un componente wrapper de redirección: si hay sesión se muestra la vista principal, y si no, la landing con el mosaico animado. Esto reemplazó al antiguo `ProtectedRoute`, que quedó sin uso una vez que la landing pasó a ser el destino natural para visitantes sin sesión.

Los links "Crear cuenta" / "Iniciar sesión" de la landing, y los links cruzados entre Login y Register, usan el prop `viewTransition` de React Router para animar la navegación con la View Transitions API nativa del navegador (ver sección de Diseño UI).

El `Header` y el `Footer` no se renderizan en la landing ni en las páginas de auth (`/signin`, `/signup`) — solo aparecen en la vista principal autenticada.

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

### Landing y mosaico animado (`Landing`, `AuthMosaicBackground`)

Los visitantes sin sesión llegan primero a `Landing`: logo, título, subtítulo y dos botones ("Crear cuenta" / "Iniciar sesión") sobre un mosaico de fotos con scroll infinito.

El mosaico vive en un componente aparte, `AuthMosaicBackground`, montado directamente en `App.jsx` (no dentro de cada página) con `position: fixed; inset: 0`. Al vivir fuera de las rutas, **nunca se desmonta** al navegar entre Landing, Login y Register — sigue moviéndose de forma continua durante toda la transición. Son 4 columnas de fotos duplicadas (para el loop sin cortes), cada una con una duración y dirección de animación distinta, más un degradado oscuro encima para que el texto se lea bien sobre cualquier foto.

### Transiciones entre pantallas

La navegación entre Landing, Login y Register usa el prop `viewTransition` de `<Link>` (View Transitions API nativa del navegador, disponible en React Router v7). La página saliente se achica y desvanece; la entrante aparece un poco más grande y se asienta. El mosaico de fondo se excluye explícitamente de esa animación (vía `view-transition-name` + `animation: none` en CSS) para que no parpadee, ya que de todas formas nunca se remonta.

### Tarjetas flotantes de Login/Register

`Login` y `Register` ya no usan un layout de dos columnas: son una tarjeta centrada y flotante (`max-width: 400px`) sobre el mosaico compartido, con el logo (invertido a oscuro con CSS `filter: invert(1)` para verse sobre el fondo claro de la tarjeta), título y subtítulo centrados, y una animación de entrada (`fade` + `scale`).

### Sistema de temas (`themes.css`, `ThemeSwitcher`)

La vista principal autenticada tiene 5 temas visuales seleccionables, cada uno con su propia paleta, tipografía y forma de botones:

| Tema | Tipografía | Forma de botones |
|------|-----------|-------------------|
| Clásico | Space Grotesk | Redondeada (10px) |
| Viaje | Fraunces (serif) | Píldora |
| Océano | Outfit | Redondeada (14px) |
| Atardecer | Playfair Display (serif) | Casi recta (6px) |
| Mono | Space Mono | Recta (0px) |

Cada tema define un mismo conjunto de variables CSS (`--app-bg`, `--accent`, `--text-primary`, `--header-bg`, `--font-heading`, `--radius-button`, etc.) bajo un selector `[data-theme="..."]` en `assets/blocks/themes.css`. `App.jsx` guarda el tema activo en `localStorage` y lo aplica con `document.documentElement.setAttribute("data-theme", theme)`. Componentes como `BeamsBackground`, el perfil y el `Header` consumen esas variables con `var(...)` en vez de colores fijos, así cambiar de tema no requiere lógica condicional en JavaScript.

`ThemeSwitcher` (visible solo con sesión iniciada, junto al email y "Cerrar sesión") muestra un botón circular con el color del tema activo; al hacer clic despliega los 5 temas disponibles como opciones.

Los íconos de la interfaz (agregar tarjeta, editar perfil) son SVG en línea (`components/icons/Icons.jsx`) con `stroke="currentColor"`, así heredan el color del tema automáticamente sin necesitar filtros CSS.

### Cabecera

`Header` no se renderiza en la landing ni en `/signin` / `/signup` — en esas pantallas el mosaico y las tarjetas flotantes ocupan toda la pantalla sin una barra superior. En la vista principal autenticada, el `Header` usa `background: var(--header-bg)` y una línea inferior con `var(--header-border)`, ambas definidas por el tema activo.

### Estado de carga durante el cold start de Render

Dado que el backend gratuito de Render "duerme" tras un período de inactividad, dos pantallas comunican la espera en vez de dejar al usuario sin señales:

- **Al abrir la app** (verificación de sesión guardada): pantalla de carga de marca propia con logo pulsante, spinner y el mensaje "Conectando con el servidor…", sobre el mismo mosaico animado.
- **Al enviar Login/Register**: el botón muestra un spinner junto al texto, y si la respuesta tarda más de ~3.5 segundos (hook `useSlowSubmitHint`), aparece un aviso explicando que el servidor se está despertando.

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
