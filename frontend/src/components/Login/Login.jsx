import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth.js";
import "./Login.css";

const EyeOpen = (
  <svg width="20" height="20" fill="#fff" viewBox="0 0 20 20">
    <path d="M10 4C5 4 1.73 8.11 1.73 10s3.27 6 8.27 6 8.27-4.11 8.27-6S15 4 10 4zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6a2 2 0 100 4 2 2 0 000-4z" />
  </svg>
);

export default function Login({ onResult, onSubmit }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirigir si ya hay sesión
  useEffect(() => {
    if (isAuthenticated()) navigate("/", { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await onSubmit({ email, password });
      const success = res.success ?? false;
      const message =
        res.message ?? (success ? "Login exitoso" : "Credenciales incorrectas");
      onResult?.(success, message);
      if (success) navigate("/", { replace: true });
    } catch (err) {
      onResult?.(false, err.message || "No se pudo iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="login">
      <div className="login__card">
      <div className="login__panel">
        <div className="login__icon" />
        <p className="login__panel-tagline">
          Comparte momentos,<br />descubre lugares.
        </p>
        <p className="login__panel-sub">Around The U.S. — Tu red de fotografía</p>
      </div>

      <div className="login__form-panel">
        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <h2 className="login__title">Bienvenido de vuelta</h2>
          <p className="login__subtitle">Ingresa tus datos para continuar</p>

          <div className="login__field">
            <label className="login__label" htmlFor="login-email">
              Correo electrónico
            </label>
            <input
              id="login-email"
              type="email"
              className="login__input"
              placeholder="email@dominio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login__field">
            <label className="login__label" htmlFor="login-pass">
              Contraseña
            </label>
            <input
              id="login-pass"
              type={showPassword ? "text" : "password"}
              className="login__input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ paddingRight: "40px" }}
            />
            <button
              type="button"
              tabIndex={-1}
              className="login__toggle-password"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? EyeOpen : <span style={{ opacity: 0.4 }}>{EyeOpen}</span>}
            </button>
          </div>

          <button className="login__submit" type="submit" disabled={submitting}>
            {submitting ? "Entrando..." : "Iniciar sesión"}
          </button>
          <p className="login__hint">
            ¿Aún no eres miembro? <Link to="/signup">Regístrate aquí</Link>
          </p>
        </form>
      </div>
      </div>
    </section>
  );
}
