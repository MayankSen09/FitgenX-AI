import { create } from 'zustand';

export interface QuickActionOption {
  label: string;
  icon: string;
  path: string;
}

export const QUICK_ACTION_OPTIONS: QuickActionOption[] = [
  { label: 'Companion', icon: 'pets', path: '/creature' },
  { label: 'AI Coach', icon: 'smart_toy', path: '/ai-coach' },
  { label: 'Track Run', icon: 'directions_run', path: '/track' },
  { label: 'Workouts', icon: 'fitness_center', path: '/workouts' },
  { label: 'Timer', icon: 'timer', path: '/timer' },
  { label: 'Challenges', icon: 'emoji_events', path: '/challenges' },
  { label: 'Analytics', icon: 'analytics', path: '/analytics' },
  { label: 'Social', icon: 'group', path: '/social' },
  { label: 'Profile', icon: 'person', path: '/profile' },
];

interface SettingsState {
  quickActionPath: string;
  setQuickActionPath: (path: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => {
  // Load from localStorage on init
  const saved = localStorage.getItem('fitgenx-quick-action');
  return {
    quickActionPath: saved || '/creature',
    setQuickActionPath: (path: string) => {
      localStorage.setItem('fitgenx-quick-action', path);
      set({ quickActionPath: path });
    },
  };
});
