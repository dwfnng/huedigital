
/**
 * Đảm bảo đường dẫn hình ảnh được xử lý đúng
 */
export function getImagePath(path: string | null | undefined): string {
  if (!path) {
    return 'https://placehold.co/600x400/png?text=No+Image';
  }
  
  // Nếu là URL đầy đủ (bắt đầu bằng http hoặc https), trả về nguyên vẹn
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Đảm bảo đường dẫn bắt đầu bằng /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return normalizedPath;
}
