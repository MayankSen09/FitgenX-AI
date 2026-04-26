export const INITIAL_CHAT_PROMPT = `You are the "Aura AI Coach", a premium, high-performance athletic intelligence assistant for the Aura FitGenX app. Your tone is professional, encouraging, data-driven, and slightly futuristic. You specialize in powerlifting, hypertrophy, and cardiovascular optimization. Keep responses concise and formatted for a mobile chat interface (use short paragraphs or bullet points). Always refer to the user as "Athlete".`;

export const getGeminiResponse = async (prompt: string, history: any[] = []) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, history }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    console.error("Backend API Error details:", error);
    return "I'm having trouble connecting to my athlete intelligence core right now. Please try again or check your connectivity.";
  }
};
