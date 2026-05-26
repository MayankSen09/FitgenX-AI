import { create } from 'zustand';

interface TravelState {
  isTraveling: boolean;
  travelStartDate: string | null;
  toggleTravelMode: () => void;
  reset: () => void;
}

export const useTravelStore = create<TravelState>((set) => {
  let persisted: Partial<TravelState> = {};
  try {
    const saved = localStorage.getItem('fitgenx-travel-store');
    if (saved) persisted = JSON.parse(saved);
  } catch {
    // ignore
  }

  return {
    isTraveling: persisted.isTraveling || false,
    travelStartDate: persisted.travelStartDate || null,

    toggleTravelMode: () => {
      set((state) => {
        const nextTraveling = !state.isTraveling;
        const travelStartDate = nextTraveling ? new Date().toISOString() : null;
        localStorage.setItem(
          'fitgenx-travel-store',
          JSON.stringify({ isTraveling: nextTraveling, travelStartDate })
        );
        return { isTraveling: nextTraveling, travelStartDate };
      });
    },

    reset: () => {
      localStorage.removeItem('fitgenx-travel-store');
      set({ isTraveling: false, travelStartDate: null });
    },
  };
});
