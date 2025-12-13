import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.svg", "**/*.png", "**/*.jpg", "**/*.jpeg"],
  server: {
    port: 5173,
  },
});
