import { create } from 'zustand';

interface ChurnState {
  lastChurnCheck: string | null;
  shownInterventions: string[];
  markCheck: () => void;
  addIntervention: (type: string) => void;
  reset: () => void;
}

export const useChurnStore = create<ChurnState>((set, get) => {
  let persisted: Partial<ChurnState> = {};
  try {
    const saved = localStorage.getItem('fitgenx-churn-store');
    if (saved) {
      persisted = JSON.parse(saved);
    }
  } catch {
    // ignore
  }

  return {
    lastChurnCheck: persisted.lastChurnCheck || null,
    shownInterventions: persisted.shownInterventions || [],

    markCheck: () => {
      set(() => {
        const lastChurnCheck = new Date().toISOString();
        localStorage.setItem(
          'fitgenx-churn-store',
          JSON.stringify({ ...get(), lastChurnCheck })
        );
        return { lastChurnCheck };
      });
    },

    addIntervention: (type) => {
      set((state) => {
        const shownInterventions = [...state.shownInterventions, type];
        localStorage.setItem(
          'fitgenx-churn-store',
          JSON.stringify({ ...get(), shownInterventions })
        );
        return { shownInterventions };
      });
    },

    reset: () => {
      localStorage.removeItem('fitgenx-churn-store');
      set({ lastChurnCheck: null, shownInterventions: [] });
    },
  };
});
