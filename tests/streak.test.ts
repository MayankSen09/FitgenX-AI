import { describe, it, expect } from 'vitest';
import { calculateStreak } from '../src/utils/streak';

describe('Streak Calculation (getStreak)', () => {
  const refDate = new Date('2026-10-24T12:00:00Z');

  it('returns 0 for empty workout history', () => {
    expect(calculateStreak([], refDate)).toBe(0);
  });

  it('counts 1 if workout was completed today', () => {
    const history = [{ date: '2026-10-24T09:30:00.000Z' }];
    expect(calculateStreak(history, refDate)).toBe(1);
  });

  it('counts consecutive days including today', () => {
    const history = [
      { date: '2026-10-24T09:30:00.000Z' },
      { date: '2026-10-23T18:15:00.000Z' },
      { date: '2026-10-22T07:00:00.000Z' },
    ];
    expect(calculateStreak(history, refDate)).toBe(3);
  });

  it('preserves streak if workout is not yet done today but was done yesterday', () => {
    const history = [
      { date: '2026-10-23T18:15:00.000Z' },
      { date: '2026-10-22T07:00:00.000Z' },
      { date: '2026-10-21T08:00:00.000Z' },
    ];
    expect(calculateStreak(history, refDate)).toBe(3);
  });

  it('breaks streak when a day is skipped prior to yesterday', () => {
    const history = [
      { date: '2026-10-24T09:30:00.000Z' },
      { date: '2026-10-23T18:15:00.000Z' },
      // 2026-10-22 missed
      { date: '2026-10-21T07:00:00.000Z' },
    ];
    expect(calculateStreak(history, refDate)).toBe(2);
  });

  it('returns 0 if last workout was 2 or more days ago', () => {
    const history = [
      { date: '2026-10-21T07:00:00.000Z' },
      { date: '2026-10-20T07:00:00.000Z' },
    ];
    expect(calculateStreak(history, refDate)).toBe(0);
  });
});
