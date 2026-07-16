import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "/Lehrer-Kompass/",
  plugins: [react()],
  server: { port: 4173 },
  preview: { port: 4173 },
  build: { outDir: "dist", emptyOutDir: true }
});
