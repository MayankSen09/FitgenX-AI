import { create } from 'zustand';

interface ProteinState {
  dailyProteinGoal: number; // in grams
  todaysProtein: number; // in grams
  addProtein: (amount: number) => void;
  reset: () => void;
}

export const useProteinStore = create<ProteinState>((set) => {
  let persisted: Partial<ProteinState> = {};
  try {
    const saved = localStorage.getItem('fitgenx-protein-store');
    if (saved) persisted = JSON.parse(saved);
  } catch {
    // ignore
  }

  return {
    dailyProteinGoal: persisted.dailyProteinGoal || 140,
    todaysProtein: persisted.todaysProtein || 0,

    addProtein: (amount) => {
      set((state) => {
        const todaysProtein = state.todaysProtein + amount;
        localStorage.setItem(
          'fitgenx-protein-store',
          JSON.stringify({ dailyProteinGoal: state.dailyProteinGoal, todaysProtein })
        );
        return { todaysProtein };
      });
    },

    reset: () => {
      localStorage.removeItem('fitgenx-protein-store');
      set({ dailyProteinGoal: 140, todaysProtein: 0 });
    },
  };
});
