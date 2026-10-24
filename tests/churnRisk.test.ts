import { describe, it, expect } from 'vitest';
import { calculateChurnRisk } from '../src/utils/churnRisk';

describe('Churn Risk Analysis (calculateChurnRisk)', () => {
  it('returns low risk score 0 for empty session history', () => {
    const result = calculateChurnRisk([]);
    expect(result.score).toBe(0);
    expect(result.level).toBe('low');
    expect(result.triggers).toContain('Getting started');
  });

  it('evaluates low churn risk for active user with daily workouts', () => {
    const today = new Date();
    const sessions = [
      { date: new Date(today.getTime() - 1 * 86400000).toISOString() },
      { date: new Date(today.getTime() - 2 * 86400000).toISOString() },
      { date: new Date(today.getTime() - 4 * 86400000).toISOString() },
    ];
    const result = calculateChurnRisk(sessions);
    expect(result.level).toBe('low');
    expect(result.score).toBeLessThan(3);
  });

  it('escalates to medium/high churn risk when user has been inactive for a week or more', () => {
    const today = new Date();
    const sessions = [
      { date: new Date(today.getTime() - 8 * 86400000).toISOString() },
      { date: new Date(today.getTime() - 10 * 86400000).toISOString() },
    ];
    const result = calculateChurnRisk(sessions);
    expect(['medium', 'high']).toContain(result.level);
    expect(result.triggers.some(t => t.includes('No activity in the last'))).toBe(true);
  });

  it('detects 50% activity decline trend', () => {
    const today = new Date();
    // 2 sessions in last 30 days vs 10 sessions in previous 60 days
    const recentSessions = [
      { date: new Date(today.getTime() - 5 * 86400000).toISOString() },
      { date: new Date(today.getTime() - 15 * 86400000).toISOString() },
    ];
    const pastSessions = Array.from({ length: 10 }, (_, i) => ({
      date: new Date(today.getTime() - (40 + i * 4) * 86400000).toISOString(),
    }));

    const result = calculateChurnRisk([...recentSessions, ...pastSessions]);
    expect(result.triggers).toContain('Weekly activity has declined by more than 50%');
  });
});
