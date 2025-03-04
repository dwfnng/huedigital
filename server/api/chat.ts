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

// System prompt to set the context for Hue's cultural heritage
const SYSTEM_PROMPT = `Bạn là một chuyên gia về văn hóa và lịch sử Huế. 
Nhiệm vụ của bạn là chia sẻ kiến thức về di sản văn hóa, lịch sử, kiến trúc, 
ẩm thực và nghệ thuật truyền thống của Huế. Hãy trả lời ngắn gọn, chính xác 
và dễ hiểu, sử dụng tiếng Việt có dấu.`;

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message }
    ];

    const response = await xai.chat.completions.create({
      model: "grok-2-1212",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

export default router;
