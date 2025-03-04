import express from 'express';
import { createHash } from 'crypto';

const router = express.Router();

// Simple in-memory cache
const cache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `Bạn là một chuyên gia về văn hóa và lịch sử Huế. Hãy trả lời các câu hỏi về:
- Di tích lịch sử và kiến trúc cung đình thời Nguyễn
- Văn hóa, phong tục, tập quán của người Huế
- Ẩm thực và nghệ thuật truyền thống
- Địa danh và các điểm tham quan nổi tiếng

Hãy trả lời ngắn gọn, chính xác và dễ hiểu.`;

// Get cached response if available
const getCachedResponse = (message: string): string | null => {
  const hash = createHash('md5').update(message).digest('hex');
  const cached = cache.get(hash);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('Sử dụng câu trả lời từ cache');
    return cached.response;
  }
  return null;
};

// Cache a new response
const cacheResponse = (message: string, response: string) => {
  const hash = createHash('md5').update(message).digest('hex');
  cache.set(hash, { response, timestamp: Date.now() });
};

// Default responses for common errors
const getDefaultResponse = (message: string): string => {
  const lowercaseMsg = message.toLowerCase();

  if (lowercaseMsg.includes('thời tiết')) {
    return 'Bạn có thể xem thông tin thời tiết trong phần "Dữ liệu thực" của ứng dụng.';
  }

  if (lowercaseMsg.includes('giá') || lowercaseMsg.includes('vé')) {
    return 'Bạn có thể xem thông tin về giá vé và đặt vé trong phần "Đặt vé" của ứng dụng.';
  }

  return 'Tôi là trợ lý AI chuyên về văn hóa và lịch sử Huế. Bạn có thể hỏi tôi về các di tích, phong tục, ẩm thực hoặc nghệ thuật truyền thống của Huế.';
};

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Vui lòng nhập nội dung tin nhắn' });
    }

    console.log('Câu hỏi nhận được:', message);

    // Check cache first
    const cachedResponse = getCachedResponse(message);
    if (cachedResponse) {
      return res.json({ reply: cachedResponse });
    }

    // Using Hugging Face's API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/vinai/PhoGPT-7B5",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`
        },
        body: JSON.stringify({
          inputs: `${SYSTEM_PROMPT}\n\nNgười dùng: ${message}\n\nTrợ lý:`,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true
          }
        })
      }
    );

    if (!response.ok) {
      console.log('Lỗi API, sử dụng câu trả lời mặc định');
      const defaultReply = getDefaultResponse(message);
      return res.json({ reply: defaultReply });
    }

    const result = await response.json();
    const reply = result[0].generated_text;

    // Cache the successful response
    cacheResponse(message, reply);

    console.log('Câu trả lời:', reply);
    res.json({ reply });

  } catch (error) {
    console.error('Lỗi xử lý chat:', error);
    const defaultReply = getDefaultResponse(req.body.message);
    res.json({ reply: defaultReply });
  }
});

export default router;