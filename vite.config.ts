import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
import vue from "@vitejs/plugin-vue";

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
    },
  },
  optimizeDeps: {
    exclude: ["oh-vue-icons/icons"],
  },
});
