import express from 'express';

const router = express.Router();

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Common responses for frequent questions
const commonResponses: Record<string, string> = {
  'chào': 'Xin chào! Tôi là trợ lý AI về văn hóa và lịch sử Huế. Bạn muốn tìm hiểu về vấn đề gì?',
  'kinh thành': 'Kinh thành Huế được xây dựng từ năm 1805, là trung tâm chính trị của triều Nguyễn. Quần thể này có diện tích 520ha và được UNESCO công nhận là Di sản Văn hóa Thế giới năm 1993.',
  'chùa thiên mụ': 'Chùa Thiên Mụ là ngôi chùa cổ nhất ở Huế, được xây dựng năm 1601. Đây là biểu tượng của thành phố với tháp Phước Duyên 7 tầng nổi tiếng.',
  'ẩm thực': 'Huế nổi tiếng với các món ăn cung đình và dân gian như bún bò Huế, cơm hến, bánh bèo, bánh nậm, bánh lọc...',
  'default': 'Tôi là trợ lý AI chuyên về văn hóa và lịch sử Huế. Bạn có thể hỏi về di tích, phong tục, ẩm thực hoặc nghệ thuật truyền thống của Huế.'
};

// Find best matching response from common questions
const findMatchingResponse = (message: string): string => {
  const normalizedMsg = message.toLowerCase();

  for (const [key, value] of Object.entries(commonResponses)) {
    if (normalizedMsg.includes(key)) {
      return value;
    }
  }

  return commonResponses.default;
};

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Vui lòng nhập nội dung tin nhắn' });
    }

    console.log('Đang xử lý câu hỏi:', message);

    // Try to find a matching common response first
    const commonResponse = findMatchingResponse(message);
    if (commonResponse !== commonResponses.default) {
      console.log('Sử dụng câu trả lời có sẵn');
      return res.json({ reply: commonResponse });
    }

    // If no common response, use Hugging Face API
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
          inputs: `Trả lời về lịch sử và văn hóa Huế: ${message}`,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true
          }
        })
      }
    );

    if (!response.ok) {
      console.log('API lỗi, sử dụng câu trả lời mặc định');
      return res.json({ reply: commonResponses.default });
    }

    const result = await response.json();
    let reply = result[0]?.generated_text || commonResponses.default;

    console.log('Câu trả lời:', reply);
    res.json({ reply });

  } catch (error) {
    console.error('Lỗi xử lý chat:', error);
    res.json({ reply: commonResponses.default });
  }
});

export default router;