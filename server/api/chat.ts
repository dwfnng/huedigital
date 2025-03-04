import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// Initialize xAI client with proper error handling
const xai = new OpenAI({ 
  baseURL: "https://api.x.ai/v1", 
  apiKey: process.env.XAI_API_KEY 
});

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Improved system prompt with more detailed context
const SYSTEM_PROMPT = `Bạn là một chuyên gia về văn hóa và lịch sử Huế, với kiến thức sâu rộng về:
- Di tích lịch sử và kiến trúc cung đình thời Nguyễn
- Văn hóa, phong tục, tập quán của người Huế
- Ẩm thực và nghệ thuật truyền thống
- Địa danh và các điểm tham quan nổi tiếng

Hãy trả lời ngắn gọn, chính xác và dễ hiểu, sử dụng tiếng Việt có dấu.`;

// Backup responses for when API fails
const backupResponses = {
  error: "Xin lỗi, hiện tại hệ thống đang gặp trục trặc. Vui lòng thử lại sau ít phút.",
  default: "Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi rõ hơn hoặc chọn một trong các câu hỏi gợi ý phía trên."
};

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Vui lòng nhập nội dung tin nhắn' });
    }

    console.log('Đang gọi xAI API...');

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message }
    ];

    const response = await xai.chat.completions.create({
      model: "grok-2-1212",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      n: 1
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error('xAI API error:', error);

    // Return a user-friendly error message
    if (error.status === 401) {
      console.error('API key authentication failed');
      res.status(500).json({ error: backupResponses.error });
    } else {
      res.status(500).json({ 
        error: 'Không thể kết nối với trợ lý AI',
        details: error.message 
      });
    }
  }
});

export default router;