import { create } from 'zustand';
import { Injury, BodyPart, MovementPattern } from '../types/behavioral';

interface InjuryState {
  activeInjury: Injury | null;
  addInjury: (bodyPart: BodyPart, severity: Injury['severity'], movements: MovementPattern[]) => void;
  clearInjury: () => void;
  reset: () => void;
}

export const useInjuryStore = create<InjuryState>((set) => {
  let persisted: Partial<InjuryState> = {};
  try {
    const saved = localStorage.getItem('fitgenx-injury-store');
    if (saved) persisted = JSON.parse(saved);
  } catch {
    // ignore
  }

  return {
    activeInjury: persisted.activeInjury || null,

    addInjury: (bodyPart, severity, movements) => {
      const injury: Injury = {
        id: `injury-${Date.now()}`,
        bodyPart,
        severity,
        startDate: new Date().toISOString(),
        estimatedRecoveryDays: severity === 'mild' ? 7 : severity === 'moderate' ? 21 : 45,
        affectedMovements: movements,
      };
      localStorage.setItem('fitgenx-injury-store', JSON.stringify({ activeInjury: injury }));
      set({ activeInjury: injury });
    },

    clearInjury: () => {
      localStorage.removeItem('fitgenx-injury-store');
      set({ activeInjury: null });
    },

    reset: () => {
      localStorage.removeItem('fitgenx-injury-store');
      set({ activeInjury: null });
    },
  };
});
