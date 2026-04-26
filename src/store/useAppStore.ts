import { create } from 'zustand';

export interface WorkoutHistoryEntry {
  id: string;
  planId: string;
  planName: string;
  date: string; // ISO string
  duration: number; // seconds
  caloriesBurned: number;
  exercisesCompleted: number;
  totalExercises: number;
}

interface UserStats {
  calories: number;
  steps: number;
  activeMinutes: number;
}

export interface UserProfile {
  name: string;
  college: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  focus: string;
  level: string;
  preferences: string[];
}

interface AppState {
  // User Profile & Stats
  stats: UserStats;
  goal: string | null;
  profile: UserProfile | null;

  // Workout History
  workoutHistory: WorkoutHistoryEntry[];

  // App Actions
  updateStats: (newStats: Partial<UserStats>) => void;
  resetStats: () => void;
  setGoal: (goal: string) => void;
  setProfile: (profile: UserProfile) => void;
  completeWorkout: (entry: Omit<WorkoutHistoryEntry, 'id'>) => void;

  // Active Workout Session
  activeWorkoutId: string | null;
  startWorkout: (id: string) => void;
  endWorkout: () => void;

  // Streak
  getStreak: () => number;
}

// Load persisted state from localStorage
function loadState(): Partial<AppState> {
  try {
    const saved = localStorage.getItem('fitgenx-app-state');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore parse errors
  }
  return {};
}

// Save state to localStorage
function saveState(state: Partial<AppState>) {
  try {
    const toSave = {
      stats: state.stats,
      goal: state.goal,
      workoutHistory: state.workoutHistory,
      profile: state.profile,
    };
    localStorage.setItem('fitgenx-app-state', JSON.stringify(toSave));
  } catch {
    // ignore storage errors
  }
}

const persisted = loadState();

export const useAppStore = create<AppState>((set, get) => ({
  // Default values, overridden by persisted state
  stats: persisted.stats || {
    calories: 0,
    steps: 0,
    activeMinutes: 0,
  },
  goal: persisted.goal || null,
  profile: persisted.profile || null,
  workoutHistory: persisted.workoutHistory || [],
  activeWorkoutId: null,

  // Action methods
  updateStats: (newStats) => {
    set((state) => {
      const updated = { stats: { ...state.stats, ...newStats } };
      saveState({ ...state, ...updated });
      return updated;
    });
  },

  resetStats: () => {
    const reset = { stats: { calories: 0, steps: 0, activeMinutes: 0 } };
    set(reset);
    saveState({ ...get(), ...reset });
  },

  setGoal: (goal) => {
    set({ goal });
    saveState({ ...get(), goal });
  },

  setProfile: (profile) => {
    set({ profile });
    saveState({ ...get(), profile });
  },

  completeWorkout: (entry) => {
    set((state) => {
      const newEntry: WorkoutHistoryEntry = {
        ...entry,
        id: `workout-${Date.now()}`,
      };
      const workoutHistory = [newEntry, ...state.workoutHistory];
      const stats = {
        ...state.stats,
        calories: state.stats.calories + entry.caloriesBurned,
        activeMinutes: state.stats.activeMinutes + Math.round(entry.duration / 60),
      };
      const updated = { workoutHistory, stats, activeWorkoutId: null };
      saveState({ ...state, ...updated });
      return updated;
    });
  },

  startWorkout: (id) => set({ activeWorkoutId: id }),
  endWorkout: () => set({ activeWorkoutId: null }),

  getStreak: () => {
    const history = get().workoutHistory;
    if (history.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i <= 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      const hasWorkout = history.some((w) => w.date.startsWith(dateStr));
      if (hasWorkout) {
        streak++;
      } else if (i > 0) {
        // Allow today to be missed (streak counts up to yesterday)
        break;
      }
    }
    return streak;
  },
}));
