// src/utils/Api.js
export default class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // Método para manejar la respuesta del servidor
  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  _getHeaders(extra = {}) {
    return {
      ...this._headers,
      ...extra,
    };
  }

  // Obtener información del usuario
  getUserInfo(headers = {}) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._getHeaders(headers),
    }).then(this._handleResponse);
  }

  // Actualizar información del usuario
  updateUserInfo({ name, about }, headers = {}) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._getHeaders(headers),
      body: JSON.stringify({ name, about }),
    }).then(this._handleResponse);
  }

  // Actualizar avatar del usuario
  updateAvatar({ avatar }, headers = {}) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._getHeaders(headers),
      body: JSON.stringify({ avatar }),
    }).then(this._handleResponse);
  }

  // Obtener tarjetas iniciales
  getInitialCards(headers = {}) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._getHeaders(headers),
    }).then(this._handleResponse);
  }

  // Crear nueva tarjeta
  addCard(data, headers = {}) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._getHeaders(headers),
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then(this._handleResponse);
  }

  // Eliminar tarjeta
  deleteCard(cardId, headers = {}) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._getHeaders(headers),
    }).then(this._handleResponse);
  }

  // Cambiar el estado de like de una tarjeta
  changeLikeCardStatus(cardId, isLiked, headers = {}) {
    const method = isLiked ? "DELETE" : "PUT";
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: method,
      headers: this._getHeaders(headers),
    }).then(this._handleResponse);
  }

  // Dar like a una tarjeta
  likeCard(cardId, headers = {}) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._getHeaders(headers),
    }).then(this._handleResponse);
  }

  // Quitar like a una tarjeta
  unlikeCard(cardId, headers = {}) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._getHeaders(headers),
    }).then(this._handleResponse);
  }
}
