import * as Sentry from '@sentry/react';

/**
 * Initializes Sentry for React only when VITE_SENTRY_DSN is provided.
 * Ensures zero PII (names, emails, prompts, IPs) is transmitted.
 */
export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn || typeof dsn !== 'string' || !dsn.trim() || dsn.includes('placeholder')) {
    return;
  }

  try {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
      beforeSend(event) {
        if (event.user) {
          delete event.user.email;
          delete event.user.username;
          delete event.user.ip_address;
        }
        return event;
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Sentry:', err);
  }
}

/**
 * Safely captures an exception to Sentry (if configured) and logs to console.
 */
export function captureAppError(error: unknown, errorInfo?: unknown): void {
  console.error('[FitGenX Error]', error, errorInfo);
  if (import.meta.env.VITE_SENTRY_DSN) {
    try {
      Sentry.captureException(error, {
        extra: errorInfo ? { componentStack: (errorInfo as any).componentStack } : undefined,
      });
    } catch {
      // Ignore Sentry dispatch failures
    }
  }
}
