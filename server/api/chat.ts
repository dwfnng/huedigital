import express from 'express';

const router = express.Router();

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

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Vui lòng nhập nội dung tin nhắn' });
    }

    console.log('Đang xử lý câu hỏi:', message);

    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error('Thiếu API key cho Hugging Face');
    }

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
            max_new_tokens: 250,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('API response:', result);

    let reply = '';
    if (Array.isArray(result) && result.length > 0) {
      reply = result[0].generated_text || 'Xin lỗi, tôi không thể tạo câu trả lời lúc này.';
    } else {
      reply = 'Xin lỗi, tôi không thể tạo câu trả lời lúc này.';
    }

    console.log('Final reply:', reply);
    res.json({ reply });

  } catch (error) {
    console.error('Lỗi xử lý chat:', error);
    res.status(500).json({ 
      error: 'Không thể kết nối với trợ lý AI',
      details: error instanceof Error ? error.message : 'Lỗi không xác định'
    });
  }
});

export default router;