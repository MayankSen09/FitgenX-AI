import { create } from 'zustand';

export interface CreatureStage {
  name: string;
  emoji: string;
  minXP: number;
  color: string;
  glow: string;
  size: string;
}

export const CREATURE_STAGES: CreatureStage[] = [
  { name: 'Ember',     emoji: '🥚',  minXP: 0,     color: '#9CA3AF', glow: 'rgba(156,163,175,0.3)', size: 'text-2xl' },
  { name: 'Sparklet',  emoji: '🐣',  minXP: 100,   color: '#FBBF24', glow: 'rgba(251,191,36,0.3)',  size: 'text-2xl' },
  { name: 'Flamepup',  emoji: '🦊',  minXP: 500,   color: '#F97316', glow: 'rgba(249,115,22,0.4)',  size: 'text-3xl' },
  { name: 'Blazekin',  emoji: '🐺',  minXP: 1500,  color: '#EF4444', glow: 'rgba(239,68,68,0.4)',   size: 'text-3xl' },
  { name: 'Ironjaw',   emoji: '🦁',  minXP: 3000,  color: '#8B5CF6', glow: 'rgba(139,92,246,0.4)',  size: 'text-3xl' },
  { name: 'Titanus',   emoji: '🐲',  minXP: 6000,  color: '#06B6D4', glow: 'rgba(6,182,212,0.5)',   size: 'text-4xl' },
  { name: 'Apex',      emoji: '⚡',  minXP: 10000, color: '#F59E0B', glow: 'rgba(245,158,11,0.6)',  size: 'text-4xl' },
];

interface CreatureState {
  xp: number;
  addXP: (amount: number) => void;
  getStage: () => CreatureStage;
  getProgress: () => number; // 0-100 towards next evolution
  getNextStage: () => CreatureStage | null;
}

function loadXP(): number {
  try {
    const saved = localStorage.getItem('fitgenx-creature-xp');
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
}

export const useCreatureStore = create<CreatureState>((set, get) => ({
  xp: loadXP(),

  addXP: (amount) => {
    set((state) => {
      const newXP = state.xp + amount;
      localStorage.setItem('fitgenx-creature-xp', String(newXP));
      return { xp: newXP };
    });
  },

  getStage: () => {
    const xp = get().xp;
    let current = CREATURE_STAGES[0];
    for (const stage of CREATURE_STAGES) {
      if (xp >= stage.minXP) current = stage;
    }
    return current;
  },

  getProgress: () => {
    const xp = get().xp;
    const stages = CREATURE_STAGES;
    let currentIdx = 0;
    for (let i = 0; i < stages.length; i++) {
      if (xp >= stages[i].minXP) currentIdx = i;
    }
    if (currentIdx >= stages.length - 1) return 100; // Max level
    const currentMin = stages[currentIdx].minXP;
    const nextMin = stages[currentIdx + 1].minXP;
    return Math.min(((xp - currentMin) / (nextMin - currentMin)) * 100, 100);
  },

  getNextStage: () => {
    const xp = get().xp;
    for (const stage of CREATURE_STAGES) {
      if (xp < stage.minXP) return stage;
    }
    return null; // Already at max
  },
}));
