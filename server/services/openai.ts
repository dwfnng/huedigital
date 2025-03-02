import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat";
import { storage } from "../storage";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
});

// Use placeholder responses for development without API key
const placeholderResponses = [
  "Xin chào! Tôi là trợ lý ảo về Cố đô Huế. Bạn muốn biết thêm thông tin gì về lịch sử, văn hóa, hoặc các di tích tại Huế?",
  "Triều Nguyễn là triều đại phong kiến cuối cùng của Việt Nam, từ 1802 đến 1945, với kinh đô đặt tại Huế.",
  "Huế có 7 lăng tẩm của các vua triều Nguyễn: Gia Long, Minh Mạng, Thiệu Trị, Tự Đức, Đồng Khánh, Kiến Phúc và Khải Định.",
  "Hoàng thành Huế được UNESCO công nhận là Di sản Văn hóa Thế giới vào năm 1993.",
  "Nhã nhạc cung đình Huế được UNESCO công nhận là Kiệt tác truyền khẩu và phi vật thể của nhân loại vào năm 2003.",
  "Festival Huế là sự kiện văn hóa quốc tế được tổ chức 2 năm một lần tại Huế, giới thiệu các giá trị văn hóa đặc sắc của Việt Nam và thế giới.",
  "Ẩm thực Huế nổi tiếng với nhiều món ăn cung đình và dân gian như bún bò Huế, cơm hến, bánh khoái, bánh bèo, chè Huế..."
];

export async function getChatResponse(messages: ChatCompletionMessageParam[]): Promise<string> {
  try {
    // Check if we have a valid API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy-key") {
      return placeholderResponses[Math.floor(Math.random() * placeholderResponses.length)];
    }

    // Prepare system message with information about Hue's historical sites
    const locations = await storage.getAllLocations();
    const resources = await storage.getAllResources();

    const systemPrompt = `
      Bạn là trợ lý ảo chuyên về Cố đô Huế, có kiến thức chuyên sâu về lịch sử, văn hóa, di tích và các điểm tham quan tại Huế. 
      Hãy cung cấp thông tin chính xác và hữu ích cho du khách.

      Thông tin về các điểm di tích:
      ${locations.map(loc => `- ${loc.name} (${loc.nameEn}): ${loc.description}`).join('\n')}

      Thông tin về các tư liệu sẵn có:
      ${resources.map(res => `- ${res.title}: ${res.description}`).join('\n')}

      Trả lời bằng tiếng Việt, trừ khi người dùng hỏi bằng tiếng Anh.
    `;

    // Call OpenAI API with retry mechanism
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
          max_tokens: 500,
        });

        return completion.choices[0].message.content || "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.";
      } catch (error: any) {
        console.error(`Attempt ${4 - retries} failed:`, error);
        if (error.status === 429) {
          // If rate limited, use placeholder response
          return placeholderResponses[Math.floor(Math.random() * placeholderResponses.length)];
        }
        retries--;
        if (retries === 0) throw error;
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, (4 - retries) * 1000));
      }
    }

    throw new Error("Failed after multiple retries");
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return placeholderResponses[Math.floor(Math.random() * placeholderResponses.length)];
  }
}