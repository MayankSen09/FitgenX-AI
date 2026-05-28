export type ProgressEventType = 'STREAK_BROKEN' | 'GOAL_MISSED' | 'WORKOUT_SKIPPED' | 'CALORIES_UNDER' | 'STEPS_SHORT';

export interface ProgressMessage {
  title: string;
  subtitle: string;
  petState: 'resting' | 'exploring' | 'recovering';
  tone: 'warm' | 'neutral';
}

export interface MoodLog {
  sessionId: string;
  completedAt: string; 
  hour: number;
  dayOfWeek: number;
  moodRating: 1 | 2 | 3 | 4 | 5;
  perceivedEffort: 1 | 2 | 3;
  notes?: string;
}

export interface PrimeTimeResult {
  bestTimeOfDay: string;
  avgMood: number;
  totalLogs: number;
  bestHourBucket: string;
}

export interface ChurnRiskScore {
  score: number;
  level: 'low' | 'medium' | 'high';
  triggers: string[];
}

export interface RecoveryRecommendation {
  type: 'rest' | 'light' | 'train';
  title: string;
  reasoning: string;
  suggestedActivity?: string;
}

export type BodyPart = 'KNEE' | 'HIP' | 'SHOULDER' | 'LOWER_BACK' | 'ANKLE' | 'WRIST' | 'NECK' | 'HAMSTRING' | 'QUAD' | 'CALF';
export type MovementPattern = 'SQUAT' | 'HINGE' | 'PUSH' | 'PULL' | 'LUNGE' | 'CARRY' | 'RUN' | 'JUMP';

export interface Injury {
  id: string;
  bodyPart: BodyPart;
  severity: 'mild' | 'moderate' | 'severe';
  startDate: string;
  estimatedRecoveryDays: number;
  affectedMovements: MovementPattern[];
}

export interface OvertrainingAlert {
  severity: 'caution' | 'warning';
  reason: string;
  recommendation: string;
  suggestedRestDays: number;
}

export interface HydrationLog {
  time: string;
  amount: number;
  unit: 'ml' | 'oz';
}
