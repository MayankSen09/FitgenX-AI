import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load .env from project root (one level up from server/)
dotenv.config({ path: path.resolve(import.meta.dir, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('WARNING: Gemini API Key is missing. Ensure VITE_GEMINI_API_KEY or GEMINI_API_KEY is set in your .env file.');
}

const INITIAL_CHAT_PROMPT = `You are the "Aura AI Coach", a premium, high-performance athletic intelligence assistant for the Aura FitGenX app. Your tone is professional, encouraging, data-driven, and slightly futuristic. You specialize in powerlifting, hypertrophy, and cardiovascular optimization. Keep responses concise and formatted for a mobile chat interface (use short paragraphs or bullet points). Always refer to the user as "Athlete".`;

app.post('/api/chat', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: 'AI Coach intelligence core is not configured on the server.' });
  }

  const { prompt, history = [] } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: INITIAL_CHAT_PROMPT,
    });

    const chatHistory = [
      { role: 'user', parts: [{ text: INITIAL_CHAT_PROMPT }] },
      { role: 'model', parts: [{ text: 'Understood, Athlete. I am ready to optimize your performance.' }] },
      ...history,
    ];

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(prompt);
    const responseText = await result.response.text();
    
    res.json({ response: responseText });
  } catch (error) {
    console.error('Gemini API Error details:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.listen(PORT, () => {
  console.log(`Aura FitGenX Backend running on http://localhost:${PORT}`);
});