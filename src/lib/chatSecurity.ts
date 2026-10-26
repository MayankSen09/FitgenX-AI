/**
 * Shared Chat Security & Sanitization Module
 * Used by both Vercel Serverless (api/chat.ts) and Express server (server/index.ts).
 */

export const MAX_PROMPT_LENGTH = 2000;
export const MAX_HISTORY_ITEMS = 20;

export const INITIAL_CHAT_PROMPT = `You are the "FitGenX AI Coach", a premium, high-performance athletic intelligence assistant for the FitGenX app. Your tone is professional, encouraging, data-driven, and slightly futuristic. You specialize in powerlifting, hypertrophy, and cardiovascular optimization. Keep responses concise and formatted for a mobile chat interface (use short paragraphs or bullet points). Always refer to the user as "Athlete".`;

export const ALLOWED_ORIGINS = [
  'https://fitgen-x-ai.vercel.app',
  'https://fitgenx.com',
  'https://www.fitgenx.com',
  'https://genx-one.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
  'http://127.0.0.1:5000',
];

/**
 * Validates request origin against strict allowlist and known project preview patterns.
 * Prevents arbitrary third-party .vercel.app or localhost subdomain hijacking.
 */
export function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return false;
  
  // 1. Exact match against known production and development domains
  if (ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }

  // 2. Strict regex for authentic project preview deployments only
  const isProjectVercelPreview = /^https:\/\/(fitgen-x-ai|genx-one)(-[a-z0-9-]+)?\.vercel\.app$/.test(origin);
  if (isProjectVercelPreview) {
    return true;
  }

  // 3. Strict local development host checking (exact port bindings)
  const isLocalDev = /^http:\/\/(localhost|127\.0\.0\.1):(5173|4173|5000)$/.test(origin);
  return isLocalDev;
}

/**
 * Sanitizes input prompt: enforces MAX_PROMPT_LENGTH (2000 chars)
 * and strips non-printable control characters.
 */
export function sanitizePrompt(prompt: string): string {
  return prompt
    .slice(0, MAX_PROMPT_LENGTH)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

/**
 * In-memory per-IP rate limiter with automatic cleanup to prevent memory exhaustion.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Periodic cleanup of expired entries every 5 minutes to prevent memory leak
const CLEANUP_INTERVAL_MS = 5 * 60_000;
let lastCleanup = Date.now();

function purgeExpiredEntries(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

export function isRateLimited(ip: string, limit = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  purgeExpiredEntries(now);

  const cleanIp = String(ip || 'unknown').slice(0, 64);
  const entry = rateLimitMap.get(cleanIp);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(cleanIp, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= limit) {
    return true;
  }

  entry.count++;
  return false;
}

/**
 * Extracts client IP address safely from proxy headers or connection socket.
 */
export function getClientIp(req: any): string {
  const fwd = req.headers?.['x-forwarded-for'];
  if (typeof fwd === 'string') return fwd.split(',')[0].trim();
  if (Array.isArray(fwd)) return String(fwd[0]).split(',')[0].trim();
  return (req.headers?.['x-real-ip'] as string) || req.socket?.remoteAddress || 'unknown';
}
