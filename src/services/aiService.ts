import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const INITIAL_CHAT_PROMPT = `You are the "Aura AI Coach", a premium, high-performance athletic intelligence assistant for the Aura FitGenX app. Your tone is professional, encouraging, data-driven, and slightly futuristic. You specialize in powerlifting, hypertrophy, and cardiovascular optimization. Keep responses concise and formatted for a mobile chat interface (use short paragraphs or bullet points). Always refer to the user as "Athlete".`;



export const getGeminiResponse = async (prompt: string, history: any[] = []) => {
  if (!API_KEY) {
    console.error("VITE_GEMINI_API_KEY is not defined in .env");
    return "The AI Coach intelligence core is not configured. Please check your environment settings.";
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Verified stable model name from the environment's listModels check
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: INITIAL_CHAT_PROMPT 
    });
    
    const chatHistory = [
      { role: "user", parts: [{ text: INITIAL_CHAT_PROMPT }] },
      { role: "model", parts: [{ text: "Understood, Athlete. I am ready to optimize your performance." }] },
      ...history
    ];

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini API Error details:", error);
    return "I'm having trouble connecting to my athlete intelligence core right now. Please try again or check your connectivity.";
  }
};
