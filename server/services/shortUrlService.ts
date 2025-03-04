
import crypto from 'crypto';

// Lưu trữ ánh xạ URL đã rút gọn
const urlMappings: Record<string, string> = {};

/**
 * Tạo URL rút gọn
 * @param originalUrl URL gốc cần rút gọn
 * @returns Mã rút gọn
 */
export function createShortUrl(originalUrl: string): string {
  // Tạo mã hash từ URL gốc + timestamp để đảm bảo tính duy nhất
  const hash = crypto
    .createHash('md5')
    .update(originalUrl + Date.now().toString())
    .digest('hex')
    .substring(0, 6); // Chỉ lấy 6 ký tự đầu tiên
  
  // Lưu trữ ánh xạ
  urlMappings[hash] = originalUrl;
  
  return hash;
}

/**
 * Lấy URL gốc từ mã rút gọn
 * @param shortCode Mã rút gọn
 * @returns URL gốc hoặc null nếu không tìm thấy
 */
export function getOriginalUrl(shortCode: string): string | null {
  return urlMappings[shortCode] || null;
}

/**
 * Lấy danh sách tất cả URL đã rút gọn
 * @returns Đối tượng chứa tất cả ánh xạ
 */
export function getAllShortUrls(): Record<string, string> {
  return { ...urlMappings };
}
