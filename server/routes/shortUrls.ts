
import express from 'express';
import { createShortUrl, getOriginalUrl, getAllShortUrls } from '../services/shortUrlService';

const router = express.Router();

// Tạo URL rút gọn
router.post('/api/short-url', (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL là bắt buộc' });
  }
  
  try {
    const shortCode = createShortUrl(url);
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const shortUrl = `${baseUrl}/s/${shortCode}`;
    
    res.json({ 
      originalUrl: url,
      shortUrl,
      shortCode
    });
  } catch (error) {
    res.status(500).json({ error: 'Không thể tạo URL rút gọn' });
  }
});

// Lấy tất cả URL đã rút gọn
router.get('/api/short-urls', (_req, res) => {
  try {
    const allUrls = getAllShortUrls();
    res.json(allUrls);
  } catch (error) {
    res.status(500).json({ error: 'Không thể lấy danh sách URL' });
  }
});

// Chuyển hướng từ URL rút gọn đến URL gốc
router.get('/s/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const originalUrl = getOriginalUrl(shortCode);
  
  if (originalUrl) {
    return res.redirect(originalUrl);
  }
  
  res.status(404).json({ error: 'URL không tồn tại' });
});

export default router;
