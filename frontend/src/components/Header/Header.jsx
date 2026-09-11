// src/components/Header/Header.jsx
import React, { useState } from "react";
import { isAuthenticated } from "../../utils/auth.js";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher.jsx";
import "./Header.css";
import logo from "../../assets/images/Logo.png";

function Header({ email, onSignOut, theme, onThemeChange }) {
  const loggedIn = isAuthenticated();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((o) => !o);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`header ${menuOpen ? "header_mobile-open" : ""}`}>
      <div className="header__container">
        <img src={logo} alt="Logo Around The U.S." className="header__logo" />

        {loggedIn && (
          <>
            <nav className="header__nav header__nav--desktop">
              {email && <span className="header__email">{email}</span>}
              <button type="button" className="header__logout header__link" onClick={onSignOut}>
                Cerrar sesión
              </button>
              <ThemeSwitcher theme={theme} onThemeChange={onThemeChange} />
            </nav>
            <button
              type="button"
              className="header__burger"
              aria-label="Abrir menú"
              onClick={toggleMenu}
            >
              <span />
              <span />
              <span />
            </button>
          </>
        )}
      </div>

      {/* Panel móvil desplegable */}
      {menuOpen && loggedIn && (
        <div className="header__mobile-panel">
          <div className="header__mobile-top">
            <img src={logo} alt="Logo Around The U.S." className="header__logo" />
            <button
              type="button"
              className="header__close"
              aria-label="Cerrar menú"
              onClick={toggleMenu}
            >
              ×
            </button>
          </div>
          <div className="header__mobile-items">
            {email && <div className="header__email">{email}</div>}
            <button
              type="button"
              onClick={() => { onSignOut(); closeMenu(); }}
              className="header__logout header__link"
            >
              Cerrar sesión
            </button>
            <ThemeSwitcher theme={theme} onThemeChange={onThemeChange} />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
