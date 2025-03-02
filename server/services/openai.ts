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

// Map các câu hỏi với câu trả lời tương ứng
const questionAnswers: Record<string, string> = {
  "Triều Nguyễn tồn tại trong bao lâu và có bao nhiêu đời vua?": 
    "Triều Nguyễn tồn tại từ năm 1802 đến năm 1945 (143 năm), trải qua 13 đời vua: Gia Long (1802-1820), Minh Mạng (1820-1841), Thiệu Trị (1841-1847), Tự Đức (1847-1883), Dục Đức (1883), Hiệp Hòa (1883), Kiến Phúc (1883-1884), Hàm Nghi (1884-1885), Đồng Khánh (1885-1889), Thành Thái (1889-1907), Duy Tân (1907-1916), Khải Định (1916-1925) và Bảo Đại (1925-1945).",

  "Kiến trúc cung đình Huế có đặc điểm gì nổi bật?":
    "Kiến trúc cung đình Huế nổi bật với quy hoạch theo phong thủy và nguyên lý âm dương - ngũ hành. Hoàng thành được xây theo kiểu 'thành nội thành ngoại' với ba vòng thành: Kinh thành, Hoàng thành và Tử cấm thành. Các công trình kiến trúc thể hiện sự kết hợp hài hòa giữa phong cách truyền thống Việt Nam với ảnh hưởng từ kiến trúc phương Tây, đặc biệt là nghệ thuật trang trí với các họa tiết chạm khắc tinh xảo, sơn son thếp vàng.",

  "Nhã nhạc cung đình Huế là gì và có ý nghĩa như thế nào?":
    "Nhã nhạc cung đình Huế là loại hình âm nhạc cổ truyền được sử dụng trong các nghi lễ, tế tự và lễ hội của triều Nguyễn. Được UNESCO công nhận là Di sản Văn hóa Phi vật thể năm 2003, nhã nhạc thể hiện tính trang nghiêm, uy nghi của hoàng gia thông qua hệ thống nhạc khí đa dạng (như đàn tỳ bà, đàn nhị, sáo trúc...) và các bài bản có tính nghi thức cao. Nhã nhạc không chỉ là nghệ thuật biểu diễn mà còn phản ánh triết lý âm dương và vũ trụ quan của người Việt.",

  "Lễ tế Nam Giao là gì và diễn ra như thế nào?":
    "Lễ tế Nam Giao là nghi lễ quan trọng nhất của triều Nguyễn, thể hiện quan niệm 'thiên nhân hợp nhất'. Được tổ chức vào mùng 8 tháng Giêng hàng năm tại đàn Nam Giao, vua thay mặt thiên hạ tế lễ Trời Đất. Đàn tế có cấu trúc ba tầng: tầng trên hình vuông (tượng trưng cho Trời), tầng giữa hình tròn (tượng trưng cho Đất), tầng dưới hình bát giác (tượng trưng cho Người). Nghi lễ diễn ra trong ba ngày với nhiều nghi thức phức tạp, có sự tham gia của hàng trăm quan lại và nhạc công.",

  "Các lăng tẩm vua Nguyễn có điểm gì đặc biệt?":
    "Các lăng tẩm vua triều Nguyễn là những quần thể kiến trúc độc đáo, mỗi lăng đều mang dấu ấn cá nhân của vị vua và phản ánh tư tưởng phong thủy thời bấy giờ. Tiêu biểu như: Lăng Tự Đức nổi tiếng với không gian thơ mộng và kiến trúc tinh tế; Lăng Minh Mạng có quy hoạch đối xứng hoàn hảo; Lăng Khải Định kết hợp kiến trúc Đông-Tây với nghệ thuật khảm sành sứ độc đáo. Các lăng tẩm không chỉ là nơi an nghỉ mà còn là nơi vua sinh thời lui tới nghỉ ngơi và làm việc.",

  "Trang phục cung đình thời Nguyễn có những loại nào?":
    "Trang phục cung đình thời Nguyễn được phân chia theo thân phận và dịp sử dụng: 1. Cát phục (triều phục) của vua gồm áo long bào thêu rồng vàng, mũ miện; 2. Thường phục như áo tứ thân, ngũ thân; 3. Lễ phục dành cho các nghi lễ quan trọng. Hoàng hậu và phi tần có các loại áo phụng bào, thái bào. Quan lại mặc mãng bào với hoa văn trang trí thể hiện phẩm cấp. Màu sắc trang phục cũng được quy định nghiêm ngặt: vàng dành riêng cho vua, tía cho hoàng hậu, xanh và đỏ cho quan lại các cấp.",

  "Chế độ khoa cử thời Nguyễn được tổ chức ra sao?":
    "Khoa cử thời Nguyễn theo hệ thống tam trường (ba kỳ thi): Kỳ đệ nhất (thi Kinh nghĩa và Tứ lục), kỳ đệ nhị (thi Văn sách), kỳ đệ tam (thi Phú và Chiếu chế). Các kỳ thi chính gồm: Thi Hương (tổ chức tại các tỉnh), thi Hội (tổ chức tại kinh đô) và thi Đình (do vua đích thân ra đề). Người đỗ được phong các học vị: Tú tài, Cử nhân (thi Hương), Phó bảng (thi Hội), Tiến sĩ (thi Đình). Trường thi được tổ chức nghiêm ngặt với hệ thống giám khảo, lễ xướng danh và vinh danh người đỗ đạt.",

  "Ẩm thực cung đình Huế có gì đặc sắc?":
    "Ẩm thực cung đình Huế nổi tiếng với nghệ thuật chế biến và trình bày tinh tế. Mỗi bữa tiệc cung đình có thể gồm 50-300 món ăn được bày trí theo nguyên tắc 'tam thanh' (ba tầng) và 'cửu đỉnh' (chín mâm). Đặc trưng của ẩm thực cung đình là sự cân bằng ngũ vị (cay, chua, mặn, ngọt, đắng), màu sắc hài hòa và cách trang trí công phu như tỉa hoa từ củ quả. Các món tiêu biểu gồm: súp cung đình, nem công chả phượng, chả tôm hoàng hậu, bánh cung đình các loại."
};

// Map các câu chào đơn giản với câu trả lời
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

    // Kiểm tra nếu câu hỏi khớp với câu hỏi mẫu
    for (const question of sampleQuestions) {
      if (userMessage?.includes(question.text.toLowerCase())) {
        return questionAnswers[question.text] || "Xin lỗi, tôi không tìm thấy thông tin phù hợp cho câu hỏi này.";
      }
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

    // Trả về phản hồi dự phòng nếu không thể gọi API
    if (userMessage && Object.keys(questionAnswers).some(q => userMessage.includes(q.toLowerCase()))) {
      const matchedQuestion = Object.keys(questionAnswers).find(q => userMessage.includes(q.toLowerCase()));
      return matchedQuestion ? questionAnswers[matchedQuestion] : "Xin lỗi, tôi không tìm thấy thông tin phù hợp cho câu hỏi này.";
    }

    return "Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi rõ hơn hoặc chọn một trong các câu hỏi gợi ý phía trên.";
  } catch (error) {
    console.error("Lỗi trong quá trình xử lý:", error);
    return "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.";
  }
}