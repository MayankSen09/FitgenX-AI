import { describe, it, expect } from 'vitest';
import { detectOvertraining } from '../src/utils/overtrainingDetector';

describe('Overtraining Detection (detectOvertraining)', () => {
  it('returns null if user has fewer than 6 total sessions', () => {
    const sessions = [
      { date: new Date().toISOString() },
      { date: new Date().toISOString() },
    ];
    expect(detectOvertraining(sessions)).toBeNull();
  });

  it('triggers warning alert if more than 6 sessions completed within past 7 days', () => {
    const now = Date.now();
    // 7 sessions within the last 6 days
    const heavySessions = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(now - i * 18 * 3600 * 1000).toISOString(),
    }));

    const alert = detectOvertraining(heavySessions);
    expect(alert).not.toBeNull();
    expect(alert?.severity).toBe('warning');
    expect(alert?.suggestedRestDays).toBe(1);
    expect(alert?.reason).toContain('sessions in the last week');
  });

  it('returns null if workouts are spaced out across the month', () => {
    const now = Date.now();
    const spacedSessions = Array.from({ length: 8 }, (_, i) => ({
      date: new Date(now - (i * 3 + 2) * 86400000).toISOString(),
    }));

    const alert = detectOvertraining(spacedSessions);
    expect(alert).toBeNull();
  });
});
