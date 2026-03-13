require("dotenv").config();
const helmet = require("helmet");
const express = require("express");
const bodyParser = require("body-parser");
const cardsRoutes = require("./routes/cards");
const usersRoutes = require("./routes/users");
const mongoose = require("mongoose");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const cors = require("cors");
const { errors: celebrateErrors } = require("celebrate");
const { requestLogger, errorLogger } = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(helmet());
app.use(bodyParser.json());

// Configuración CORS específica para el frontend
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  })
);

// Opcional: permite preflight para cualquier ruta
app.options(
  "*",
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  })
);

// Middleware para registrar cada request
app.use(requestLogger);

console.log("Definiendo rutas /signin y /signup");
app.post("/signin", login);
app.post("/signup", createUser);

app.use("/users", auth, usersRoutes);
app.use("/cards", auth, cardsRoutes);

app.use((req, res, next) => {
  const err = new Error("Recurso solicitado no se pudo encontrar");
  err.statusCode = 404;
  next(err);
});

// Middleware de errores de celebrate (debe ir antes del global)
app.use(celebrateErrors());

// Middleware para registrar errores
app.use(errorLogger);

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error(err); // útil para depuración en desarrollo

  if (res.headersSent) {
    return next(err);
  }

  // Prioriza statusCode si el error personalizado lo trae
  const status =
    err.statusCode ||
    (err.name === "ValidationError" || err.name === "CastError"
      ? 400
      : err.name === "DocumentNotFoundError"
      ? 404
      : 500);

  const message =
    status === 500 ? "Error interno del servidor" : err.message || "Error";

  res.status(status).json({ message });
});

app.get("/prueba", (req, res) => {
  res.json({ mensaje: "Ruta de prueba OK" });
});

// Conectar a MongoDB y luego arrancar el servidor
async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Conectado a MongoDB: ${process.env.MONGODB_URI}`);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar a MongoDB", error);
    process.exit(1);
  }
}

start();
