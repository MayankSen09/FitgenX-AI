# Aura FitGenX: Software Coding & Architecture Documentation

This document outlines the technical architecture, directory structure, core modules, and data flow of the Aura FitGenX application. It serves as a comprehensive guide for developers and evaluators to understand the underlying software engineering principles used in this project.

---

## 1. System Architecture Overview
Aura FitGenX is built using a modern, decoupled architecture designed for high performance and rapid iteration.
* **Frontend Layer:** Built with **React 19** and **TypeScript**, providing a strictly-typed, component-based UI. 
* **Styling Engine:** **Tailwind CSS** handles all utility-first styling.
* **State Management:** **Zustand** is utilized for global state handling.
* **AI Integration Layer:** The application communicates with the **Google Gemini API** (`gemini-flash-latest`) to provide real-time coaching.
* **Build Tool:** **Vite** coupled with **Bun** provides lightning-fast hot module replacement.

---

## 2. Project Directory Structure
The application follows a modular, feature-based directory structure inside the `src/` folder:

```text
genx_one/
├── api/                # Serverless functions / backend logic
│   └── chat.ts         # Google Gemini AI API integration route
├── src/
│   ├── components/     # Reusable UI building blocks
│   ├── data/           # Static data and mock databases
│   ├── pages/          # Top-level route components (Views)
│   ├── store/          # Zustand global state configurations
│   ├── App.tsx         # Main application router
│   └── index.css       # Tailwind directives
├── package.json        # Project metadata
└── vite.config.ts      # Vite bundler configuration
```

---

## 3. Core Modules & Implementation References

### A. Global State Management (`src/store/useAppStore.ts`)
Instead of prop-drilling, the app uses **Zustand** to expose a customized global store. State is synced directly to localStorage to persist user progression.

**Code Reference (Zustand Implementation):**
```typescript
import { create } from 'zustand';

// Zustand store definition for handling workout persistence
export const useAppStore = create<AppState>((set, get) => ({
  stats: persisted.stats || { calories: 0, steps: 0, activeMinutes: 0 },
  workoutHistory: persisted.workoutHistory || [],
  activeWorkoutId: null,

  // Action to log a completed workout and calculate XP/Calories
  completeWorkout: (entry) => {
    set((state) => {
      const newEntry: WorkoutHistoryEntry = {
        ...entry,
        id: `workout-${Date.now()}`,
      };
      const workoutHistory = [newEntry, ...state.workoutHistory];
      const stats = {
        ...state.stats,
        calories: state.stats.calories + entry.caloriesBurned,
        activeMinutes: state.stats.activeMinutes + Math.round(entry.duration / 60),
      };
      const updated = { workoutHistory, stats, activeWorkoutId: null };
      
      // Persist state to local storage
      saveState({ ...state, ...updated });
      return updated;
    });
  },
}));
```

### B. The Workout Engine (`src/pages/WorkoutPlayer.tsx`)
This is the core functional module. It dynamically renders embedded YouTube iframes for instructional videos if available, and uses React state to track live elapsed timers.

**Code Reference (Video Rendering Engine):**
```tsx
{/* Main Player Area - Responsive Video Container */}
<div className="relative w-[calc(100%-2rem)] shrink-0 aspect-[4/5] max-h-[50vh] bg-bg-elevated rounded-[3rem] overflow-hidden shadow-2xl mb-8 group mx-auto">
   {currentEx.videoUrl ? (
      {/* Dynamic YouTube Video Iframe */}
      <iframe
        className="absolute inset-0 w-full h-full"
        src={currentEx.videoUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ border: 'none' }}
      />
   ) : (
      {/* Fallback Image Render */}
      <img src={currentEx.image} alt={currentEx.name} />
   )}
   
   {/* Gradient Overlay for Text Readability */}
   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

   {/* On-Screen Display Text (Title, Muscle Group) */}
   <div className="absolute bottom-8 left-8 right-8 flex flex-col items-start pointer-events-none">
      <h1 className="text-3xl font-extrabold text-white mb-1 leading-none">{currentEx.name}</h1>
      <p className="text-white/60 font-medium text-sm">{currentEx.muscle} • {currentEx.equipment}</p>
   </div>
</div>
```

### C. AI Virtual Coach (`api/chat.ts`)
A secure serverless endpoint that interfaces with the `GoogleGenerativeAI` client using an API key stored securely in `.env`.

**Code Reference (Serverless Endpoint):**
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// System prompt to lock the LLM into the required coaching persona
const INITIAL_CHAT_PROMPT = `You are the "Aura AI Coach", a premium, high-performance athletic intelligence assistant. Your tone is professional, encouraging, data-driven.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const API_KEY = process.env.VITE_GEMINI_API_KEY;

  const { prompt, history = [] } = req.body;

  try {
    // Initialize the Gemini Flash model for rapid response times
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: INITIAL_CHAT_PROMPT,
    });

    const chat = model.startChat({
      history: history,
      generationConfig: { maxOutputTokens: 500 },
    });

    const result = await chat.sendMessage(prompt);
    res.status(200).json({ response: result.response.text() });
  } catch (error: any) {
    res.status(500).json({ error: 'Core logic error. Reboot required.' });
  }
}
```

### D. Interactive Social Stories (`src/components/StoryViewer.tsx`)
A complex UI component that mimics Instagram Stories using `framer-motion` for animations and custom `setInterval` logic for progress tracking.

**Code Reference (Timing & Touch Gesture Logic):**
```typescript
  // Progress tracking interval that pauses on touch/hold
  useEffect(() => {
    if (isPaused) {
      clearTimer();
      return;
    }

    const step = 100 / (segmentDuration / 50);
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextSegment();
          return 0;
        }
        return prev + step;
      });
    }, 50);

    return clearTimer;
  }, [currentSegmentIndex, isPaused, segmentDuration, nextSegment, clearTimer]);

  // Touch/Mouse event handlers to pause the story progress
  return (
    <div 
      className="absolute inset-0"
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="absolute top-0 left-0 w-1/2 h-full" onClick={handleTapLeft} />
      <div className="absolute top-0 right-0 w-1/2 h-full" onClick={handleTapRight} />
    </div>
  );
```

---

## 4. Setup and Installation Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/MayankSen09/FitgenX-AI.git
   cd FitgenX-AI
   ```
2. **Install Dependencies:**
   ```bash
   bun install
   ```
3. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
4. **Start the Development Server:**
   ```bash
   bun run dev
   ```
