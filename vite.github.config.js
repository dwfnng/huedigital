import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình đặc biệt cho GitHub Pages
export default defineConfig({
  base: '/huedigital/', // Thay 'huedigital' bằng tên repository GitHub của bạn
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "docs"), // Sử dụng 'docs' để GitHub Pages có thể tự động nhận diện
    emptyOutDir: true,
  },
});