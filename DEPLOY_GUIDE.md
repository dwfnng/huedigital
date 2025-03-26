# Hướng dẫn chi tiết triển khai lên GitHub Pages

## 1. Chuẩn bị dự án cho GitHub Pages

Để triển khai lên GitHub Pages, bạn cần thực hiện các bước sau trên máy tính của mình sau khi tải dự án từ Replit:

### Cài đặt Node.js và npm

Đảm bảo bạn đã cài đặt Node.js và npm. Tải về từ [nodejs.org](https://nodejs.org/).

### Cài đặt các dependencies

```bash
npm install
```

## 2. Thay đổi cấu hình cho GitHub Pages

### Sửa Vite Config

Tạo một file mới có tên `vite.github.config.js` (hoặc chỉnh sửa `vite.config.ts` nếu bạn không làm việc trên Replit):

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

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
```

### Thêm script build cho GitHub Pages

Thêm dòng sau vào file `package.json` trong phần "scripts":

```json
"build:github": "vite build --config vite.github.config.js"
```

## 3. Build dự án

Chạy lệnh build đặc biệt cho GitHub Pages:

```bash
npm run build:github
```

Kiểm tra xem thư mục `docs` đã được tạo với các file đã build chưa.

## 4. Cập nhật các file cần thiết

### a. Sửa file index.html

Sao chép file `github-pages-index.html` vào thư mục `docs` và đổi tên thành `index.html`, thay thế file index.html đã được tạo:

```bash
cp github-pages-index.html docs/index.html
```

Lưu ý: Nếu tên tệp JS đã được build có dạng "main-[hash].js", hãy điều chỉnh đường dẫn trong file index.html cho phù hợp.

### b. Sao chép manifest.json

Sao chép file `manifest.github.json` vào thư mục `docs` và đổi tên thành `manifest.json`:

```bash
cp manifest.github.json docs/manifest.json
```

## 5. Tạo file `.nojekyll`

GitHub Pages mặc định sử dụng Jekyll để xử lý trang web, điều này có thể gây ra vấn đề với các file bắt đầu bằng dấu gạch dưới (`_`). Để tránh điều này, hãy tạo một file trống có tên `.nojekyll` trong thư mục `docs`:

```bash
touch docs/.nojekyll
```

## 6. Đẩy lên GitHub

```bash
git add docs .nojekyll
git commit -m "Build for GitHub Pages"
git push origin main
```

## 7. Cấu hình GitHub Pages

1. Truy cập repository GitHub của bạn
2. Chọn tab "Settings"
3. Cuộn xuống phần "GitHub Pages"
4. Trong mục "Source", chọn branch "main" và thư mục "/docs"
5. Lưu lại

## 8. Kiểm tra trang web

Sau khi GitHub hoàn tất việc triển khai (có thể mất vài phút), bạn có thể truy cập trang web của mình tại:

```
https://[username].github.io/huedigital/
```

Thay `[username]` bằng tên người dùng GitHub của bạn và `huedigital` bằng tên repository của bạn.

## Xử lý sự cố

### Vấn đề với đường dẫn

Nếu bạn gặp lỗi 404 hoặc lỗi MIME type, hãy kiểm tra:

1. Đường dẫn trong file index.html phải bắt đầu bằng `/huedigital/`
2. Kiểm tra tên file JS được tạo ra trong thư mục `docs/assets` và đảm bảo đường dẫn trong index.html trỏ đúng đến file này
3. Đảm bảo cài đặt `base` trong vite config phải khớp với tên repository của bạn

### Trang trắng không có lỗi

Mở console của trình duyệt (F12) để kiểm tra lỗi. Thông thường, vấn đề là do đường dẫn không chính xác.