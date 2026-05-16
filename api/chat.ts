import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const INITIAL_CHAT_PROMPT = `You are the "FitGenX AI Coach", a premium, high-performance athletic intelligence assistant for the FitGenX app. Your tone is professional, encouraging, data-driven, and slightly futuristic. You specialize in powerlifting, hypertrophy, and cardiovascular optimization. Keep responses concise and formatted for a mobile chat interface (use short paragraphs or bullet points). Always refer to the user as "Athlete".`;

const MAX_PROMPT_LENGTH = 2000;
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

function getClientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string') return fwd.split(',')[0].trim();
  if (Array.isArray(fwd)) return String(fwd[0]).split(',')[0].trim();
  return req.headers['x-real-ip'] as string || 'unknown';
}

const ALLOWED_ORIGINS = [
  'https://fitgenx.com',
  'https://www.fitgenx.com',
  'https://genx-one.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
];

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app');
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

  const origin = req.headers.origin;
  if (origin && !isOriginAllowed(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp, 20, 60_000)) {
    return res.status(429).json({ error: 'Too many requests. Please wait before sending another message.' });
  }

  const API_KEY = process.env.GEMINI_API_KEY;

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

    return res.status(200).json({ response: responseText });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}