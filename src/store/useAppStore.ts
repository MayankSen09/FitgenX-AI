import { create } from 'zustand'

interface UserStats {
  calories: number;
  steps: number;
  activeMinutes: number;
}

interface AppState {
  // User Profile & Stats
  stats: UserStats;
  goal: string | null;
  
  // App Actions
  updateStats: (newStats: Partial<UserStats>) => void;
  resetStats: () => void;
  setGoal: (goal: string) => void;
  completeWorkout: (calories: number) => void;

  // Active Workout Session
  activeWorkoutId: string | null;
  startWorkout: (id: string) => void;
  endWorkout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Default values
  stats: {
    calories: 12430,
    steps: 12430,
    activeMinutes: 85,
  },
  goal: null,

  activeWorkoutId: null,

  // Action methods
  updateStats: (newStats) => set((state) => ({ 
    stats: { ...state.stats, ...newStats } 
  })),

  resetStats: () => set({ 
    stats: { calories: 0, steps: 0, activeMinutes: 0 } 
  }),

  setGoal: (goal) => set({ goal }),

  completeWorkout: (caloriesBurned) => set((state) => ({
    stats: { 
      ...state.stats, 
      calories: state.stats.calories + caloriesBurned,
      activeMinutes: state.stats.activeMinutes + 45
    },
    activeWorkoutId: null
  })),

  startWorkout: (id) => set({ activeWorkoutId: id }),

  endWorkout: () => set({ activeWorkoutId: null }),
}));
