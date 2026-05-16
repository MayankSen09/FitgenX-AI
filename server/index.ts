import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MAX_PROMPT_LENGTH = 20000;
const MAX_HISTORY_ITEMS = 20;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function sanitizePrompt(prompt: string): string {
  return prompt
    .slice(0, MAX_PROMPT_LENGTH)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

function isRateLimited(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= limit) {
    return true;
  }

  entry.count++;
  return false;
}

function getClientIp(req: express.Request): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string') return fwd.split(',')[0].trim();
  if (Array.isArray(fwd)) return String(fwd[0]).split(',')[0].trim();
  return (req.headers['x-real-ip'] as string) || req.socket.remoteAddress || 'unknown';
}

const INITIAL_CHAT_PROMPT = `You are the "FitGenX AI Coach", a premium, high-performance athletic intelligence assistant for the FitGenX app. Your tone is professional, encouraging, data-driven, and slightly futuristic. You specialize in powerlifting, hypertrophy, and cardiovascular optimization. Keep responses concise and formatted for a mobile chat interface (use short paragraphs or bullet points). Always refer to the user as "Athlete".`;

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else if (origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else if (origin.includes('localhost')) {
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
        history: chatHistory,
        generationConfig: {
          maxOutputTokens: 500,
        },
      });

      const result = await chat.sendMessage(prompt);
      const responseText = await result.response.text();

      res.json({ response: responseText });
    } catch {
      res.status(500).json({ error: 'Failed to generate response' });
    }
  })();
});

app.listen(PORT, () => {
  console.info(`FitGenX Backend running on port ${PORT}`);
});