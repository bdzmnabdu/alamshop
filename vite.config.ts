import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
// import path from "path";
import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  server: {
    port: 3845,
    proxy: {
      "/txn": "https://alams.gcgoptima.id",
    },
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // "@": path.resolve(__dirname, "src"),
    },
  },
});
