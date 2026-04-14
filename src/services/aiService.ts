import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (prompt: string, history: { role: string, parts: { text: string }[] }[] = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my athlete intelligence core right now. Please try again in a moment.";
  }
};

export const INITIAL_CHAT_PROMPT = `
You are the "Aura AI Coach", a premium, high-performance athletic intelligence assistant for the Aura FitGenX app. 
Your tone is professional, encouraging, data-driven, and slightly futuristic. 
You specialize in powerlifting, hypertrophy, and cardiovascular optimization.
Keep responses concise and formatted for a mobile chat interface (use short paragraphs or bullet points).
Always refer to the user as "Athlete".
`;
