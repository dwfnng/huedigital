
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat";
import { storage } from "../storage";

// Thiết lập OpenAI với API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "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",
});

// Các câu trả lời mẫu khi không thể sử dụng API
const placeholderResponses = [
  "Triều Nguyễn là triều đại phong kiến cuối cùng của Việt Nam (1802-1945), với 13 đời vua và kinh đô đặt tại Huế. Thành phố này được UNESCO công nhận là Di sản Văn hóa Thế giới.",
  "Kinh thành Huế được xây dựng từ năm 1805 dưới thời vua Gia Long. Công trình này là sự kết hợp giữa nghệ thuật phương Đông và kiến trúc quân sự phương Tây.",
  "Hoàng thành Huế có diện tích 520 ha với hơn 100 công trình kiến trúc. Nơi đây từng là trung tâm chính trị, văn hóa của Việt Nam thời Nguyễn.",
  "Nhã nhạc cung đình Huế được UNESCO công nhận là Di sản Văn hóa Phi vật thể năm 2003. Đây là loại hình âm nhạc độc đáo chỉ tồn tại trong cung đình nhà Nguyễn.",
  "Huế nổi tiếng với hệ thống lăng tẩm hoàng gia, trong đó có các lăng nổi tiếng như: Lăng Tự Đức, Lăng Minh Mạng, Lăng Khải Định."
];

// Map các câu hỏi đơn giản (như chào) với câu trả lời
const simpleResponses: Record<string, string> = {
  "hello": "Xin chào! Tôi là trợ lý ảo về lịch sử và văn hóa Huế thời Nguyễn. Bạn muốn tìm hiểu điều gì về Cố đô Huế?",
  "hi": "Chào bạn! Tôi có thể giúp gì cho bạn về lịch sử và văn hóa Huế?",
  "xin chào": "Xin chào! Rất vui được trò chuyện với bạn. Bạn muốn biết thông tin gì về Huế thời Nguyễn?",
  "chào": "Chào bạn! Tôi có thể cung cấp thông tin về lịch sử, kiến trúc, văn hóa nghệ thuật của Huế thời Nguyễn. Bạn quan tâm đến chủ đề nào?",
  "help": "Tôi có thể giúp bạn tìm hiểu về lịch sử triều Nguyễn, kiến trúc cung đình, văn hóa nghệ thuật và phong tục tập quán thời kỳ này. Hãy đặt câu hỏi cụ thể để tôi có thể hỗ trợ tốt nhất!",
  "giúp": "Tôi có thể giúp bạn tìm hiểu về lịch sử triều Nguyễn, kiến trúc cung đình, văn hóa nghệ thuật và phong tục tập quán thời kỳ này. Hãy đặt câu hỏi cụ thể để tôi có thể hỗ trợ tốt nhất!"
};

export async function getChatResponse(messages: ChatCompletionMessageParam[]): Promise<string> {
  try {
    // Kiểm tra nếu câu hỏi là đơn giản và có sẵn trong danh sách
    const userMessage = messages[messages.length - 1]?.content?.toString().toLowerCase().trim();
    
    if (userMessage && simpleResponses[userMessage]) {
      return simpleResponses[userMessage];
    }
    
    // Chuẩn bị thông tin từ cơ sở dữ liệu
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

    // Gọi API OpenAI với cơ chế thử lại
    let retries = 2;
    while (retries >= 0) {
      try {
        console.log("Đang gọi OpenAI API...");
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

        const response = completion.choices[0].message.content;
        if (response) {
          console.log("Nhận được phản hồi từ OpenAI API");
          return response;
        }
        
        throw new Error("OpenAI không trả về nội dung");
      } catch (error: any) {
        console.error(`Lỗi lần thử ${2 - retries}:`, error);
        retries--;
        
        // Nếu là lỗi quota hoặc API key không hợp lệ, dừng thử lại
        if (error.status === 429 || error.status === 401) {
          console.log("Lỗi API key hoặc quota, sử dụng phản hồi dự phòng");
          break;
        }
        
        if (retries >= 0) {
          console.log(`Thử lại sau 1 giây...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // Xử lý đặc biệt cho các câu chào đơn giản
    if (userMessage && (
      userMessage.includes("hello") || 
      userMessage.includes("hi") || 
      userMessage.includes("chào") || 
      userMessage.includes("xin chào")
    )) {
      return "Xin chào! Tôi là trợ lý ảo về lịch sử và văn hóa Huế thời Nguyễn. Bạn muốn tìm hiểu điều gì về Cố đô Huế?";
    }
    
    // Trả về phản hồi dự phòng nếu không thể gọi API
    return placeholderResponses[Math.floor(Math.random() * placeholderResponses.length)];
  } catch (error) {
    console.error("Lỗi trong quá trình xử lý:", error);
    return "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.";
  }
}
