export function BeamsBackground() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
      background: `
        radial-gradient(ellipse 80% 60% at 20% 40%, hsla(210, 85%, 45%, 0.25) 0%, transparent 70%),
        radial-gradient(ellipse 60% 50% at 80% 70%, hsla(260, 80%, 50%, 0.2) 0%, transparent 65%),
        radial-gradient(ellipse 50% 40% at 55% 20%, hsla(190, 90%, 40%, 0.15) 0%, transparent 60%),
        #0a0a0f
      `,
    }} />
  );
}
