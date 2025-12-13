// Card.jsx
import React from "react";
import "../Card/Card.css";
import unionIcon from "../../assets/images/Union.png";
import heartIcon from "../../assets/images/Vector2_corazon.svg";
import api from "../../utils/apiInstance";

export default function Card({
  card,
  onCardLike,
  onOpenImagePopup,
  onDelete,
  isLiked,
  trashIcon,
}) {
  const { name, link, _id } = card;

  const handleImageClick = () => link && onOpenImagePopup(card);

  const handleLike = () => {
    onCardLike(card);
  };

  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? "card__like-button_is-active" : ""
  }`;

  return (
    <li className="card">
      {link ? (
        <img
          className="card__image"
          src={link ? link : "/default-image.jpg"}
          alt={name || "Imagen"}
          onClick={handleImageClick}
        />
      ) : null}
      <button
        aria-label="Delete card"
        className="card__delete-button"
        type="button"
        onClick={() => onDelete(card)}
      >
        <img
          src={trashIcon}
          alt="Eliminar tarjeta"
          className="card__delete-icon"
        />
      </button>
      <div className="card__description">
        <h2 className="card__title">{name}</h2>
        <button
          aria-label="Like card"
          className={cardLikeButtonClassName}
          type="button"
          onClick={handleLike}
        >
          <img
            src={isLiked ? unionIcon : heartIcon}
            alt="Me gusta"
            className="card__like-icon"
          />
        </button>
      </div>
    </li>
  );
}
