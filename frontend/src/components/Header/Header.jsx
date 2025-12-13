// src/components/Header/Header.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth.js";
import "./Header.css";
import logo from "../../assets/images/Logo.png";

function Header({ email, onSignOut }) {
  const loggedIn = isAuthenticated();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";

  const toggleMenu = () => setMenuOpen((o) => !o);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`header ${menuOpen ? "header_mobile-open" : ""}`}>
      <div className="header__container">
        <img src={logo} alt="Logo Around The U.S." className="header__logo" />

        {loggedIn ? (
          <>
            {/* Desktop: email + logout visibles */}
            <nav className="header__nav header__nav--desktop">
              {email && <span className="header__email">{email}</span>}
              <button type="button" className="header__logout header__link" onClick={onSignOut}>
                Cerrar sesión
              </button>
            </nav>

            {/* Mobile: botón hamburguesa */}
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
        ) : (
          <nav className="header__nav">
            {isAuthPage ? (
              location.pathname === "/signin" ? (
                <Link to="/signup" className="header__link">Regístrate</Link>
              ) : (
                <Link to="/signin" className="header__link">Iniciar sesión</Link>
              )
            ) : (
              <>
                <Link to="/signup" className="header__link">Regístrate</Link>
                <Link to="/signin" className="header__link">Iniciar sesión</Link>
              </>
            )}
          </nav>
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
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
