import { ChurnRiskScore } from '../types/behavioral';

export function calculateChurnRisk(sessions: any[]): ChurnRiskScore {
  if (!sessions || sessions.length === 0) {
    return {
      score: 0,
      level: 'low',
      triggers: ['Getting started']
    };
  }

  // Find most recent session date
  const now = new Date();
  const lastSessionDate = new Date(sessions[0].date || sessions[0].completedAt);
  const diffDays = Math.max(0, Math.floor((now.getTime() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24)));

  const triggers: string[] = [];

  if (diffDays >= 7) {
    triggers.push(`No activity in the last ${diffDays} days`);
  }

  // Calculate session count trends (last 30 vs previous 60)
  const last30 = sessions.filter(s => {
    const d = new Date(s.date || s.completedAt);
    return (now.getTime() - d.getTime()) <= 30 * 24 * 60 * 60 * 1000;
  }).length;

  const previous60 = sessions.filter(s => {
    const d = new Date(s.date || s.completedAt);
    const ago = (now.getTime() - d.getTime());
    return ago > 30 * 24 * 60 * 60 * 1000 && ago <= 90 * 24 * 60 * 60 * 1000;
  }).length / 2; // Average per 30 day segment

  if (last30 < previous60 * 0.5) {
    triggers.push('Weekly activity has declined by more than 50%');
  }

  const score = Math.min(10, diffDays * 1 + (last30 < previous60 ? 2 : 0));

  let level: 'low' | 'medium' | 'high' = 'low';
  if (score >= 6) {
    level = 'high';
  } else if (score >= 3) {
    level = 'medium';
  }

  return {
    score,
    level,
    triggers: triggers.length > 0 ? triggers : ['Activity frequency normal']
  };
}
