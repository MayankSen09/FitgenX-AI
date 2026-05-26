import { create } from 'zustand';
import { HydrationLog } from '../types/behavioral';

interface HydrationState {
  dailyTarget: number; // in ml
  currentIntake: number; // in ml
  logs: HydrationLog[];
  addIntake: (amount: number) => void;
  reset: () => void;
}

export const useHydrationStore = create<HydrationState>((set) => {
  let persisted: Partial<HydrationState> = {};
  try {
    const saved = localStorage.getItem('fitgenx-hydration-store');
    if (saved) persisted = JSON.parse(saved);
  } catch {
    // ignore
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const logs = persisted.logs || [];
  const todaysLogs = logs.filter(l => l.time.startsWith(todayStr));
  const currentIntake = todaysLogs.reduce((acc, l) => acc + l.amount, 0);

  return {
    dailyTarget: persisted.dailyTarget || 2500,
    currentIntake,
    logs,

    addIntake: (amount) => {
      set((state) => {
        const fullLog: HydrationLog = {
          time: new Date().toISOString(),
          amount,
          unit: 'ml'
        };
        const nextLogs = [...state.logs, fullLog];
        localStorage.setItem(
          'fitgenx-hydration-store',
          JSON.stringify({ dailyTarget: state.dailyTarget, logs: nextLogs })
        );
        return { logs: nextLogs, currentIntake: state.currentIntake + amount };
      });
    },

    reset: () => {
      localStorage.removeItem('fitgenx-hydration-store');
      set({ dailyTarget: 2500, currentIntake: 0, logs: [] });
    },
  };
});
