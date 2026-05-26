import { RecoveryRecommendation } from '../types/behavioral';

export function getRecoveryRecommendation(sessions: any[]): RecoveryRecommendation {
  if (!sessions || sessions.length === 0) {
    return {
      type: 'light',
      title: 'Light movement is recommended',
      reasoning: 'Welcome to your fitness path! Taking things slow today is the best way to get started.',
      suggestedActivity: '15-minute gentle walk'
    };
  }

  // Calculate volume (hours / total session count) over past 7 days
  const now = new Date();
  const pastWeek = sessions.filter((s) => {
    const d = new Date(s.date || s.completedAt);
    return (now.getTime() - d.getTime()) <= 7 * 24 * 60 * 60 * 1000;
  });

  const totalDurationSeconds = pastWeek.reduce((acc, s) => acc + (s.duration || 0), 0);
  const totalMinutes = Math.round(totalDurationSeconds / 60);

  if (pastWeek.length >= 5 || totalMinutes >= 240) {
    return {
      type: 'rest',
      title: 'Your body needs rest today',
      reasoning: `You logged ${pastWeek.length} sessions and ${totalMinutes} minutes this week. Resting lets your body rebuild and strengthen.`,
      suggestedActivity: 'Deep recovery stretching'
    };
  } else if (pastWeek.length >= 3 || totalMinutes >= 120) {
    return {
      type: 'light',
      title: 'Maintain your momentum',
      reasoning: `You logged ${pastWeek.length} sessions this week. Keep your movement light and sustainable today.`,
      suggestedActivity: '30-minute easy jog'
    };
  }

  return {
    type: 'train',
    title: 'Ready for full training',
    reasoning: 'You have plenty of energy in reserve to push yourself and build vitality today!',
    suggestedActivity: 'Complete a full strength/cardio run'
  };
}
