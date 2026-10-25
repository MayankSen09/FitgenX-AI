import type { VercelRequest, VercelResponse } from '@vercel/node';
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

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
  const origin = req.headers.origin;
  if (origin) {
    if (!isOriginAllowed(origin)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    // Only return the allowlisted origin; never unconditional wildcard '*'
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

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

  const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'AI Coach intelligence core is not configured on the server. Please set GEMINI_API_KEY in your environment.' });
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

  const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
  const genAI = new GoogleGenerativeAI(API_KEY);

  const chatHistory = [
    { role: 'user' as const, parts: [{ text: INITIAL_CHAT_PROMPT }] },
    { role: 'model' as const, parts: [{ text: 'Understood, Athlete. I am ready to optimize your performance.' }] },
    ...safeHistory,
  ];

  let lastError: unknown = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: INITIAL_CHAT_PROMPT,
      });

      const chat = model.startChat({
        history: chatHistory as any,
        generationConfig: {
          maxOutputTokens,
        },
      });

      const result = await chat.sendMessage(prompt);
      const responseText = await result.response.text();

      return res.status(200).json({ response: responseText });
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[API/Chat] Model ${modelName} attempt failed: ${msg}. Trying next fallback...`);
    }
  }

  const errorMessage = lastError instanceof Error ? lastError.message : 'Unknown generation failure';
  console.error(`[API/Chat Error] All Gemini models failed (${mode} mode): ${errorMessage}`);
  return res.status(500).json({ error: 'Failed to generate response', details: errorMessage });
}