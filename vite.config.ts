// eslint-disable-next-line import/no-unresolved
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})