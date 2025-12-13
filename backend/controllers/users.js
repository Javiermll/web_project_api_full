const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../errors/httpErrors");

// Obtener todos los usuarios
async function getUsers(req, res, next) {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (err) {
    return next(err);
  }
}

async function getUserById(req, res, next) {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    return next(new BadRequestError("ID de usuario inválido"));
  }
  try {
    const user = await User.findById(userId).orFail(
      () => new NotFoundError("Usuario no encontrado")
    );
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

async function createUser(req, res, next) {
  const { name, about, avatar, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "El correo electrónico ya está en uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "Registro exitoso",
      data: userResponse,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Datos inválidos para crear el usuario"));
    }
    return next(err);
  }
}

async function updateProfile(req, res, next) {
  const userId = req.user && req.user._id;
  const { name, about } = req.body;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    return next(new BadRequestError("ID de usuario inválido"));
  }

  // Solo permitir que el usuario edite su propio perfil
  if (userId !== req.user._id) {
    return next(
      new ForbiddenError("No puedes editar el perfil de otro usuario")
    );
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    ).orFail(() => new NotFoundError("Usuario no encontrado"));

    return res.json(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(
        new BadRequestError("Datos inválidos para actualizar el perfil")
      );
    }
    return next(err);
  }
}

async function updateAvatar(req, res, next) {
  const userId = req.user && req.user._id;
  const { avatar } = req.body;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    return next(new BadRequestError("ID de usuario inválido"));
  }

  // Solo permitir que el usuario edite su propio avatar
  if (userId !== req.user._id) {
    return next(
      new ForbiddenError("No puedes editar el avatar de otro usuario")
    );
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    ).orFail(() => new NotFoundError("Usuario no encontrado"));

    return res.json(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("URL de avatar inválida"));
    }
    return next(err);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    // Buscar el usuario por correo electrónico e incluir la contraseña
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Comparar la contraseña proporcionada con la almacenada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    //Crear el token JWT
    const token = jwt.sign({ _id: user._id }, "CLAVE_SECRETA_DE_EJEMPLO", {
      expiresIn: "7d",
    });

    return res.json({ token });
  } catch (err) {
    return next(err);
  }
}

async function getCurrentUser(req, res, next) {
  const userId = req.user && req.user._id;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    return next(new BadRequestError("ID de usuario inválido"));
  }

  try {
    const user = await User.findById(userId).orFail(
      () => new NotFoundError("Usuario no encontrado")
    );
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getCurrentUser,
};
