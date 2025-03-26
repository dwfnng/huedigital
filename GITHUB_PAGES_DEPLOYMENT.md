# Hướng dẫn triển khai lên GitHub Pages

## Bước 1: Tạo file `vite.config.ts` mới cho GitHub Pages

Sau khi tải dự án xuống máy tính của bạn, hãy sửa file `vite.config.ts` như sau:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: '/huedigital/', // Thay 'huedigital' bằng tên repository GitHub của bạn
  plugins: [
    react(),
    themePlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"), // hoặc 'docs' nếu bạn muốn deploy từ thư mục docs/
    emptyOutDir: true,
  },
});
```

## Bước 2: Cập nhật index.html

Sửa file `client/index.html` để sử dụng đường dẫn tương đối:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="theme-color" content="#1e40af" />
    <meta name="description" content="Khám phá di sản văn hóa Huế qua công nghệ tương tác" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Hue Guide" />
    <link rel="manifest" href="./manifest.json" />
    <link rel="icon" type="image/png" href="./huedigital/icon-192.png" />
    <link rel="apple-touch-icon" href="./huedigital/icon-192.png" />
    <title>Hue Digital Tour Guide</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./src/main.tsx"></script>
  </body>
</html>
```

## Bước 3: Build và triển khai

1. Chạy lệnh build:
```bash
npm run build
```

2. Kiểm tra thư mục `dist` (hoặc `docs` tùy vào cấu hình) và đảm bảo nó chứa các file đã được build.

3. Mở file `dist/index.html` và kiểm tra đường dẫn script. Nó có thể giống như:
```html
<script type="module" src="/huedigital/assets/main-a1b2c3d4.js"></script>
```

4. Commit và push lên GitHub:
```bash
git add .
git commit -m "Build for GitHub Pages"
git push origin main
```

5. Cài đặt GitHub Pages:
   - Truy cập repository của bạn trên GitHub
   - Vào Settings > Pages
   - Trong mục "Source", chọn branch "main" và folder là "/docs" hoặc "/root" (tùy theo cấu hình build)
   - Lưu lại

6. Đợi vài phút để GitHub Pages triển khai trang web của bạn.

## Lưu ý quan trọng

- Đảm bảo thay `huedigital` bằng tên repository GitHub của bạn trong tất cả các file.
- Nếu bạn sử dụng thư mục khác để deploy (không phải là `dist`), hãy điều chỉnh cấu hình build trong `vite.config.ts`.
- GitHub Pages có thể mất vài phút để triển khai các thay đổi.