import type { Exercise } from './exercises';
import { EXERCISES } from './exercises';

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  type: 'Strength' | 'Cardio' | 'HIIT' | 'Mobility' | 'Core';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  calorieEstimate: number;
  exerciseIds: string[];
  image: string;
}

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'push-day',
    name: 'Push Day',
    description: 'Chest, shoulders, and triceps focused compound and isolation work.',
    type: 'Strength',
    difficulty: 'Intermediate',
    duration: '50 min',
    calorieEstimate: 380,
    exerciseIds: ['flat-bench-press', 'incline-dumbbell-press', 'overhead-press', 'lateral-raises', 'tricep-dips', 'rope-pushdown'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format',
  },
  {
    id: 'pull-day',
    name: 'Pull Day',
    description: 'Back and biceps training with heavy compounds and targeted isolation.',
    type: 'Strength',
    difficulty: 'Intermediate',
    duration: '50 min',
    calorieEstimate: 360,
    exerciseIds: ['barbell-row', 'lat-pulldown', 'seated-cable-row', 'face-pulls', 'barbell-curl', 'hammer-curls'],
    image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=800&auto=format',
  },
  {
    id: 'leg-day',
    name: 'Leg Day',
    description: 'Quads, hamstrings, glutes, and calves — the foundation of real strength.',
    type: 'Strength',
    difficulty: 'Intermediate',
    duration: '55 min',
    calorieEstimate: 450,
    exerciseIds: ['barbell-squat', 'romanian-deadlift', 'leg-press', 'walking-lunges', 'leg-curl', 'calf-raises'],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format',
  },
  {
    id: 'upper-body-power',
    name: 'Upper Body Power',
    description: 'High-intensity compound upper body session for maximum strength gains.',
    type: 'Strength',
    difficulty: 'Advanced',
    duration: '45 min',
    calorieEstimate: 420,
    exerciseIds: ['flat-bench-press', 'overhead-press', 'barbell-row', 'pull-ups', 'tricep-dips', 'barbell-curl'],
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format',
  },
  {
    id: 'full-body-strength',
    name: 'Full Body Strength',
    description: 'Hit every major muscle group in one balanced, efficient session.',
    type: 'Strength',
    difficulty: 'Beginner',
    duration: '45 min',
    calorieEstimate: 400,
    exerciseIds: ['barbell-squat', 'flat-bench-press', 'barbell-row', 'overhead-press', 'walking-lunges', 'plank'],
    image: 'https://images.unsplash.com/photo-1534368786749-b63e05c92717?w=800&auto=format',
  },
  {
    id: 'core-crusher',
    name: 'Core Crusher',
    description: 'Targeted abdominal and core stability workout for a steel midsection.',
    type: 'Core',
    difficulty: 'Intermediate',
    duration: '25 min',
    calorieEstimate: 200,
    exerciseIds: ['plank', 'hanging-leg-raise', 'russian-twists', 'bicycle-crunches', 'dead-bugs'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format',
  },
  {
    id: 'hiit-blast',
    name: 'HIIT Cardio Blast',
    description: 'Maximum calorie burn with explosive full-body movements.',
    type: 'HIIT',
    difficulty: 'Advanced',
    duration: '30 min',
    calorieEstimate: 500,
    exerciseIds: ['burpees', 'mountain-climbers', 'jump-squats', 'kettlebell-swings', 'box-jumps'],
    image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800&auto=format',
  },
  {
    id: 'arm-day',
    name: 'Arm Blaster',
    description: 'Biceps and triceps superset workout for sleeve-busting arms.',
    type: 'Strength',
    difficulty: 'Beginner',
    duration: '35 min',
    calorieEstimate: 250,
    exerciseIds: ['barbell-curl', 'hammer-curls', 'tricep-dips', 'overhead-tricep-extension', 'rope-pushdown'],
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format',
  },
];

// Resolve exercise IDs to full Exercise objects
export function getWorkoutExercises(plan: WorkoutPlan): Exercise[] {
  return plan.exerciseIds
    .map((id) => EXERCISES.find((e) => e.id === id))
    .filter((e): e is Exercise => e !== undefined);
}

export function getWorkoutPlanById(id: string): WorkoutPlan | undefined {
  return WORKOUT_PLANS.find((p) => p.id === id);
}

// Simple weekly schedule rotation
const WEEKLY_SCHEDULE = ['push-day', 'pull-day', 'leg-day', 'upper-body-power', 'full-body-strength', 'hiit-blast', 'core-crusher'];

export function getTodaysWorkouts(): WorkoutPlan[] {
  const dayOfWeek = new Date().getDay(); // 0=Sun, 1=Mon, ...
  const primaryId = WEEKLY_SCHEDULE[dayOfWeek % WEEKLY_SCHEDULE.length];
  const secondaryId = WEEKLY_SCHEDULE[(dayOfWeek + 1) % WEEKLY_SCHEDULE.length];
  return WORKOUT_PLANS.filter((p) => p.id === primaryId || p.id === secondaryId);
}
