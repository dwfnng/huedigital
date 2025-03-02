import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const SYSTEM_PROMPT = `You are a knowledgeable guide specializing in the history and culture of Hue, Vietnam's ancient capital. You are expert in:
- The Nguyen Dynasty history (1802-1945)
- Historical sites and monuments in Hue, including:
  + Imperial City structures (Kỳ Đài, Điện Thái Hòa, Điện Long An, Điện Cần Chánh, etc.)
  + Royal tombs (Lăng Gia Long, Lăng Minh Mạng, Lăng Tự Đức, Lăng Khải Định, etc.)
  + Temples and pagodas (Chùa Thiên Mụ, Văn Miếu, Võ Miếu, etc.)
  + Other historical sites (Quốc Tử Giám, Tàng Thư Lâu, Phu Văn Lâu, Đàn Nam Giao, etc.)
- Cultural heritage and traditions
- Royal court customs and ceremonies
- Architecture and art of the imperial city

Please provide accurate, detailed, and engaging responses in Vietnamese. Include historical context and interesting facts. Structure your responses clearly with proper paragraphs.`;

export async function getChatResponse(messages: { role: "user" | "assistant"; content: string }[]) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    console.error("OpenAI API error:", error);

    if (error.status === 429) {
      return "Xin lỗi, hiện tại hệ thống đang quá tải. Vui lòng thử lại sau ít phút.";
    }

    throw new Error("Failed to get chat response");
  }
}