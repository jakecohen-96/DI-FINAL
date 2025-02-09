import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,
    port: 5173, 
  },
  preview: {
    allowedHosts: ["chat-app-frontend-p209.onrender.com"],
  },
});  