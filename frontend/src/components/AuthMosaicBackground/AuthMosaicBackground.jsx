import paisajeValle from "../../assets/images/paisaje1.jpg";
import paisajeLago from "../../assets/images/paisaje2.png";
import paisajeAtardecer from "../../assets/images/paisaje3.png";
import paisajeEstrellas from "../../assets/images/paisaje4.png";
import paisajeDusk from "../../assets/images/paisaje5.png";
import paisajeBotes from "../../assets/images/paisaje6.png";
import "./AuthMosaicBackground.css";

// Cuatro columnas, cada una con las mismas 6 fotos en un orden distinto,
// para que el mosaico no se sienta repetitivo entre columnas vecinas.
const COLUMNS = [
  [paisajeValle, paisajeAtardecer, paisajeBotes, paisajeLago, paisajeEstrellas, paisajeDusk],
  [paisajeLago, paisajeEstrellas, paisajeValle, paisajeDusk, paisajeBotes, paisajeAtardecer],
  [paisajeBotes, paisajeDusk, paisajeAtardecer, paisajeEstrellas, paisajeValle, paisajeLago],
  [paisajeEstrellas, paisajeValle, paisajeDusk, paisajeBotes, paisajeLago, paisajeAtardecer],
];

// Fondo fijo y persistente detrás de Landing/Login/Register: como vive en
// App.jsx (no en cada página), nunca se desmonta al navegar entre esas
// rutas, así el mosaico sigue moviéndose sin cortes durante la transición.
export default function AuthMosaicBackground() {
  return (
    <div className="auth-mosaic">
      <div className="auth-mosaic__grid" aria-hidden="true">
        {COLUMNS.map((col, i) => (
          <div
            key={i}
            className={
              "auth-mosaic__column" +
              (i % 2 === 1 ? " auth-mosaic__column--reverse" : "")
            }
          >
            {[...col, ...col].map((src, j) => (
              <img key={j} src={src} alt="" className="auth-mosaic__tile" />
            ))}
          </div>
        ))}
      </div>
      <div className="auth-mosaic__overlay" />
    </div>
  );
}
