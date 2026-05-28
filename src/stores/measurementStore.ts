import { create } from 'zustand';

export interface MeasurementEntry {
  id: string;
  date: string;
  chest?: number;
  waist?: number;
  hips?: number;
  leftArm?: number;
  rightArm?: number;
  weight?: number;
  unit: 'cm' | 'inches';
}

interface MeasurementState {
  measurementLogs: MeasurementEntry[];
  addMeasurementEntry: (entry: Omit<MeasurementEntry, 'id' | 'date'>) => void;
  reset: () => void;
}

export const useMeasurementStore = create<MeasurementState>((set) => {
  let persisted: Partial<MeasurementState> = {};
  try {
    const saved = localStorage.getItem('fitgenx-measurement-store');
    if (saved) persisted = JSON.parse(saved);
  } catch {
    // ignore
  }

  return {
    measurementLogs: persisted.measurementLogs || [],

    addMeasurementEntry: (entry) => {
      set((state) => {
        const fullEntry: MeasurementEntry = {
          ...entry,
          id: `entry-${Date.now()}`,
          date: new Date().toISOString(),
        };
        const nextLogs = [...state.measurementLogs, fullEntry];
        localStorage.setItem(
          'fitgenx-measurement-store',
          JSON.stringify({ measurementLogs: nextLogs })
        );
        return { measurementLogs: nextLogs };
      });
    },

    reset: () => {
      localStorage.removeItem('fitgenx-measurement-store');
      set({ measurementLogs: [] });
    },
  };
});
