# Around The U.S. — Proyecto 18 (Auth Frontend)

Frontend React con registro, autorización y mejoras de UI/UX. Este repositorio parte del Proyecto 14 y agrega la capa de autenticación conectada al backend temporal de TripleTen.

## Ejecutar
- Requisitos: Node 18+
- Instalar: `npm install`
- Dev: `npm run dev` (http://localhost:5173)
- Build: `npm run build` y `npm run preview`

## Qué se implementó en Proyecto 18

1) Rutas y redirecciones
- Rutas públicas para no autenticados:
  - /signup — registro
  - /signin — inicio de sesión
- Ruta protegida:
  - / — solo usuarios autenticados.
- Redirección automática de no autenticados a /signin.
- Componente ProtectedRoute para envolver la ruta raíz.

2) Componentes nuevos/extendidos
- Login: formulario de autenticación (email/contraseña), hint a signup, estados de envío.
- Register: formulario de registro, hint a signin, estados de envío.
- InfoTooltip: modal de resultado (éxito/error) reutilizable.
  - Éxito de registro: “¡Correcto! Ya estás registrado.”
  - Error de login: “Uy, algo salió mal. Por favor, inténtalo de nuevo.”
- Header: versión para autenticados y no autenticados.
  - Mobile autenticado: menú hamburguesa que despliega email y “Cerrar sesión” y cambia a botón “×” al abrir.
  - Desktop en páginas de auth (signin/signup): logo a la izquierda y enlace a la derecha ocupando todo el ancho.
- Footer: oculto en páginas de auth (según mock).

3) Integración con backend de TripleTen
- Base URL: https://se-register-api.en.tripleten-services.com/v1
- Endpoints:
  - POST /signup — registro
  - POST /signin — autorización, devuelve token JWT
  - GET /users/me — valida token y retorna email
- El resto de endpoints del proyecto (cards, user, likes, etc.) funcionan apuntando a la API existente, añadiendo el header Authorization: Bearer {token}.
- Módulo src/utils/auth.js con las funciones de auth. Las llamadas se orquestan en App.jsx (no en Login/Register).

4) Autenticación y manejo de token
- Al iniciar sesión:
  - Se envían credenciales a /signin, se guarda el token en localStorage ("jwt").
  - Se valida con /users/me, se muestra email en Header y se carga el contenido protegido.
- Registro:
  - En éxito se muestra InfoTooltip con el mensaje de confirmación.
- Persistencia:
  - En montado de App, si hay token, se valida con /users/me y se inicia la sesión sin pedir credenciales.
- Cerrar sesión:
  - Limpia localStorage y redirige a /signin.

## Cambios de UI/UX y layout aplicados

- Layout base:
  - :root con --header-height.
  - html, body, #root → height: 100%.
  - Contenedor .app (display:flex, min-height:100vh) y .main (flex:1) para empujar el Footer al fondo.
  - Limpieza de page.css para evitar centrados no deseados en body y márgenes que rompían el layout.

- Formularios (Login y Register) unificados:
  - Centrado vertical y horizontal.
  - Ancho máx. 360px.
  - Títulos visibles con separación mayor sobre los campos.
  - Inputs con borde inferior, placeholders y focus consistentes.
  - Botón con separación uniforme y hint centrado debajo.
  - Footer oculto en pantallas de auth.

- Header:
  - Desktop (auth pages): ocupa todo el ancho; logo a la izquierda y enlace (signin/signup) al extremo derecho.
  - Mobile (usuario autenticado): icono hamburguesa → panel con email y “Cerrar sesión”; botón cambia a “×” para cerrar.
  - Desktop (usuario autenticado): se mantienen visibles email y “Cerrar sesión” en la barra.

## Estructura relevante
- src/components/Header/ — Header.jsx, Header.css (desktop + móvil con menú).
- src/components/Login/ — Login.jsx, Login.css.
- src/components/Register/ — Register.jsx, Register.css.
- src/components/InfoTooltip/ — InfoTooltip.jsx, InfoTooltip.css.
- src/utils/auth.js — signup, signin, checkToken y helpers de token (localStorage).
- src/assets/blocks/page.css — layout global (.app/.main).

## Especificación de API (resumen)

Registro — POST /signup
- Headers: Content-Type: application/json
- Body: { "password": "xxxxxx", "email": "user@mail.com" }
- Respuesta éxito: { "data": { "email": "...", "_id": "..." } }
- 400: campos inválidos

Login — POST /signin
- Headers: Content-Type: application/json
- Body: { "password": "xxxxxx", "email": "user@mail.com" }
- Respuesta éxito: { "token": "JWT" }
- 400: campos faltantes, 401: usuario no encontrado

Validación — GET /users/me
- Headers: Authorization: Bearer {token}
- Respuesta éxito: { "data": { "email": "...", "_id": "..." } }
- 400: token ausente/incorrecto, 401: token inválido

## Notas
- Las llamadas a auth se hacen en App.jsx; los formularios solo disparan eventos.
- La vista móvil de Login/Register se mantuvo sin cambios según requerimiento.
- El diseño de Header en desktop se aplica solo en páginas de auth para maximizar separación logo/enlace.