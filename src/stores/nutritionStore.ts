import { create } from 'zustand';

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  loggedAt: string;
}

interface NutritionState {
  loggedFoods: FoodItem[];
  addFood: (food: Omit<FoodItem, 'id' | 'loggedAt'>) => void;
  reset: () => void;
}

export const useNutritionStore = create<NutritionState>((set) => {
  let persisted: Partial<NutritionState> = {};
  try {
    const saved = localStorage.getItem('fitgenx-nutrition-store');
    if (saved) persisted = JSON.parse(saved);
  } catch {
    // ignore
  }

  return {
    loggedFoods: persisted.loggedFoods || [],

    addFood: (food) => {
      set((state) => {
        const fullFood: FoodItem = {
          ...food,
          id: `food-${Date.now()}`,
          loggedAt: new Date().toISOString(),
        };
        const loggedFoods = [...state.loggedFoods, fullFood];
        localStorage.setItem(
          'fitgenx-nutrition-store',
          JSON.stringify({ loggedFoods })
        );
        return { loggedFoods };
      });
    },

    reset: () => {
      localStorage.removeItem('fitgenx-nutrition-store');
      set({ loggedFoods: [] });
    },
  };
});
