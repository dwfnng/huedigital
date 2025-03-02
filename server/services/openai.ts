
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat";
import { storage } from "../storage";

// Thiết lập OpenAI với API key từ biến môi trường
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getChatResponse(messages: ChatCompletionMessageParam[]): Promise<string> {
  try {
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
    let fallbackModels = ["gpt-3.5-turbo", "gpt-3.5-turbo-instruct"];
    let currentModelIndex = 0;

    while (retries >= 0) {
      try {
        console.log(`Đang gọi OpenAI API với model ${fallbackModels[currentModelIndex]}...`);
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            ...messages
          ],
          model: fallbackModels[currentModelIndex],
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

        // Thử model khác nếu có
        if (currentModelIndex < fallbackModels.length - 1) {
          currentModelIndex++;
          console.log(`Thử với model khác: ${fallbackModels[currentModelIndex]}`);
          continue;
        }

        retries--;

        // Nếu là lỗi quota hoặc API key không hợp lệ, dừng thử lại
        if (error.status === 429 || error.status === 401) {
          console.log("Lỗi API key hoặc quota, không thể tiếp tục");
          throw new Error("Lỗi kết nối đến API OpenAI: " + (error.message || "Vui lòng kiểm tra API key và hạn mức sử dụng"));
        }
      }
    }

    // Nếu tất cả các lần thử đều thất bại
    throw new Error("Không thể kết nối đến OpenAI API sau nhiều lần thử");
  } catch (error: any) {
    console.error("Lỗi từ OpenAI service:", error);
    return "Rất tiếc, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau. Lỗi: " + (error.message || "Không xác định");
  }
}
