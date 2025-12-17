import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, register } from "../../utils/auth.js"; // Importa la función correcta
import api from "../../utils/apiInstance";
import "./Register.css";

const EyeOpen = (
  <svg width="20" height="20" fill="#fff" viewBox="0 0 20 20">
    <path d="M10 4C5 4 1.73 8.11 1.73 10s3.27 6 8.27 6 8.27-4.11 8.27-6S15 4 10 4zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6a2 2 0 100 4 2 2 0 000-4z" />
  </svg>
);

export default function Register({ onResult }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) navigate("/", { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      // Llama a la API usando la instancia que gestiona el token
      const res = await register({ email, password });
      // Si el backend devuelve { data: {...} }, extrae el objeto interno
      const success = res.success ?? !!res.data;
      const message =
        res.message ??
        (success ? "Registro exitoso" : "No se pudo procesar el registro");
      onResult?.(success, message);
      if (success)
        setTimeout(() => navigate("/signin", { replace: true }), 1500);
    } catch (err) {
      onResult?.(false, err.message || "No se pudo procesar el registro");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="register">
      <h1 className="register__title">Regístrate</h1>
      <form onSubmit={handleSubmit} className="register__form" noValidate>
        <label className="register__field">
          <span className="register__label">Correo electrónico</span>
          <input
            name="email"
            type="email"
            className="register__input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="register__field" style={{ position: "relative" }}>
          <span className="register__label">Contraseña</span>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            className="register__input"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ paddingRight: "36px" }}
          />
          <button
            type="button"
            tabIndex={-1}
            className="register__toggle-password"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? EyeOpen : <span style={{ opacity: 0.4 }}>{EyeOpen}</span>}
          </button>
        </label>
        <button
          type="submit"
          className="register__submit"
          disabled={submitting}
        >
          {submitting ? "Registrando..." : "Regístrate"}
        </button>
      </form>
      <p className="register__hint">
        ¿Ya eres miembro? <Link to="/signin">Inicia sesión aquí</Link>
      </p>
    </main>
  );
}
