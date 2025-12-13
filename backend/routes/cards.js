const express = require("express");
const { celebrate, Joi, Segments } = require("celebrate");
const { validateURL } = require("../utils/validator");
const router = express.Router();

const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require("../controllers/cards");

router.get("/", getCards);
router.post(
	"/",
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			name: Joi.string().required(),
			link: Joi.string().required().custom(validateURL),
		}),
	}),
	createCard
);
router.delete(
	"/:cardId",
	celebrate({
		[Segments.PARAMS]: Joi.object().keys({
			cardId: Joi.string().hex().length(24),
		}),
	}),
	deleteCard
);

router.put(
	"/:cardId/likes",
	celebrate({
		[Segments.PARAMS]: Joi.object().keys({
			cardId: Joi.string().hex().length(24),
		}),
	}),
	likeCard
);
router.delete(
	"/:cardId/likes",
	celebrate({
		[Segments.PARAMS]: Joi.object().keys({
			cardId: Joi.string().hex().length(24),
		}),
	}),
	dislikeCard
);

module.exports = router;
