import { useEffect, useState } from "react";

// Muestra `true` recién después de `delay` ms de que `active` sigue en
// true — así el aviso de "el servidor se está despertando" solo aparece
// si la espera realmente se está alargando (cold start de Render), no en
// cada request normal de unos cientos de ms.
export default function useSlowSubmitHint(active, delay = 3500) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!active) {
      setShow(false);
      return;
    }
    const id = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(id);
  }, [active, delay]);

  return show;
}
