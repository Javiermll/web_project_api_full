// src/components/Main/components/ImagePopup/ImagePopup.jsx
import React from "react";
import "../Popup/Popup.css";
import "../ImagePopup/ImagePopup.css";
import closeIcon from "../../assets/images/Close_Icon.png";

export default function ImagePopup({ card, onClose }) {
  if (!card?.link) return null;

  return (
    <div className="popup popup_type_image" id="imagePopup">
      <div className="popup__container popup__container_type_image">
        <button
          className="popup__close-buttonImage"
          onClick={onClose}
          aria-label="Cerrar Imagen emergente"
        >
          <img src={closeIcon} alt="Boton de cerrar formulario" />
        </button>
        <figure className="popup__figure">
          <img src={card.link} alt={card.name} className="popup__image" />
          <figcaption className="popup__caption">{card.name}</figcaption>
        </figure>
        <button
          type="button"
          className="popup__close-button_type_image"
          onClick={onClose}
          aria-label="Cerrar imagen emergente"
        ></button>
      </div>
    </div>
  );
}
