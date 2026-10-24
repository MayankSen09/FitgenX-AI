/**
 * FitGenX Unified Activity Model
 * Defines the single source of truth for all tracked sessions (Runs, Walks, Cycles, and Gym Workouts).
 */

export type ActivityType = 'run' | 'walk' | 'cycle' | 'gym';

export interface RoutePoint {
  lat: number;
  lng: number;
  t: number; // Unix epoch timestamp (ms)
  accuracy: number; // Accuracy radius in meters
  speed: number | null; // Speed in m/s (smoothed)
  altitude?: number | null; // Altitude in meters above sea level (sane value or null)
}

export interface KmSplit {
  km: number;
  seconds: number;
  pace: string; // Formatted mm:ss per km
}

export interface LoggedSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  isPR?: boolean;
}

export interface CompletedExerciseLog {
  exerciseId: string;
  name: string;
  sets: LoggedSet[];
  maxWeightKg?: number;
  totalVolumeKg?: number;
}

export interface ExercisePRRecord {
  exerciseId: string;
  exerciseName: string;
  maxWeightKg: number;
  bestVolumeKg: number;
  achievedAt: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  startedAt: string; // ISO string
  endedAt: string;   // ISO string
  date: string;      // ISO string (matches startedAt for backward compatibility)
  duration: number;  // Moving seconds (for backward compatibility)
  movingSeconds: number;
  pausedSeconds: number;
  distanceM: number;
  calories: number;
  caloriesBurned: number; // Same as calories (backward compatibility)
  avgPaceSecPerKm: number | null; // Null for gym
  splits: KmSplit[];
  route: RoutePoint[];
  elevationGainM: number | null; // Real GPS altitude delta or null (never fabricated)
  mood: string | null;
  xpEarned: number;
  
  // Gym-specific fields
  planId?: string | null;
  planName?: string | null;
  exercisesCompleted?: number;
  totalExercises?: number;
  completedExercises?: CompletedExerciseLog[];
  newPRs?: Array<{
    exerciseName: string;
    type: 'weight' | 'volume';
    value: number;
  }>;
}
