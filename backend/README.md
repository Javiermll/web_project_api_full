# Backend — Around The U.S. API

API REST construida con Node.js y Express que gestiona usuarios y tarjetas fotográficas con autenticación JWT completa.

**API en producción:** https://around-backend-l7gc.onrender.com

> El backend corre en el plan gratuito de Render. Si lleva un tiempo sin recibir peticiones, el servidor "duerme". La primera petición puede tardar ~30 segundos mientras arranca.

---

## Qué hace este backend

Expone una serie de endpoints HTTP que el frontend consume. Cada endpoint:

1. Recibe una petición (registro, login, crear tarjeta, etc.)
2. Valida que los datos enviados tengan el formato correcto (Celebrate/Joi)
3. Comprueba que el usuario esté autenticado (middleware JWT), excepto en `/signin` y `/signup`
4. Ejecuta la lógica de negocio (controlador) y consulta/modifica MongoDB
5. Devuelve una respuesta JSON

---

## Stack tecnológico

| Paquete | Versión | Para qué sirve |
|---------|---------|----------------|
| express | 4.18.2 | Framework HTTP — define rutas y middlewares |
| mongoose | 8.19.2 | ODM para MongoDB — define esquemas y hace queries |
| jsonwebtoken | 9.0.3 | Firma y verifica tokens JWT |
| bcryptjs | — | Hashea contraseñas antes de guardarlas |
| celebrate + joi | 15.0.3 | Valida el cuerpo/params de cada petición antes de llegar al controlador |
| helmet | — | Añade cabeceras HTTP de seguridad automáticamente |
| cors | — | Permite peticiones desde el frontend (dominio distinto) |
| dotenv | — | Carga variables de entorno desde el archivo `.env` |
| nodemon | — | Reinicia el servidor automáticamente al guardar cambios (solo en desarrollo) |

---

## Estructura del proyecto

```
backend/
├── app.js                  # Punto de entrada: conecta a MongoDB y arranca Express
├── controllers/
│   ├── users.js            # Lógica de usuarios: registro, login, perfil, avatar
│   └── cards.js            # Lógica de tarjetas: crear, listar, borrar, likes
├── routes/
│   ├── users.js            # Define las URLs de usuario y qué controlador llama cada una
│   └── cards.js            # Define las URLs de tarjetas
├── models/
│   ├── user.js             # Esquema Mongoose del usuario (campos, validaciones, tipos)
│   └── card.js             # Esquema Mongoose de la tarjeta
├── middlewares/
│   └── auth.js             # Verifica el token JWT en cada petición protegida
├── errors/
│   └── httpErrors.js       # Clases de error con código HTTP: BadRequestError, NotFoundError, ForbiddenError
└── utils/
    ├── logger.js           # Configuración de winston: graba logs en request.log y error.log
    └── validator.js        # Función reutilizable para validar URLs con Celebrate
```

---

## Cómo arranca la aplicación (`app.js`)

El orden de los middlewares en Express importa. Este es el flujo exacto que sigue cada petición:

```
Petición entrante
      │
      ▼
helmet()          → añade cabeceras de seguridad HTTP (X-Frame-Options, etc.)
bodyParser.json() → parsea el body de la petición como JSON
cors()            → comprueba que el origen sea ALLOWED_ORIGIN; responde preflight OPTIONS
requestLogger     → graba la petición en request.log (método, URL, fecha)
      │
      ├─ POST /signin  → login()     (sin auth)
      ├─ POST /signup  → createUser() (sin auth)
      │
      ├─ /users  → auth middleware → rutas de usuarios
      └─ /cards  → auth middleware → rutas de tarjetas
      │
      ▼
404 handler       → si ninguna ruta coincidió
celebrateErrors() → convierte errores de validación de Celebrate en respuestas 400
errorLogger       → graba errores en error.log
globalErrorHandler→ decide el status code y devuelve { message }
```

La función `start()` primero conecta a MongoDB con `mongoose.connect()` y **solo entonces** arranca `app.listen()`. Si la base de datos falla, el proceso termina con `process.exit(1)`.

---

## Modelos de datos (MongoDB)

### User (`models/user.js`)

```
Campo    Tipo     Requerido  Notas
─────────────────────────────────────────────────────────────
name     String   No         Mín 2, máx 30 chars. Default: "Jacques Cousteau"
about    String   No         Mín 2, máx 30 chars. Default: "Explorer"
avatar   String   No         Debe ser URL válida (regex). Default: imagen S3
email    String   Sí         Único, validado con la librería `validator`
password String   Sí         Mín 6 chars. select:false → nunca se devuelve en queries
```

`select: false` en `password` significa que cualquier `User.find()` o `User.findById()` **nunca incluirá la contraseña** en el resultado, a menos que se llame explícitamente con `.select("+password")` (como en login).

### Card (`models/card.js`)

```
Campo      Tipo        Requerido  Notas
──────────────────────────────────────────────────────────────
name       String      Sí         Mín 2, máx 30 chars
link       String      Sí         Debe ser URL válida (regex)
owner      ObjectId    Sí         Referencia al _id del usuario que la creó
likes      [ObjectId]  No         Array de referencias a usuarios. Default: []
createdAt  Date        No         Default: Date.now en el momento de creación
```

Los `ObjectId` son los identificadores únicos de MongoDB (24 caracteres hexadecimales). `ref: "user"` permite hacer `.populate()` para obtener el documento completo del usuario en lugar del ID.

---

## Autenticación JWT

### ¿Qué es un JWT?

Un JSON Web Token es una cadena codificada en Base64 con tres partes: `header.payload.signature`. El servidor firma el payload con `JWT_SECRET`, y cualquier modificación rompe la firma, haciendo el token inválido.

### Flujo completo

**1. Registro (`POST /signup`):**
```
Cliente envía { email, password }
      │
      ▼
bcrypt.hash(password, 10)  → genera hash irreversible (10 rondas de salt)
User.create({ email, hashedPassword, ... })
Respuesta: 201 { success: true, data: { ...usuario sin password } }
```

**2. Login (`POST /signin`):**
```
Cliente envía { email, password }
      │
      ▼
User.findOne({ email }).select("+password")  → incluye password explícitamente
bcrypt.compare(password, user.password)      → compara texto plano con hash
jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" })
Respuesta: 200 { token: "eyJ..." }
```

**3. Petición protegida:**
```
Cliente envía Header: Authorization: Bearer eyJ...
      │
      ▼
middlewares/auth.js:
  - Extrae el token del header
  - jwt.verify(token, JWT_SECRET)  → si es válido, decodifica el payload
  - Inyecta req.user = { _id: "..." }
  - Si falla → 403 "No autorizado"
      │
      ▼
Controlador tiene acceso a req.user._id
```

---

## Validación con Celebrate/Joi

Celebrate es un middleware que envuelve Joi (librería de validación de esquemas) para Express. Se define directamente en la ruta, **antes** del controlador.

Ejemplo de `routes/cards.js`:
```js
router.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      link: Joi.string().required().custom(validateURL),
    }),
  }),
  createCard  // solo se ejecuta si la validación pasa
);
```

Si el body no cumple el esquema, Celebrate lanza un error que el middleware `celebrateErrors()` captura y convierte en un 400 con detalles del campo inválido. El controlador nunca llega a ejecutarse.

Los params de URL también se validan (ej: que `cardId` sea un hex de 24 caracteres antes de hacer la query a MongoDB).

---

## Endpoints

### Públicos (sin token)

| Método | Ruta | Body | Respuesta |
|--------|------|------|-----------|
| POST | `/signup` | `{ email, password, name?, about?, avatar? }` | `201 { success, data: { usuario } }` |
| POST | `/signin` | `{ email, password }` | `200 { token }` |

### Protegidos (requieren `Authorization: Bearer <token>`)

**Usuarios**

| Método | Ruta | Body | Respuesta |
|--------|------|------|-----------|
| GET | `/users/me` | — | `200 { usuario actual }` |
| GET | `/users` | — | `200 [ lista de usuarios ]` |
| GET | `/users/:userId` | — | `200 { usuario }` o `404` |
| PATCH | `/users/me` | `{ name, about }` | `200 { usuario actualizado }` |
| PATCH | `/users/me/avatar` | `{ avatar }` | `200 { usuario actualizado }` |

**Tarjetas**

| Método | Ruta | Body | Respuesta |
|--------|------|------|-----------|
| GET | `/cards` | — | `200 [ lista de tarjetas ]` |
| POST | `/cards` | `{ name, link }` | `201 { tarjeta creada }` |
| DELETE | `/cards/:cardId` | — | `200` o `403` si no es el dueño |
| PUT | `/cards/:cardId/likes` | — | `200 { tarjeta con like añadido }` |
| DELETE | `/cards/:cardId/likes` | — | `200 { tarjeta con like quitado }` |

La lógica de likes usa operadores de MongoDB directamente:
- Like: `$addToSet` — añade el `_id` al array sin duplicados
- Unlike: `$pull` — elimina el `_id` del array

---

## Manejo centralizado de errores

`errors/httpErrors.js` define clases con un `statusCode` propio:

```js
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
```

El middleware global de `app.js` lee `err.statusCode` si existe, o mapea tipos de error de Mongoose:
- `ValidationError` / `CastError` → 400
- `DocumentNotFoundError` → 404
- Cualquier otro → 500 con mensaje genérico (para no filtrar detalles internos)

---

## Logging

`utils/logger.js` usa **winston** con formato JSON. Se generan dos archivos de log:

- `request.log` — cada petición HTTP (método, URL, status, IP, fecha)
- `error.log` — solo errores (stack trace, mensaje, ruta)

En producción esto permite auditar el tráfico y diagnosticar problemas sin necesidad de `console.log`.

---

## Variables de entorno

Crear `backend/.env` para desarrollo local (no commitear):

```env
MONGODB_URI=mongodb://localhost:27017/aroundb
JWT_SECRET=cualquier_cadena_larga_y_aleatoria
PORT=3000
ALLOWED_ORIGIN=http://localhost:5173
NODE_ENV=development
```

En Render (producción) estas variables se configuran en el dashboard y nunca tocan el código fuente.

---

## Instalación y ejecución local

```bash
cd backend
npm install
# Crear el archivo .env con las variables de arriba
npm run dev     # Inicia con nodemon (recarga al guardar) → http://localhost:3000
npm start       # Inicia sin hot reload (para producción)
npm run lint    # Ejecuta ESLint con reglas Airbnb
```

---

## Probar los endpoints con curl

```bash
# Registrar usuario
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Login (guarda el token que devuelve)
curl -X POST http://localhost:3000/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Petición protegida (sustituye TOKEN por el valor recibido en login)
curl http://localhost:3000/users/me \
  -H "Authorization: Bearer TOKEN"

# Crear tarjeta
curl -X POST http://localhost:3000/cards \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Mi lugar","link":"https://example.com/foto.jpg"}'
```
