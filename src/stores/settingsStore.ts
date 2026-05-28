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
  { label: 'Journey', icon: 'route', path: '/journey' },
];

/**
 * Global state shape for application-wide user settings,
 * synchronized with local storage.
 */
interface SettingsState {
  quickActionPath: string;
  tokens: number;
  inventory: any[];
  setQuickActionPath: (path: string) => void;
  setTokens: (tokens: number) => void;
  addReward: (reward: any) => void;
}

export const useSettingsStore = create<SettingsState>((set) => {
  // Load from localStorage on init
  const savedPath = localStorage.getItem('fitgenx-quick-action');
  const savedTokens = localStorage.getItem('fitgenx-tokens');
  const savedInventory = localStorage.getItem('fitgenx-inventory');

  return {
    quickActionPath: savedPath || '/creature',
    tokens: savedTokens ? parseInt(savedTokens) : 2450,
    inventory: savedInventory ? JSON.parse(savedInventory) : [],
    setQuickActionPath: (path: string) => {
      localStorage.setItem('fitgenx-quick-action', path);
      set({ quickActionPath: path });
    },
    setTokens: (tokens: number) => {
      localStorage.setItem('fitgenx-tokens', tokens.toString());
      set({ tokens });
    },
    addReward: (reward: any) => {
      set((state) => {
        const newInventory = [...state.inventory, { ...reward, redeemedAt: new Date().toLocaleDateString() }];
        localStorage.setItem('fitgenx-inventory', JSON.stringify(newInventory));
        return { inventory: newInventory };
      });
    },
  };
});
