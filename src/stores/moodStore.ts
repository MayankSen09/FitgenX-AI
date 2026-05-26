import { create } from 'zustand';
import { MoodLog, PrimeTimeResult } from '../types/behavioral';
import { analyzePrimeTime } from '../utils/primeTimeAnalysis';

interface MoodState {
  moodLogs: MoodLog[];
  primeTimeAnalysis: PrimeTimeResult | null;
  addMoodLog: (log: Omit<MoodLog, 'sessionId' | 'completedAt' | 'hour' | 'dayOfWeek'>) => void;
  reset: () => void;
}

export const useMoodStore = create<MoodState>((set) => {
  // Load state from local storage
  let persisted: Partial<MoodState> = {};
  try {
    const saved = localStorage.getItem('fitgenx-mood-store');
    if (saved) {
      persisted = JSON.parse(saved);
    }
  } catch {
    // ignore
  }

  const logs = persisted.moodLogs || [];

  return {
    moodLogs: logs,
    primeTimeAnalysis: analyzePrimeTime(logs),

    addMoodLog: (logInput) => {
      set((state) => {
        const now = new Date();
        const fullLog: MoodLog = {
          ...logInput,
          sessionId: `session-${Date.now()}`,
          completedAt: now.toISOString(),
          hour: now.getHours(),
          dayOfWeek: now.getDay(),
        };

        const moodLogs = [fullLog, ...state.moodLogs];
        const primeTimeAnalysis = analyzePrimeTime(moodLogs);

        localStorage.setItem(
          'fitgenx-mood-store',
          JSON.stringify({ moodLogs })
        );

        return { moodLogs, primeTimeAnalysis };
      });
    },

    reset: () => {
      localStorage.removeItem('fitgenx-mood-store');
      set({ moodLogs: [], primeTimeAnalysis: null });
    },
  };
});
