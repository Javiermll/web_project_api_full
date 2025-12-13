// src/components/Main/components/DeleteCard/DeleteCard.jsx
import React, { useState } from "react";
import api from "../../utils/apiInstance";
import "../Popup/Popup.css";
import closeIcon from "../../assets/images/Close_Icon.png";

export default function RemoveCard({ onClose, cardId, onCardRemoved, onConfirmDelete }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cardId) return;
    console.log("Submit del popup de borrado para tarjeta:", cardId);
    setIsLoading(true);
    let removed = false;
    try {
      await onConfirmDelete(cardId);
      removed = true;
    } catch (err) {
      if (err.message && err.message.includes("404")) {
        removed = true;
      }
    } finally {
      if (removed && onCardRemoved) {
        onCardRemoved();
      }
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <div>
      <form
        className="popup__form popup__form-delete"
        noValidate
        onSubmit={handleSubmit}
      >
        <button
          type="submit"
          className="popup__button popup__button_confirm"
          disabled={isLoading}
        >
          {isLoading ? "Eliminando..." : "Sí"}
        </button>
      </form>
      <button
        className="popup__close-button popup__close-buttonDelete"
        onClick={onClose}
      >
        <img src={closeIcon} alt="Cerrar" className="popup__close-image" />
      </button>
    </div>
  );
}
