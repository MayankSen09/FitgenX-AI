import { OvertrainingAlert } from '../types/behavioral';

export function detectOvertraining(sessions: any[]): OvertrainingAlert | null {
  if (!sessions || sessions.length < 6) return null;

  // Rule 1: >6 sessions in 7 days
  const now = new Date();
  const past7Days = sessions.filter(s => {
    const d = new Date(s.date || s.completedAt);
    return (now.getTime() - d.getTime()) <= 7 * 24 * 60 * 60 * 1000;
  });

  if (past7Days.length > 6) {
    return {
      severity: 'warning',
      reason: `You have completed ${past7Days.length} sessions in the last week.`,
      recommendation: 'We recommend taking a dedicated rest day to prevent excessive load.',
      suggestedRestDays: 1
    };
  }

  // Rule 2: Increase in volume over 20% week-over-week
  return null;
}
