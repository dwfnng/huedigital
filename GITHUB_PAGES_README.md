# Hướng dẫn nhanh triển khai lên GitHub Pages

## Các tệp đã chuẩn bị sẵn

1. `vite.github.config.js` - Cấu hình Vite cho GitHub Pages
2. `github-pages-index.html` - Tệp HTML tùy chỉnh cho GitHub Pages
3. `manifest.github.json` - Tệp manifest đã cấu hình cho GitHub Pages
4. `DEPLOY_GUIDE.md` - Hướng dẫn chi tiết về cách triển khai
5. `GITHUB_PAGES_DEPLOYMENT.md` - Hướng dẫn về cấu hình dự án

## Quy trình ngắn gọn

1. Tạo repository trên GitHub và đẩy code của bạn lên

2. Trên máy tính của bạn, thêm script build vào `package.json`:
   ```json
   "build:github": "vite build --config vite.github.config.js"
   ```

3. Build dự án cho GitHub Pages:
   ```bash
   npm run build:github
   ```

4. Sao chép `github-pages-index.html` vào thư mục `docs` và đổi tên thành `index.html`

5. Sao chép manifest cho GitHub Pages:
   ```bash
   cp manifest.github.json docs/manifest.json
   ```

6. Tạo file `.nojekyll` trong thư mục `docs`:
   ```bash
   touch docs/.nojekyll
   ```

7. Đẩy thư mục `docs` lên GitHub:
   ```bash
   git add docs .nojekyll
   git commit -m "Build for GitHub Pages"
   git push origin main
   ```

8. Cấu hình GitHub Pages:
   - Settings > Pages
   - Source: branch "main", folder "/docs"

9. Kiểm tra trang web của bạn tại:
   ```
   https://[username].github.io/huedigital/
   ```

## Lưu ý quan trọng

- Thay đổi `huedigital` thành tên repository GitHub của bạn trong tất cả các tệp
- Kiểm tra tệp JS được tạo ra trong thư mục `docs/assets` để đảm bảo đường dẫn trong `index.html` chính xác

## Cần thêm hỗ trợ?

Xem hướng dẫn chi tiết trong `DEPLOY_GUIDE.md`