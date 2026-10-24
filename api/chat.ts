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

  const API_KEY = process.env.GEMINI_API_KEY;

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

    return res.status(200).json({ response: responseText });
  } catch (error) {
    // Log server error securely without logging user prompt, history, profile data, or API keys
    const errorMessage = error instanceof Error ? error.message : 'Unknown generation failure';
    console.error(`[API/Chat Error] Gemini model generation failed (${mode} mode): ${errorMessage}`);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}