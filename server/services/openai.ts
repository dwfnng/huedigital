
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat";
import { storage } from "../storage";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "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",
});

const placeholderResponses = [
  "Triều Nguyễn là triều đại phong kiến cuối cùng của Việt Nam (1802-1945), với 13 đời vua và kinh đô đặt tại Huế. Thành phố này được UNESCO công nhận là Di sản Văn hóa Thế giới.",
  "Kinh thành Huế được xây dựng từ năm 1805 dưới thời vua Gia Long. Công trình này là sự kết hợp giữa nghệ thuật phương Đông và kiến trúc quân sự phương Tây.",
  "Hoàng thành Huế có diện tích 520 ha với hơn 100 công trình kiến trúc. Nơi đây từng là trung tâm chính trị, văn hóa của Việt Nam thời Nguyễn.",
  "Nhã nhạc cung đình Huế được UNESCO công nhận là Di sản Văn hóa Phi vật thể năm 2003. Đây là loại hình âm nhạc độc đáo chỉ tồn tại trong cung đình nhà Nguyễn.",
  "Huế nổi tiếng với hệ thống lăng tẩm hoàng gia, trong đó có các lăng nổi tiếng như: Lăng Tự Đức, Lăng Minh Mạng, Lăng Khải Định."
];

export async function getChatResponse(messages: ChatCompletionMessageParam[]): Promise<string> {
  try {
    // Prepare system message with information about Hue's historical sites
    const locations = await storage.getAllLocations();
    const resources = await storage.getAllResources();

    const systemPrompt = `Bạn là một chuyên gia về lịch sử và văn hóa Huế thời Nguyễn (1802-1945). Nhiệm vụ của bạn là:

1. Cung cấp thông tin chính xác, chi tiết về:
   - Lịch sử triều Nguyễn: các vị vua, sự kiện quan trọng, cải cách
   - Kiến trúc cung đình: Hoàng thành, điện, lầu, tháp
   - Văn hóa nghệ thuật: nhã nhạc, thi ca, hội họa, thư pháp
   - Phong tục tập quán: lễ hội, nghi lễ, trang phục, ẩm thực

2. Khi trả lời cần:
   - Dùng tiếng Việt chuẩn mực, trang trọng
   - Trích dẫn sử liệu, tài liệu khi cần thiết
   - Giải thích các thuật ngữ chuyên môn
   - Liên hệ với hiện tại khi phù hợp

3. Thông tin về các di tích:
${locations.map(loc => `- ${loc.name} (${loc.nameEn}): ${loc.description}`).join('\n')}

4. Tư liệu tham khảo:
${resources.map(res => `- ${res.title}: ${res.description}`).join('\n')}

Trả lời bằng tiếng Việt, trừ khi người dùng hỏi bằng tiếng Anh. Luôn giữ giọng điệu trang trọng, chuyên nghiệp nhưng thân thiện.`;

    // Call OpenAI with retry mechanism
    let retries = 3;
    while (retries > 0) {
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            ...messages
          ],
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          max_tokens: 800,
          presence_penalty: 0.6,
          frequency_penalty: 0.3,
        });

        return completion.choices[0].message.content || "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.";
      } catch (error: any) {
        console.error(`Attempt ${4 - retries} failed:`, error);
        retries--;
        
        if (retries === 0 || error.status === 429) {
          // If rate limited or all retries failed, use carefully selected placeholder response
          return placeholderResponses[Math.floor(Math.random() * placeholderResponses.length)];
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return placeholderResponses[Math.floor(Math.random() * placeholderResponses.length)];
  } catch (error) {
    console.error("Error getting chat response:", error);
    return placeholderResponses[Math.floor(Math.random() * placeholderResponses.length)];
  }
}
