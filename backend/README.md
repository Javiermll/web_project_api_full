# Guía de configuración del proyecto web_project_around_express

## 1. Estructura del proyecto

- Se creó la carpeta `web_project_around_express` con subcarpetas `backend` y `frontend`.
- En `backend` se añadieron las carpetas `routes` y `data` para organizar rutas y archivos JSON.

## 2. Inicialización del proyecto

- Se ejecutó `npm init` para crear el archivo `package.json` y definir los campos principales.

## 3. Configuración de archivos básicos

- Se creó `.gitignore` para ignorar archivos y carpetas innecesarias como `node_modules`, logs y configuraciones de IDE.
- Se creó `.editorconfig` para mantener un estilo de código uniforme entre todos los desarrolladores.

## 4. Configuración de ESLint

- Se instalaron las dependencias:
  - `eslint@8.56.0`
  - `eslint-config-airbnb-base`
  - `eslint-plugin-import`
  - `nodemon`
- Se creó el archivo `.eslintrc` con la configuración de Airbnb y excepciones para `_id`, `console.log` y saltos de línea.

## 5. Configuración de scripts en package.json

- Se añadieron los comandos:
  - `"start": "node app.js"` para iniciar el servidor.
  - `"dev": "nodemon app.js"` para desarrollo con hot reload.
  - `"lint": "npx eslint ."` para analizar el código con ESLint.

## 6. Creación del servidor Express

- Se creó el archivo `app.js` como punto de entrada.
- Se configuró Express para escuchar en el puerto 3000.
- Se añadieron los middlewares necesarios y las rutas principales.

## 7. Configuración de rutas y manejo de datos

- Se crearon los archivos `routes/users.js` y `routes/cards.js`.
- Se configuraron las rutas:
  - `GET /users` para obtener todos los usuarios.
  - `GET /users/:id` para obtener un usuario por ID, devolviendo 404 si no existe.
  - `GET /cards` para obtener todas las tarjetas.
- Se utilizó el módulo `fs` para leer y escribir en los archivos JSON, y el módulo `path` para construir rutas compatibles con cualquier sistema operativo.

## 8. Manejo de errores

- Se configuró un manejador 404 global para devolver el mensaje `{ "message": "Recurso solicitado no encontrado" }` en rutas no existentes, incluyendo la raíz `/`.

## 9. Pruebas

- Se recomendó probar las rutas y respuestas en Postman para verificar el correcto funcionamiento de la API.

---

# web_project_around_express (Parte 2)

Este proyecto construye una API REST con Express y MongoDB (usando Mongoose) para gestionar usuarios y tarjetas (cards). Su objetivo es practicar y dominar fundamentos de back-end modernos: enrutamiento, controladores, modelos con validación, manejo centralizado de errores y un esquema simple de autorización temporal. Con esto puedes exponer servicios reales, probarlos con Postman/curl y visualizar los datos en MongoDB Compass, sentando las bases para añadir autenticación real y desplegar en producción.

## 1. Requisitos previos

- Node.js LTS y npm
- MongoDB en local (servicio en 27017) + MongoDB Compass (opcional)
- Git (opcional, para versionado y subida a GitHub)
- Postman o cURL para probar endpoints

## 2. Estructura del proyecto

```
web_project_around_express/
├─ app.js
├─ controllers/
│  ├─ users.js
│  └─ cards.js
├─ routes/
│  ├─ users.js
│  └─ cards.js
├─ models/
│  ├─ user.js
│  └─ card.js
├─ errors/
│  └─ httpErrors.js
├─ package.json
├─ .gitignore
└─ README.md
```

- controllers: lógica de negocio de cada ruta.
- routes: definición de endpoints y enlace a controladores.
- models: esquemas Mongoose (validación y persistencia).
- errors: clases de error HTTP personalizadas.

## 3. Instalación

1. Instalar dependencias

```
npm install
```

2. Scripts disponibles

- start: inicia el servidor una sola vez.
- dev: inicia con nodemon (recarga al guardar).
- lint: ejecuta ESLint si está configurado en el proyecto.

Ejemplos:

```
npm run dev
```

## 4. Configuración

Variables de entorno recomendadas:

- PORT: puerto (por defecto 3000)
- MONGODB_URI: cadena de conexión (por defecto mongodb://localhost:27017/aroundb)
- TEST_USER_ID: id de usuario para autorización temporal (opcional; alternativa al header)

En PowerShell (Windows):

```
$env:PORT="3000"
$env:MONGODB_URI="mongodb://localhost:27017/aroundb"
$env:TEST_USER_ID="<ObjectId de tu usuario>"
npm run dev
```

## 5. Conexión a MongoDB

app.js realiza la conexión:

- Conecta a mongodb://localhost:27017/aroundb con mongoose.connect.
- Solo levanta el servidor tras conectar correctamente.

Puedes verificar en consola:

- “Conectado a MongoDB: mongodb://localhost:27017/aroundb”
- “Server is running on http://localhost:3000”

## 6. Autorización temporal (req.user)

Middleware en app.js:

- Inyecta req.user.\_id con un ObjectId “hard-coded” para pruebas.
- Permite sobrescribirlo con el header X-User-Id o la variable TEST_USER_ID.
- Útil para crear cards con owner y autorizar delete/likes sin implementar login todavía.

Ejemplo rápido con header:

- X-User-Id: <tu ObjectId de users>

## 7. Modelos y validaciones

- User: name, about, avatar (URL validada por regex).
- Card: name (2–30), link (URL válida), owner (ObjectId ref user), likes (array de ObjectId únicos), createdAt.

Las validaciones de Mongoose devuelven errores “ValidationError” → 400.

## 8. Rutas y controladores

Usuarios

- GET /users — lista todos
- GET /users/:userId — obtiene por id
- POST /users — crea usuario { name, about, avatar }
- PATCH /users/me — actualiza perfil { name, about }
- PATCH /users/me/avatar — actualiza avatar { avatar }

Tarjetas

- GET /cards — lista todas
- POST /cards — crea { name, link } usando req.user.\_id como owner
- DELETE /cards/:cardId — elimina si req.user.\_id es owner
- PUT /cards/:cardId/likes — da like con $addToSet
- DELETE /cards/:cardId/likes — quita like con $pull

Buenas prácticas aplicadas

- Validación de ObjectId con mongoose.isValidObjectId → 400 cuando es inválido.
- Búsquedas con .orFail(() => new NotFoundError(...)) → 404 si no existe.
- next(err) en controladores para delegar a un manejador global.

## 9. Manejo centralizado de errores

- errors/httpErrors.js define BadRequestError (400), NotFoundError (404), ForbiddenError (403).
- Middleware global en app.js:
  - Usa err.statusCode si viene de nuestros errores personalizados.
  - Mappea ValidationError/CastError → 400, DocumentNotFoundError → 404.
  - Predeterminado → 500 “Error interno del servidor”.

Resultado: respuestas consistentes y JSON con message.

## 10. Cómo probar

Con Postman

- Crear usuario:
  - POST http://localhost:3000/users
  - Body JSON: { "name":"Ana","about":"Dev","avatar":"https://example.com/a.jpg" }
- Crear card:
  - POST http://localhost:3000/cards
  - Header: X-User-Id: <\_id del usuario>
  - Body JSON: { "name":"My Card","link":"https://example.com/photo.jpg" }
- Like/Unlike:
  - PUT /cards/<cardId>/likes
  - DELETE /cards/<cardId>/likes
- Actualizar perfil:
  - PATCH /users/me Body: { "name":"Nuevo","about":"Bio" }
- Actualizar avatar:
  - PATCH /users/me/avatar Body: { "avatar":"https://..." }

Con PowerShell (Invoke-RestMethod)

```
Invoke-RestMethod -Uri http://localhost:3000/cards
Invoke-RestMethod -Method Post -Uri http://localhost:3000/cards `
  -Body (@{name='My Card'; link='https://example.com/photo.jpg'} | ConvertTo-Json) `
  -Headers @{ 'X-User-Id' = '<USER_ID>' } -ContentType 'application/json'
```

Ver datos en MongoDB

- Compass: conecta a mongodb://localhost:27017 → DB aroundb → colecciones users y cards.
- mongosh:
  - mongosh "mongodb://localhost:27017/aroundb"
  - db.users.find().pretty()
  - db.cards.find().pretty()

## 11. Checklist rápida (lista de comprobación)

- [x] Conexión a MongoDB y arranque del server tras conectar.
- [x] Rutas users implementadas (GET/GET:id/POST/PATCH me/PATCH avatar).
- [x] Rutas cards implementadas (GET/POST/DELETE:id/PUT likes/DELETE likes).
- [x] Validación de ObjectId y de datos (Mongoose).
- [x] .orFail en lecturas por id para devolver 404.
- [x] Manejo global de errores 400/404/500.
- [x] Autorización temporal por req.user.\_id (hard-coded / header / TEST_USER_ID).
- [x] Pruebas con Postman/curl y verificación en Compass.

## 12. Solución de problemas comunes

- Postman devuelve HTML 404 “\_\_vscode_livepreview…”:
  - Otro proceso ocupa el puerto 3000 (Live Preview). Cierra la extensión o cambia PORT.
- curl en PowerShell:
  - Usa curl.exe o Invoke-RestMethod (curl está aliasado).
- 400 en POST /cards:
  - Verifica link (https://...) y que X-User-Id sea un ObjectId válido.
- 403 al borrar card:
  - El X-User-Id no coincide con owner.

## 13. Próximos pasos

- Sustituir autorización temporal por autenticación real (JWT/sesiones).
- Validación por esquema (Celebrate/Joi) en lugar de depender solo de Mongoose.
- Logs estructurados (pino/winston) y pruebas unitarias/integración.
- Despliegue (Render, Railway, Fly.io, etc.) y uso de variables de entorno seguras.
