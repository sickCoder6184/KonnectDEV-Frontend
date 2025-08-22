import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import daisyui from "daisyui";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), daisyui],
  daisyui: {
    themes: ["light", "dark", "cupcake", "synthwave"], // add/remove as needed
  },
});
