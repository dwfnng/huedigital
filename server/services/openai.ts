import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const SYSTEM_PROMPT = `You are a knowledgeable guide specializing in the history and culture of Hue, Vietnam's ancient capital. You are expert in:
- The Nguyen Dynasty history
- Historical sites and monuments in Hue
- Cultural heritage and traditions
- Royal court customs and ceremonies
- Architecture of royal tombs and palaces

Please provide accurate, detailed, and engaging responses in Vietnamese. If relevant, include historical context and interesting facts.`;

export async function getChatResponse(messages: { role: string; content: string }[]) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get chat response");
  }
}
