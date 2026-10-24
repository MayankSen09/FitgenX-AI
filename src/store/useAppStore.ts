import { create } from 'zustand';
import { calculateStreak } from '../utils/streak.ts';
import { useCreatureStore } from '../stores/creatureStore.ts';
import { syncFieldToFirestore } from '../services/gymFirestoreService';
import type { Activity, ActivityType } from '../types/activity';

export type { Activity, ActivityType };

// Kept for backward compatibility across existing views
export type WorkoutHistoryEntry = Activity;

export interface UserStats {
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
  activityLevel: string;
  fitnessHistory: string;
  workoutFrequency: string;
  medicalConditions: string;
}

interface AppState {
  // User Profile & Stats
  stats: UserStats;
  goal: string | null;
  profile: UserProfile | null;

  // Single Activity Model (Unified history for runs, walks, cycles, and gym)
  workoutHistory: Activity[];

  // Weekly Schedule (Day index 0-6 -> Workout Plan ID)
  weeklySchedule: string[];

  // App Actions
  updateStats: (newStats: Partial<UserStats>) => void;
  resetStats: () => void;
  setGoal: (goal: string) => void;
  setProfile: (profile: UserProfile) => void;
  
  // Unified Activity Logging
  addActivity: (activity: Activity) => void;
  completeWorkout: (entry: {
    planId: string;
    planName: string;
    date: string;
    duration: number;
    caloriesBurned: number;
    exercisesCompleted: number;
    totalExercises: number;
    completedExercises?: any[];
    newPRs?: any[];
  }) => void;

  // Active Workout Session
  activeWorkoutId: string | null;
  startWorkout: (id: string) => void;
  endWorkout: () => void;

  // Streak & History helpers
  getStreak: () => number;
  getActivityById: (id: string) => Activity | undefined;

  // Schedule Actions
  updateSchedule: (dayIndex: number, planId: string) => void;
  setWeeklySchedule: (schedule: string[]) => void;
}

// Migrate legacy separate 'workout_history' localStorage key if present
function migrateLegacyHistory(): Activity[] {
  try {
    const legacyRaw = localStorage.getItem('workout_history');
    if (!legacyRaw) return [];
    const legacy = JSON.parse(legacyRaw);
    if (!Array.isArray(legacy)) return [];

    const migrated: Activity[] = legacy.map((item: any, idx: number) => {
      const distM = typeof item.distance === 'number'
        ? item.distance * 1000
        : parseFloat(item.distance || '0') * 1000;
      
      // Parse duration if formatted mm:ss or number
      let durSec = 0;
      if (typeof item.duration === 'number') {
        durSec = item.duration;
      } else if (typeof item.duration === 'string') {
        const parts = item.duration.split(':').map(Number);
        if (parts.length === 3) durSec = parts[0] * 3600 + parts[1] * 60 + parts[2];
        else if (parts.length === 2) durSec = parts[0] * 60 + parts[1];
      }

      return {
        id: item.id ? String(item.id) : `legacy-run-${Date.now()}-${idx}`,
        type: (item.type?.toLowerCase() === 'walk' ? 'walk' : item.type?.toLowerCase() === 'cycle' ? 'cycle' : 'run') as ActivityType,
        startedAt: item.date || new Date().toISOString(),
        endedAt: item.date || new Date().toISOString(),
        date: item.date || new Date().toISOString(),
        duration: durSec,
        movingSeconds: durSec,
        pausedSeconds: 0,
        distanceM: isNaN(distM) ? 0 : distM,
        calories: item.calories || 0,
        caloriesBurned: item.calories || 0,
        avgPaceSecPerKm: distM > 0 ? Math.round(durSec / (distM / 1000)) : null,
        splits: [],
        route: [],
        elevationGainM: null,
        mood: null,
        xpEarned: 50 + Math.floor((isNaN(distM) ? 0 : distM) / 1000) * 20,
      };
    });

    // Remove legacy parallel key once safely extracted
    localStorage.removeItem('workout_history');
    return migrated;
  } catch {
    return [];
  }
}

// Load persisted state from localStorage
function loadState(): Partial<AppState> {
  try {
    const saved = localStorage.getItem('fitgenx-app-state');
    const legacy = migrateLegacyHistory();

    if (saved) {
      const parsed = JSON.parse(saved);
      const combinedHistory = [...(parsed.workoutHistory || [])];

      // Merge migrated legacy activities if not already present
      for (const leg of legacy) {
        if (!combinedHistory.some((h) => h.id === leg.id)) {
          combinedHistory.push(leg);
        }
      }

      return {
        ...parsed,
        workoutHistory: combinedHistory,
      };
    } else if (legacy.length > 0) {
      return { workoutHistory: legacy };
    }
  } catch {
    // ignore parse errors
  }
  return {};
}

// Save state to localStorage (offline cache) and sync to Firestore
function saveState(state: Partial<AppState>) {
  try {
    const toSave = {
      stats: state.stats,
      goal: state.goal,
      workoutHistory: state.workoutHistory,
      profile: state.profile,
      weeklySchedule: state.weeklySchedule,
    };
    localStorage.setItem('fitgenx-app-state', JSON.stringify(toSave));
    
    // Sync to Firestore for the authenticated user
    syncFieldToFirestore(toSave);
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
  weeklySchedule: persisted.weeklySchedule || [
    'push-day',
    'pull-day',
    'leg-day',
    'upper-body-power',
    'full-body-strength',
    'hiit-blast',
    'core-crusher',
  ],
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

  // Save ONE activity through the unified store
  addActivity: (activity: Activity) => {
    set((state) => {
      // Prepend the new activity
      const workoutHistory = [activity, ...state.workoutHistory];

      // Update dashboard stats
      const addedSteps = activity.type === 'walk'
        ? Math.round(activity.distanceM * 1.3)
        : activity.type === 'run'
        ? Math.round(activity.distanceM * 1.05)
        : 0;

      const stats: UserStats = {
        calories: state.stats.calories + (activity.calories || 0),
        activeMinutes: state.stats.activeMinutes + Math.round((activity.movingSeconds || 0) / 60),
        steps: state.stats.steps + addedSteps,
      };

      // Award creature companion XP
      if (activity.xpEarned > 0) {
        useCreatureStore.getState().addXP(activity.xpEarned);
      }

      const updated = { workoutHistory, stats, activeWorkoutId: null };
      saveState({ ...state, ...updated });
      return updated;
    });
  },

  completeWorkout: (entry) => {
    // Adapt gym workout to the unified Activity schema
    const xpEarned = 50 + (entry.exercisesCompleted * 25);

    const activity: Activity = {
      id: `workout-${Date.now()}`,
      type: 'gym',
      planId: entry.planId,
      planName: entry.planName,
      startedAt: entry.date,
      endedAt: new Date().toISOString(),
      date: entry.date,
      duration: entry.duration,
      movingSeconds: entry.duration,
      pausedSeconds: 0,
      distanceM: 0,
      calories: entry.caloriesBurned,
      caloriesBurned: entry.caloriesBurned,
      avgPaceSecPerKm: null,
      splits: [],
      route: [],
      elevationGainM: null,
      mood: null,
      xpEarned,
      exercisesCompleted: entry.exercisesCompleted,
      totalExercises: entry.totalExercises,
      completedExercises: entry.completedExercises || [],
      newPRs: entry.newPRs || [],
    };

    get().addActivity(activity);
  },

  startWorkout: (id) => set({ activeWorkoutId: id }),
  endWorkout: () => set({ activeWorkoutId: null }),

  getStreak: () => {
    return calculateStreak(get().workoutHistory);
  },

  getActivityById: (id: string) => {
    return get().workoutHistory.find((a) => a.id === id);
  },

  updateSchedule: (dayIndex, planId) => {
    set((state) => {
      const newSchedule = [...state.weeklySchedule];
      newSchedule[dayIndex] = planId;
      const updated = { weeklySchedule: newSchedule };
      saveState({ ...state, ...updated });
      return updated;
    });
  },

  setWeeklySchedule: (newSchedule) => {
    set((state) => {
      const updated = { weeklySchedule: newSchedule };
      saveState({ ...state, ...updated });
      return updated;
    });
  },
}));
