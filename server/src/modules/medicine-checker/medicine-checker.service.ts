import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are a pharmaceutical assistant for Zenvira, an online medicine shop. You help users with:
- Medicine uses and indications
- Dosage information
- Side effects and precautions
- Drug interactions
- General health questions related to medicines

Rules:
- Only answer medicine and health-related questions
- Always include a disclaimer that your advice is not a substitute for professional medical consultation
- Keep responses concise and informative
- If asked about non-medical topics, politely redirect to medicine-related questions
- Format responses clearly with bullet points when listing multiple items`;

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export const medicineCheckerService = {
  async chat(message: string, history: ChatMessage[] = []) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    return reply;
  },
};
