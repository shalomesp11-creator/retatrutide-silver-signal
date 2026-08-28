import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/retatrutide-silver-signal/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        checkout: "checkout.html",
      },
    },
  },
});
