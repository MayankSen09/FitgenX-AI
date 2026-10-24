import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  INITIAL_CHAT_PROMPT,
  MAX_HISTORY_ITEMS,
  sanitizePrompt,
  isRateLimited,
  getClientIp,
  isOriginAllowed,
} from '../src/lib/chatSecurity.ts';

// Note: In-memory rate limiting resets on serverless cold starts; it provides single-container abuse mitigation, not distributed rate limiting.

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '50kb' }));

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
  next();
});

const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('WARNING: Gemini API Key is missing. Ensure VITE_GEMINI_API_KEY or GEMINI_API_KEY is set in your .env file.');
}

app.get('/', (_req, res) => {
  res.json({
    status: 'online',
    message: 'FitGenX API Server is running. Access the web app at http://localhost:5173',
    frontendUrl: 'http://localhost:5173',
    version: '2.0.0',
    endpoints: {
      chat: 'POST /api/chat',
      health: 'GET /health',
    },
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/chat', (req, res) => {
  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp, 20, 60_000)) {
    return res.status(429).json({ error: 'Too many requests. Please wait before sending another message.' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'AI Coach intelligence core is not configured on the server.' });
  }

  const rawPrompt = req.body?.prompt;
  const history: unknown[] = req.body?.history ?? [];
  const mode = req.body?.mode === 'plan' ? 'plan' : 'chat';
  const maxOutputTokens = mode === 'plan' ? 2500 : 500;

  if (!rawPrompt || typeof rawPrompt !== 'string' || !rawPrompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const prompt = sanitizePrompt(rawPrompt);
  const safeHistory = Array.isArray(history) ? history.slice(-MAX_HISTORY_ITEMS) : [];

  (async () => {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: INITIAL_CHAT_PROMPT,
      });

      const chatHistory = [
        { role: 'user' as const, parts: [{ text: INITIAL_CHAT_PROMPT }] },
        { role: 'model' as const, parts: [{ text: 'Understood, Athlete. I am ready to optimize your performance.' }] },
        ...safeHistory,
      ];

      const chat = model.startChat({
        history: chatHistory as any,
        generationConfig: {
          maxOutputTokens,
        },
      });

      const result = await chat.sendMessage(prompt);
      const responseText = await result.response.text();

      res.json({ response: responseText });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown generation failure';
      console.error(`[Server/Chat Error] Gemini model generation failed (${mode} mode): ${errorMessage}`);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  })();
});

app.listen(PORT, () => {
  console.info(`FitGenX Backend running on port ${PORT}`);
});