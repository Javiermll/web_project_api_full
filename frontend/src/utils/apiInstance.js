import { getToken } from "./auth.js";

const base = import.meta.env.VITE_MAIN_API_BASE_URL;

if (!base) console.error("Falta VITE_MAIN_API_BASE_URL");

class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  _headers(extra = {}) {
    const jwt = getToken();
    return {
      "Content-Type": "application/json",
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      ...extra,
    };
  }

  async _request(path, options = {}) {
    const res = await fetch(`${this._baseUrl}${path}`, {
      headers: this._headers(options.headers),
      ...options,
    });
    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }
    if (!res.ok) throw new Error(data?.message || `API error ${res.status}`);
    return data;
  }

  getUserInfo() {
    return this._request("/users/me");
  }
  getInitialCards() {
    return this._request("/cards");
  }
  updateUserInfo(body) {
    return this._request("/users/me", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }
  updateAvatar(body) {
    return this._request("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }
  addCard(body) {
    return this._request("/cards", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
  changeLikeCardStatus(id, liked) {
    return this._request(`/cards/${id}/likes`, {
      method: liked ? "DELETE" : "PUT",
    });
  }
  deleteCard(id) {
    return this._request(`/cards/${id}`, { method: "DELETE" });
  }
}

export default new Api({ baseUrl: base });
