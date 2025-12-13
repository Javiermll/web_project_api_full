# Tripleten web_project_api_full

# Sprint Final - Backend: Registro y Autorización de Usuarios

## Resumen del desafío 1

### Objetivo

Agregar autenticación básica al backend permitiendo el registro de usuarios con correo electrónico y contraseña, asegurando la unicidad y validez del email.

### Pasos realizados

1. **Modificación del esquema de usuario (`models/user.js`):**

   - Se añadieron los campos `email` y `password`.
   - El campo `email` se configuró como único y se validó usando el paquete `validator` para asegurar el formato correcto.
   - El campo `password` se añadió con una longitud mínima y requerido.

2. **Actualización del controlador de usuarios (`controllers/users.js`):**

   - Se ajustó la función de registro para aceptar y guardar los campos `email` y `password`.
   - Se implementó la validación para evitar registros con emails duplicados, retornando un error 409 en caso de conflicto.

3. **Pruebas realizadas:**
   - Se utilizó Postman para enviar solicitudes POST a `/users` con los datos requeridos.
   - Se verificó en MongoDB Compass que los usuarios se registran correctamente y que no se permiten emails duplicados.
   - Se comprobó que la validación de email y password funciona como se espera.

### Resultado

## Resumen del desafío 2

### Objetivo

Actualizar el registro de usuarios para:

- Permitir que los campos `name`, `about` y `avatar` sean opcionales y tomen valores por defecto si no se envían.
- Asegurar que la contraseña (`password`) se almacene de forma segura usando hash.
- Mantener `email` y `password` como campos obligatorios.

### Cambios realizados

1. **Modificación del esquema de usuario (`models/user.js`):**

   - Se eliminaron los requisitos obligatorios (`required`) de los campos `name`, `about` y `avatar`.
   - Se añadieron valores por defecto:
     - `name`: "Jacques Cousteau"
     - `about`: "Explorador"
     - `avatar`: "https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg"
   - Se mantuvieron `email` y `password` como obligatorios.

2. **Actualización del controlador (`controllers/users.js`):**

   - Se implementó el hash de la contraseña usando `bcryptjs` antes de guardar el usuario.
   - Se ajustó la lógica para que, si no se envían los campos opcionales, se usen los valores por defecto definidos en el esquema.
   - Se aseguró que el campo `password` no se devuelva en la respuesta de la API.

3. **Pruebas realizadas:**
   - Se envió una solicitud POST a `/users` solo con `email` y `password`.
   - Se verificó en MongoDB Compass que el usuario se creó con los valores por defecto en los campos opcionales y que la contraseña está hasheada.
   - Se comprobó que la respuesta de la API no incluye el campo `password`.

### Resultado

El backend ahora permite registrar usuarios con solo `email` y `password`, asignando valores por defecto a los campos opcionales y almacenando la contraseña de forma segura.

# Sprint Final - Backend: Desafío 3 - Controlador de Login y Autenticación

## Resumen del desafío 3

### Objetivo

Implementar un controlador `login` que autentique usuarios mediante email y contraseña, y genere un token JWT con el identificador del usuario en el payload, expirando en una semana.

### Cambios realizados

1. **Creación del controlador `login` en `controllers/users.js`:**

   - Recibe `email` y `password` desde la solicitud.
   - Busca el usuario por email y obtiene el hash de la contraseña.
   - Verifica la contraseña usando `bcryptjs`.
   - Si la autenticación es exitosa, genera un token JWT con el `_id` del usuario y expiración de 7 días.
   - Envía el token al cliente en el cuerpo de la respuesta.
   - Si la autenticación falla, responde con error 401.

2. **Integración de la ruta `/login` en `app.js`:**

   - Se añadió la ruta POST `/login` que utiliza el controlador `login`.

3. **Pruebas realizadas:**
   - Se envió una solicitud POST a `/login` con credenciales válidas y se recibió el token JWT esperado.
   - Se verificó que el token contiene el `_id` del usuario y que expira correctamente.
   - Se comprobó que solicitudes con credenciales incorrectas reciben error 401.

### Resultado

El backend ahora permite autenticar usuarios y entregar un token JWT seguro, cumpliendo con el objetivo de autenticación básica para el proyecto.

### Próximos pasos

- Implementar el uso del token JWT para proteger rutas privadas.
- Eliminar el middleware de autorización temporal y reemplazarlo por autenticación real.

# Desafío 4 - Rutas de Registro e Inicio de Sesión

## Objetivo del desafío

Separar y definir claramente las rutas para el registro (`/signup`) y el inicio de sesión (`/signin`) de usuarios en la API, siguiendo buenas prácticas de autenticación y facilitando la integración con el frontend.

## Cambios realizados

1. **En `app.js`:**

   - Se agregaron las rutas:
     - `POST /signup` → controlador `createUser` (registro de usuario)
     - `POST /signin` → controlador `login` (inicio de sesión)
   - Se importó correctamente el controlador `createUser`.

2. **En `routes/users.js`:**
   - Se comentó/eliminó la ruta de creación de usuario (`router.post("/", createUser);`), ya que ahora el registro se maneja en `/signup`.

## Objetivo de la prueba realizada

- Verificar que la ruta `/signup` permite registrar nuevos usuarios correctamente.
- Verificar que la ruta `/signin` permite iniciar sesión y devuelve un token JWT válido.
- Confirmar que ambas rutas funcionan de forma independiente y responden según lo esperado en Postman.

## Resultado

- Ambas rutas (`/signup` y `/signin`) funcionan correctamente en Postman.
- El registro de usuario y el inicio de sesión están separados y cumplen con las mejores prácticas de autenticación.
- El backend está listo para integrarse con el frontend y manejar autenticación de usuarios de forma segura.

## Próximos pasos

- Proteger rutas privadas usando el token JWT.
- Eliminar el middleware de autorización temporal y usar autenticación real en el backend.

# Backend: Desafío 5 - Middleware de Autorización JWT

## Objetivo

Implementar un middleware de autorización en el backend que verifique el token JWT en las solicitudes a rutas protegidas, permitiendo el acceso solo a usuarios autenticados.

## Cambios realizados

1. **Creación del archivo `middlewares/auth.js`:**

   - Se implementó un middleware que:
     - Extrae el token JWT del header `Authorization`.
     - Verifica el token usando la clave secreta.
     - Si el token es válido, asigna el payload a `req.user` y llama a `next()`.
     - Si el token falta o es inválido, responde con error 401.

2. **Aplicación del middleware en `app.js`:**
   - Se protegieron las rutas `/users` y `/cards` usando el middleware `auth`.
   - Se eliminaron rutas duplicadas y middleware temporal.

## Conceptos clave

- **JWT (JSON Web Token):** Token seguro que contiene información del usuario y se usa para autenticación.
- **Middleware:** Función que intercepta solicitudes y puede permitir, modificar o bloquear el acceso.
- **Autorización:** Proceso de verificar que el usuario tiene permiso para acceder a una ruta.
- **Header `Authorization`:** Lugar donde el cliente envía el token JWT en el formato `Bearer <token>`.

## Práctica y resultados

- Al hacer login, el backend genera un token JWT único para el usuario.
- Al acceder a rutas protegidas, el cliente debe enviar el token en el header `Authorization`.
- Si el token es válido, el usuario accede a la información protegida (código 200 OK).
- Si el token es inválido o falta, el backend responde con error 401.
- Reiniciar el servidor es necesario para aplicar cambios recientes en el middleware.

**Resultado:**  
La protección de rutas con JWT está correctamente implementada y solo permite acceso a usuarios autenticados.

## Próximos pasos

- Proteger otras rutas sensibles.
- Usar variables de entorno para la clave secreta en producción.

# Backend: Desafío 6 - Obtener datos del usuario autenticado

## Objetivo

Permitir que el usuario autenticado obtenga sus propios datos mediante la ruta protegida `GET /users/me`, usando el token JWT para identificarlo de forma segura.

## Modificaciones realizadas

1. **Controlador `getCurrentUser` en `controllers/users.js`:**

   - Se creó una función que obtiene el usuario actual usando el campo `_id` del token JWT (`req.user._id`).
   - Se valida que el ID sea un ObjectId válido antes de buscar el usuario en la base de datos.

2. **Ruta `/users/me` en `routes/users.js`:**
   - Se añadió la ruta `GET /me` y se asignó el controlador `getCurrentUser`.
   - Se reordenaron las rutas para que `/me` esté antes que `/:userId`, evitando conflictos de coincidencia.

## Pruebas realizadas

- Se hizo login en `/signin` y se obtuvo el token JWT.
- Se realizó una solicitud GET a `/users/me` con el token en el header `Authorization`.
- Se verificó que la respuesta contiene los datos del usuario autenticado.
- Se comprobó que, al enviar un token inválido o sin token, la ruta responde con error 401.
- Se identificó y corrigió el problema de orden en las rutas, que causaba errores de coincidencia.

## Teoría relevante: Orden de rutas estáticas y dinámicas en Express

- **Express evalúa las rutas en el orden en que se definen.**
- Las rutas estáticas (como `/me`) deben ir antes que las rutas dinámicas (como `/:userId`).
- Si una ruta dinámica aparece antes, puede capturar solicitudes destinadas a rutas estáticas, generando errores inesperados

- **Buenas prácticas:**
  - Define primero las rutas más específicas o estáticas.
  - Coloca las rutas con parámetros al final.
  - Esto asegura que cada solicitud sea manejada por el controlador correcto y evita conflictos de coincidencia.

## Resultado

La ruta `/users/me` ahora permite obtener los datos del usuario autenticado de forma segura y confiable, siguiendo buenas prácticas en la definición de rutas en Express.

# Backend: Desafío 7 - Protección global de la API con autorización

## Objetivo

Asegurar que todas las rutas de la API estén protegidas mediante autorización JWT, excepto las rutas públicas de registro (`/signup`) e inicio de sesión (`/signin`). El middleware debe devolver un error 403 cuando un usuario no autorizado intente acceder a rutas protegidas.

## Cambios realizados

1. **Modificación del middleware de autorización (`middlewares/auth.js`):**

   - Se actualizó para devolver un error 403 (`res.status(403)`) cuando el token JWT falta o es inválido.

2. **Configuración de rutas en `app.js`:**
   - Se aplicó el middleware `auth` a todas las rutas protegidas (`/users`, `/cards`).
   - Se dejaron públicas las rutas `/signin` y `/signup` (no requieren token).

## Pruebas realizadas

- Se probó acceder a rutas protegidas (`/users`, `/cards`) con un token válido: acceso permitido (200 OK).
- Se probó acceder a rutas protegidas sin token o con token inválido: acceso denegado (403 Forbidden).
- Se probó acceder a rutas públicas (`/signin`, `/signup`) sin token: acceso permitido.

## Conceptos clave

- **JWT (JSON Web Token):** Token seguro que identifica al usuario autenticado.
- **Middleware de autorización:** Función que protege rutas y verifica la validez del token.
- **Código 403 Forbidden:** Indica que el usuario no tiene permiso para acceder a la ruta.
- **Rutas públicas vs protegidas:** Solo `/signin` y `/signup` son públicas; el resto requiere autenticación.

## Resultado

La API ahora está completamente protegida: solo usuarios autenticados pueden acceder a rutas sensibles, y los intentos no autorizados reciben un error 403, cumpliendo con las mejores prácticas de seguridad.

# Backend: Desafío 8 - Eliminación del usuario hardcoded

## Objetivo

Eliminar el middleware que asignaba manualmente un usuario fijo (`req.user`) en cada solicitud, ya que era solo una solución temporal antes de implementar la autorización real con JWT.

## Cambios realizados

- Se eliminó el siguiente fragmento de código de `app.js`:
  ```javascript
  app.use((req, res, next) => {
    req.user = {
      _id: "5d8b8592978f8bd833ca8133",
    };
    next();
  });
  ```

---

Ahora, únicamente el middleware de autorización (auth.js) es responsable de asignar el usuario autenticado a req.user usando el token JW

## Razón y beneficio de la actualización

- Motivo de la eliminación:
  El middleware hardcoded permitía el acceso a rutas protegidas sin autenticación real, lo que era útil solo para pruebas iniciales.
- Ventaja de la nueva solución:
  Con la autorización JWT, solo los usuarios autenticados pueden acceder a rutas protegidas, garantizando seguridad y control de acceso real.
- Resultado:
  El backend es ahora más seguro y profesional, cumpliendo con las mejores prácticas de autenticación y autorización.

## Conclusión

Eliminar el usuario hardcoded asegura que toda la lógica de autenticación y autorización dependa exclusivamente del middleware JWT, haciendo la API segura y lista para producción. `

# Backend: Desafío 9 - Comprobación de derechos de usuario

## Objetivo

Asegurar que los usuarios solo puedan borrar sus propias tarjetas y editar su propio perfil/avatar, evitando que modifiquen o eliminen recursos de otros usuarios.

## Conceptos clave

- **Autorización basada en propiedad:** Solo el propietario de un recurso puede modificarlo o eliminarlo.
- **Protección de endpoints:** Validar el usuario autenticado (`req.user._id`) contra el propietario del recurso antes de permitir acciones sensibles.
- **Errores Forbidden (403):** Se devuelve cuando un usuario intenta modificar o eliminar recursos que no le pertenecen.

## Modificaciones realizadas

- En `controllers/cards.js`:
  - Se comprobó que el usuario autenticado solo puede borrar tarjetas si es el propietario (`card.owner === req.user._id`).
- En `controllers/users.js`:
  - Se añadió validación para que solo el usuario autenticado pueda editar su propio perfil y avatar.

## Pruebas realizadas

- Se intentó editar el perfil/avatar del usuario autenticado: éxito (200 OK).
- Se intentó editar el perfil/avatar de otro usuario: error 403 Forbidden.
- Se intentó borrar una tarjeta propia: éxito (200 OK).
- Se intentó borrar una tarjeta de otro usuario: error 403 Forbidden.

## Resultado

La API ahora garantiza que cada usuario solo puede modificar o eliminar sus propios recursos, cumpliendo con las mejores prácticas de seguridad y autorización.

# Backend: Desafío 10 - Ocultar el hash de la contraseña

## Objetivo

Evitar que la API devuelva el hash de la contraseña del usuario en cualquier respuesta, protegiendo así la información sensible y cumpliendo con buenas prácticas de seguridad.

## Conceptos clave

- **select: false:** Configuración en el esquema de Mongoose para ocultar el campo `password` en las consultas por defecto.
- **Autenticación segura:** El hash de la contraseña solo se utiliza internamente para comparar credenciales en el login, nunca se expone en la API.
- **Exposición mínima de datos:** Solo se devuelven los datos necesarios al frontend, nunca información sensible como contraseñas.

## Modificaciones realizadas

- En `models/user.js`:
  - Se añadió `select: false` al campo `password` en el esquema de usuario.
- En `controllers/users.js`:
  - En el controlador de login, se usó `.select('+password')` para acceder al hash solo cuando es necesario para la autenticación.

## Prueba realizada

- Se registró un usuario y se verificó que el campo `password` no aparece en la respuesta.
- Se hizo login y se comprobó que el campo `password` tampoco aparece en la respuesta.
- Se consultaron los usuarios (`GET /users` y `GET /users/me`) y se confirmó que el campo `password` no se expone en ninguna respuesta de la API.

## Resultado

La API ahora protege el hash de la contraseña, cumpliendo con las mejores prácticas de seguridad y privacidad de datos.

# Backend: Desafío 12 - Manejo centralizado de errores en el backend

Implementar un middleware global para el manejo centralizado de errores en la API, asegurando que:

- Los errores no se devuelvan directamente al cliente.
- Los controladores deleguen el manejo de errores al middleware usando next(err).
- Los errores imprevistos devuelvan un status 500 y un mensaje genérico.
- El parámetro next en los middlewares no cause advertencias de ESLint.

## Cambios Realizados

1. Middleware de Manejo de Errores

- Se agregó un middleware al final de app.js que captura cualquier error y responde con un mensaje limpio y el status adecuado.
  Ejemplo de respuesta para error 500:

  ```javascript
  { "message": "Error interno del servidor" }
  ```

2. Controladores Actualizados

   - Todos los controladores (users.js, cards.js) usan next(err) para delegar el manejo de errores al middleware centralizado.
   - Se evita el uso de res.send(err) o res.status(...).send(err) directamente en los catch.

3. Configuración de ESLint
   - Se actualizó el archivo .eslintrc para permitir el uso del parámetro next no utilizado en los middlewares:
   ```javascript
   "no-unused-vars": ["error", { "argsIgnorePattern": "next" }]
   ```
4. Pruebas Sugeridas
   - Se recomienda probar rutas inexistentes, datos inválidos y accesos no autorizados usando Postman para verificar que los errores se manejan correctamente y el cliente recibe solo mensajes limpios.

# Desafío 13: Validación de Solicitudes en el Backend

## Objetivo

Implementar la validación de los datos de entrada (body, params) en las rutas de la API usando celebrate (Joi) y validator, para asegurar que solo se procesen solicitudes que cumplan con los esquemas definidos. Si la solicitud no es válida, la API debe devolver un error claro y estructurado.

---

## Conceptos Clave

- **Validación en el backend:** Es fundamental validar los datos en el servidor, incluso si ya existe validación en el frontend.
- **celebrate:** Middleware para Express basado en Joi, que permite validar fácilmente body, params, query, headers, etc.
- **Joi:** Librería para definir y validar esquemas de datos.
- **validator:** Librería para validaciones específicas, como URLs estrictas.
- **Middleware de errores de celebrate:** Permite capturar y responder adecuadamente a los errores de validación.

---

## Modificaciones Realizadas

1. **Archivo `utils/validator.js`**

   - Se creó la función personalizada `validateURL` usando `validator.isURL` para validación estricta de URLs en los esquemas Joi.

2. **Rutas (`routes/cards.js` y `routes/users.js`)**

   - Se agregaron middlewares de validación con celebrate/Joi en las rutas que reciben datos:
     - Validación de body para crear tarjetas y actualizar perfil/avatar.
     - Validación de params para IDs de usuario y tarjeta.
     - Uso de la función `validateURL` para campos de tipo URL.

3. **Archivo `app.js`**
   - Se añadió el middleware de errores de celebrate (`app.use(celebrate.errors())`) antes del middleware global de errores.

---

## Pruebas Realizadas

1. **Crear tarjeta con datos inválidos**

   - POST `/cards` con body inválido (`name` vacío, `link` no es URL).
   - Resultado: Error 400, mensaje de validación.

2. **Actualizar avatar con URL inválida**

   - PATCH `/users/me/avatar` con body `{ "avatar": "avatar_sin_protocolo.com" }`.
   - Resultado: Error 400, mensaje de validación.

3. **Acceder a usuario con ID inválido**

   - GET `/users/123`
   - Resultado: Error 400, mensaje de validación.

4. **Crear tarjeta con datos válidos**
   - POST `/cards` con body válido.
   - Resultado: Status 201, tarjeta creada correctamente.

---

## Resumen

- Ahora todas las rutas críticas del backend validan los datos de entrada antes de llegar a los controladores.
- Los errores de validación se devuelven de forma clara y estructurada.
- Se garantiza mayor seguridad y robustez en la API.

---

# Desafío 14: Registro de Solicitudes y Errores en el Backend

## Objetivo

- Implementar un sistema de logging para la API que:
- Registre cada solicitud recibida en el archivo `request.log`.
- Registre cada error ocurrido en el archivo `error.log`.
- Ambos archivos deben estar en formato JSON y no subirse al repositorio.

---

## Conceptos Clave

- **Middleware de logging:** Permite registrar información de cada request y error de forma centralizada.
- **Formato JSON:** Facilita el análisis y procesamiento automático de los logs.
- **Exclusión en .gitignore:** Los archivos de log no deben ser versionados.

---

## Modificaciones Realizadas

1. **Archivo `utils/logger.js`**

   - Se crearon dos middlewares:
     - `requestLogger`: Registra cada solicitud (método, url, headers, body, etc.) en `request.log`.
     - `errorLogger`: Registra cada error (mensaje, stack, statusCode, etc.) en `error.log`.

2. **Archivo `app.js`**

   - Se agregó `app.use(requestLogger)` antes de las rutas para registrar todas las solicitudes.
   - Se modificó el middleware de rutas no encontradas para pasar el error 404 a los middlewares de error.
   - Se agregó `app.use(errorLogger)` antes del middleware global de manejo de errores para registrar todos los errores.

3. **Archivo `.gitignore`**
   - Se aseguró que `request.log` y `error.log` estén listados para no ser subidos al repositorio.

---

## Pruebas Realizadas

- Se realizaron solicitudes válidas y erróneas desde Postman:
  - Todas las solicitudes aparecen en `request.log`.
  - Los errores (por ejemplo, rutas no encontradas o validaciones fallidas) aparecen en `error.log`.
- Se verificó que los archivos se crean automáticamente en la raíz del backend y cada línea es un objeto JSON.

---

## Resultado

- El sistema de logging funciona correctamente: cada request y error queda registrado en su archivo correspondiente.
- Los archivos de log están protegidos del control de versiones.
- El backend ahora es más auditable y fácil de depurar.

---
