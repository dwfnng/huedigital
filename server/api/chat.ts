import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// Initialize xAI client
const xai = new OpenAI({ 
  baseURL: "https://api.x.ai/v1", 
  apiKey: process.env.XAI_API_KEY 
});

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Detailed system prompt with Vietnamese cultural context
const SYSTEM_PROMPT = `Bạn là một chuyên gia về văn hóa và lịch sử Huế, với kiến thức sâu rộng về:
- Di tích lịch sử và kiến trúc cung đình thời Nguyễn
- Văn hóa, phong tục, tập quán của người Huế
- Ẩm thực và nghệ thuật truyền thống
- Địa danh và các điểm tham quan nổi tiếng

Nhiệm vụ của bạn là:
1. Trả lời mọi câu hỏi về Huế một cách chi tiết và chính xác
2. Sử dụng tiếng Việt có dấu, dễ hiểu
3. Ưu tiên cung cấp thông tin lịch sử và văn hóa có căn cứ
4. Giải thích các thuật ngữ chuyên ngành khi cần thiết

Nếu không chắc chắn về thông tin, hãy thông báo rõ ràng cho người dùng.`;

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Vui lòng nhập nội dung tin nhắn' });
    }

    console.log('Đang xử lý câu hỏi:', message);

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message }
    ];

    const response = await xai.chat.completions.create({
      model: "grok-2-1212",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
      n: 1
    });

    const reply = response.choices[0].message.content;
    console.log('Phản hồi từ AI:', reply);
    res.json({ reply });

  } catch (error) {
    console.error('xAI API error:', error);

    // Handle different types of errors
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        res.status(500).json({ 
          error: 'Lỗi xác thực API. Vui lòng kiểm tra lại cấu hình.',
          details: error.message 
        });
      } else {
        res.status(500).json({ 
          error: 'Không thể kết nối với trợ lý AI',
          details: error.message 
        });
      }
    } else {
      res.status(500).json({ 
        error: 'Lỗi không xác định',
        details: 'Unknown error occurred'
      });
    }
  }
});

export default router;