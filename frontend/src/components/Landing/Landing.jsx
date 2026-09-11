import { Link } from "react-router-dom";
import logo from "../../assets/images/Logo.png";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing__content">
        <img src={logo} alt="Around The U.S." className="landing__logo" />
        <p className="landing__kicker">Red social de viajeros</p>
        <h1 className="landing__title">
          Comparte momentos,
          <br />
          descubre lugares.
        </h1>
        <p className="landing__subtitle">
          Una red para guardar y compartir los rincones del mundo que valen
          la pena recordar.
        </p>
        <div className="landing__actions">
          <Link
            to="/signup"
            viewTransition
            className="landing__cta landing__cta--primary"
          >
            Crear cuenta
          </Link>
          <Link
            to="/signin"
            viewTransition
            className="landing__cta landing__cta--secondary"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
