import { create } from 'zustand';
import { Circle, Sparkles, Flame, Shield, Sword, Crown, Zap, LucideIcon } from 'lucide-react';

export interface CreatureStage {
  name: string;
  icon: LucideIcon;
  minXP: number;
  color: string;
  glow: string;
  size: string;
}

export const CREATURE_STAGES: CreatureStage[] = [
  { name: 'Ember',     icon: Circle,    minXP: 0,     color: '#71717A', glow: 'rgba(113,113,122,0.3)', size: 'w-10 h-10' },
  { name: 'Sparklet',  icon: Sparkles,  minXP: 100,   color: '#71717A', glow: 'rgba(113,113,122,0.3)', size: 'w-12 h-12' },
  { name: 'Flamepup',  icon: Flame,     minXP: 500,   color: '#52525B', glow: 'rgba(82,82,91,0.4)',  size: 'w-16 h-16' },
  { name: 'Blazekin',  icon: Sword,     minXP: 1500,  color: '#52525B', glow: 'rgba(82,82,91,0.4)',  size: 'w-20 h-20' },
  { name: 'Ironjaw',   icon: Shield,    minXP: 3000,  color: '#3F3F46', glow: 'rgba(63,63,70,0.4)',  size: 'w-24 h-24' },
  { name: 'Titanus',   icon: Crown,     minXP: 6000,  color: '#3F3F46', glow: 'rgba(63,63,70,0.5)',  size: 'w-28 h-28' },
  { name: 'Apex',      icon: Zap,       minXP: 10000, color: '#27272A', glow: 'rgba(39,39,42,0.6)',  size: 'w-32 h-32' },
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
