import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat";
import { storage } from "../storage";

// Thiết lập OpenAI với API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Các câu hỏi mẫu cho người dùng lựa chọn
export const sampleQuestions = [
  {
    text: "Triều Nguyễn tồn tại trong bao lâu và có bao nhiêu đời vua?",
    category: "Lịch sử"
  },
  {
    text: "Kiến trúc cung đình Huế có đặc điểm gì nổi bật?",
    category: "Kiến trúc"
  },
  {
    text: "Nhã nhạc cung đình Huế là gì và có ý nghĩa như thế nào?",
    category: "Văn hóa nghệ thuật"
  },
  {
    text: "Lễ tế Nam Giao là gì và diễn ra như thế nào?",
    category: "Nghi lễ"
  },
  {
    text: "Các lăng tẩm vua Nguyễn có điểm gì đặc biệt?",
    category: "Di tích"
  },
  {
    text: "Trang phục cung đình thời Nguyễn có những loại nào?",
    category: "Văn hóa"
  },
  {
    text: "Chế độ khoa cử thời Nguyễn được tổ chức ra sao?",
    category: "Giáo dục"
  },
  {
    text: "Ẩm thực cung đình Huế có gì đặc sắc?",
    category: "Ẩm thực"
  }
];

// Các câu trả lời mẫu khi không thể sử dụng API
const placeholderResponses = [
  "Triều Nguyễn là triều đại phong kiến cuối cùng của Việt Nam (1802-1945), với 13 đời vua và kinh đô đặt tại Huế. Thành phố này được UNESCO công nhận là Di sản Văn hóa Thế giới.",
  "Kiến trúc cung đình Huế là sự kết hợp hài hòa giữa phong cách truyền thống Việt Nam và ảnh hưởng phương Tây. Hoàng thành Huế có diện tích 520 ha với hơn 100 công trình kiến trúc đặc sắc.",
  "Nhã nhạc cung đình Huế được UNESCO công nhận là Di sản Văn hóa Phi vật thể năm 2003. Đây là loại hình âm nhạc độc đáo chỉ tồn tại trong cung đình nhà Nguyễn, thể hiện tính trang nghiêm, uy nghi của hoàng gia.",
  "Lễ tế Nam Giao là nghi lễ quan trọng nhất của triều Nguyễn, thể hiện quan niệm 'thiên nhân hợp nhất'. Vua thay mặt thiên hạ tế lễ Trời Đất vào tháng Giêng hàng năm tại đàn Nam Giao.",
  "Lăng tẩm các vua Nguyễn là quần thể kiến trúc độc đáo, kết hợp cảnh quan thiên nhiên và nhân tạo. Mỗi lăng đều mang dấu ấn cá nhân của vị vua và phản ánh tư tưởng phong thủy, triết học thời bấy giờ.",
  "Ẩm thực cung đình Huế nổi tiếng với sự tinh tế trong cách chế biến và trình bày. Mỗi món ăn đều thể hiện sự cân bằng về màu sắc, hương vị và dinh dưỡng theo triết lý âm dương."
];

// Map các câu hỏi đơn giản với câu trả lời
const simpleResponses: Record<string, string> = {
  "hello": "Xin chào! Tôi là trợ lý ảo về lịch sử và văn hóa Huế thời Nguyễn. Bạn muốn tìm hiểu điều gì về Cố đô Huế?",
  "hi": "Chào bạn! Tôi có thể giúp gì cho bạn về lịch sử và văn hóa Huế?",
  "xin chào": "Xin chào! Rất vui được trò chuyện với bạn. Bạn muốn biết thông tin gì về Huế thời Nguyễn?",
  "chào": "Chào bạn! Tôi có thể cung cấp thông tin về lịch sử, kiến trúc, văn hóa nghệ thuật của Huế thời Nguyễn. Bạn quan tâm đến chủ đề nào?",
  "help": "Tôi có thể giúp bạn tìm hiểu về các chủ đề sau:\n1. Lịch sử triều Nguyễn\n2. Kiến trúc cung đình\n3. Văn hóa nghệ thuật\n4. Phong tục tập quán\n5. Ẩm thực cung đình\nHãy chọn chủ đề bạn quan tâm!",
  "giúp": "Tôi có thể giúp bạn tìm hiểu về các chủ đề sau:\n1. Lịch sử triều Nguyễn\n2. Kiến trúc cung đình\n3. Văn hóa nghệ thuật\n4. Phong tục tập quán\n5. Ẩm thực cung đình\nHãy chọn chủ đề bạn quan tâm!"
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

    // Nếu câu hỏi có sẵn trong dữ liệu mẫu, trả về câu trả lời tương ứng
    for (const question of sampleQuestions) {
      if (userMessage?.includes(question.text.toLowerCase())) {
        return placeholderResponses[Math.floor(Math.random() * placeholderResponses.length)];
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