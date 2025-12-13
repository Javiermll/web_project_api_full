const mongoose = require("mongoose");
const Card = require("../models/card");
const { BadRequestError, NotFoundError, ForbiddenError } = require("../errors/httpErrors");

async function getCards(req, res, next) {
  try {
    // Solo devuelve las tarjetas del usuario autenticado
    const cards = await Card.find({ owner: req.user._id }).populate('owner').populate('likes');
    return res.json(cards);
  } catch (err) {
    return next(err);
  }
}

async function createCard(req, res, next) {
  const { name, link } = req.body;
  const ownerId = req.user && req.user._id;
  if (!ownerId || !mongoose.isValidObjectId(ownerId)) {
    return next(new BadRequestError("Owner ID inválido o no proporcionado"));
  }
  try {
    const card = await Card.create({ name, link, owner: ownerId });
    const populated = await Card.findById(card._id).populate('owner');
    return res.status(201).json(populated);
  } catch (err) {
    if (err.name === "ValidationError") return next(new BadRequestError("Datos inválidos"));
    return next(err);
  }
}

async function deleteCard(req, res, next) {
  const { cardId } = req.params;
  if (!mongoose.isValidObjectId(cardId)) return next(new BadRequestError("cardId inválido"));
  try {
    const card = await Card.findById(cardId).orFail(() => new NotFoundError("Tarjeta no encontrada"));
    const requesterId = req.user && req.user._id;
    if (!requesterId) return next(new BadRequestError("Usuario no disponible en la solicitud"));
    if (String(card.owner) !== String(requesterId)) {
      return next(new ForbiddenError("Solo el propietario puede eliminar la tarjeta"));
    }
    const deleted = await Card.findByIdAndDelete(cardId);
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
}

async function likeCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user && req.user._id;

  if (!mongoose.isValidObjectId(cardId) || !mongoose.isValidObjectId(userId)) {
    return next(new BadRequestError("IDs inválidos"));
  }

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } }, // agrega si no existe
      { new: true }
    ).orFail(() => new NotFoundError("Tarjeta no encontrada"));

    return res.json(card);
  } catch (err) {
    return next(err);
  }
}

async function dislikeCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user && req.user._id;

  if (!mongoose.isValidObjectId(cardId) || !mongoose.isValidObjectId(userId)) {
    return next(new BadRequestError("IDs inválidos"));
  }

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } }, // elimina si existe
      { new: true }
    ).orFail(() => new NotFoundError("Tarjeta no encontrada"));

    return res.json(card);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};