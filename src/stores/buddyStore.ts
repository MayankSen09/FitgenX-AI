import { create } from 'zustand';

export interface BuddyProfile {
  userId: string;
  name: string;
  avatar: string;
  timezone: string;
  workoutDays: number[];
  primaryGoal: string;
  matchScore: number;
  lastActive: string;
}

export interface BuddyMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

interface BuddyState {
  myBuddy: BuddyProfile | null;
  messages: BuddyMessage[];
  setBuddy: (buddy: BuddyProfile | null) => void;
  sendMessage: (text: string) => void;
  reset: () => void;
}

export const useBuddyStore = create<BuddyState>((set) => {
  let persisted: Partial<BuddyState> = {};
  try {
    const saved = localStorage.getItem('fitgenx-buddy-store');
    if (saved) persisted = JSON.parse(saved);
  } catch {
    // ignore
  }

  return {
    myBuddy: persisted.myBuddy || null,
    messages: persisted.messages || [],

    setBuddy: (buddy) => {
      set((state) => {
        localStorage.setItem(
          'fitgenx-buddy-store',
          JSON.stringify({ myBuddy: buddy, messages: state.messages })
        );
        return { myBuddy: buddy };
      });
    },

    sendMessage: (text) => {
      set((state) => {
        const nextMessage: BuddyMessage = {
          id: `msg-${Date.now()}`,
          senderId: 'me',
          text,
          time: new Date().toISOString(),
        };
        const nextMessages = [...state.messages, nextMessage];
        localStorage.setItem(
          'fitgenx-buddy-store',
          JSON.stringify({ myBuddy: state.myBuddy, messages: nextMessages })
        );
        return { messages: nextMessages };
      });
    },

    reset: () => {
      localStorage.removeItem('fitgenx-buddy-store');
      set({ myBuddy: null, messages: [] });
    },
  };
});
