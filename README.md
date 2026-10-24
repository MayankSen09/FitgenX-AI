# ⚡ FitGenX

![FitGenX Hero Banner](public/assets/banner.png)

> **The Future of Human Performance.**  
> A high-performance athletic intelligence platform built for elite athletes and fitness enthusiasts.

FitGenX is a premium fitness ecosystem combining creature companion evolution, Google Gemini-powered athletic coaching, and an immersive Kinetic Editorial social experience.

---

## 🏗️ Architecture & Stack

- **Frontend Core**: React 19 + Vite (TypeScript strict mode)
- **State Management & Persistence**: Zustand store with dual-layer persistence:
  - **Source of Truth**: Google Cloud Firestore (user profile, workout history, weekly schedule, AI chat history)
  - **Offline Cache**: LocalStorage (`fitgenx-app-state`) with automated one-time migration on first login
- **Authentication**: Firebase Google Authentication with route protection (`ProtectedRoute`) and session state detection
- **AI Engine**: Google Gemini (`gemini-2.0-flash`) via:
  - Production: Vercel Serverless Function (`api/chat.ts`)
  - Development: Local Express Server (`server/index.ts`)
  - Shared Security: Sanitization, 2,000-character input caps, IP-based rate limiting, and origin allowlists (`src/lib/chatSecurity.ts`)
- **Styling & Motion**: Tailwind CSS + Framer Motion (Kinetic Editorial design system)
- **Performance**: On-demand page routes code-split via `React.lazy` and `Suspense`
- **Testing & Quality**: Vitest unit test suite (streak calculation, churn risk scoring, overtraining detection), TypeScript strict typechecking, and GitHub Actions CI workflow

---

## ✨ Core Features

### 🤖 AI Coach (Google Gemini)
- Conversational athletic conditioning assistant.
- **Structured Planning Mode**: Generates 7-day structured training splits with exercises, sets, and reps that can be directly applied and saved to the user's `weeklySchedule` in Cloud Firestore.
- **Persistent Memory**: Chat history is persisted per authenticated user in Firestore (capped at 20 messages).
- **Medical Disclaimer**: Clear non-medical-advice notice for athlete safety.

### 📅 Real Cloud-Synced Workout Planning & Tracking
- Weekly training schedule with custom workout assignment per day of week (Sunday–Saturday).
- Real-time workout player with active timers, volume tracking, and history logging synced to Firestore.

### 🐾 Creature Companion
- Digital companion evolution fueled by workout consistency.
- 7 Evolutionary Stages from Egg to Ancient Dragon with XP progression and volume multipliers.

### 📊 Transparent Demo Data Sections
To keep the application honest and transparent, certain social and commerce features currently display simulated demo data while their backend networks are developed:
- **Social Network (`/social`)**: Global community posts, story highlights, and leaderboard rankings use simulated demo athletes.
- **Marketplace (`/store` / `/marketplace`)**: Merchandise and reward redemptions deduct local Momentum Points and store redeemed vouchers in the user's inventory (no external emails are sent).

---

## 🚀 Getting Started

### 1. Prerequisites
- [Bun](https://bun.sh/) (recommended) or [Node.js](https://nodejs.org/) (v20+)
- Firebase Project with Google Auth and Cloud Firestore enabled
- Google AI Studio Gemini API Key

### 2. Installation
```bash
git clone https://github.com/MayankSen09/FitgenX-AI.git
cd FitgenX-AI
bun install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Running Locally
Run the combined frontend and backend dev servers:
```bash
bun run dev
```
Or run individually:
```bash
bun run dev:frontend   # Vite dev server on http://localhost:5173
bun run dev:backend    # Express backend on http://localhost:5000
```

### 5. Running Tests & Quality Checks
```bash
bun run test   # Run Vitest test suite
bun run lint   # Run TypeScript strict typecheck (tsc --noEmit)
bun run build  # Validate production bundle
```

---

## 🔒 Security & Rules

Cloud Firestore security rules enforce strict per-user document isolation:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /{allSubcollections=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```
Deploy rules using Firebase CLI:
```bash
bunx firebase-tools deploy --only firestore:rules
```

---

## 🛰️ Live Tracking Limits (Web vs. Native)

FitGenX uses the HTML5 Geolocation API with high-accuracy GPS polling, screen wake locks (`navigator.wakeLock`), and timestamp delta maths to record workouts accurately while the app is active.

**Important Note on Web GPS Constraints**:
- **Screen Awake Required**: Web GPS works reliably while the app tab is open and the screen is kept awake. FitGenX automatically requests a Screen Wake Lock when an outdoor session starts to prevent your screen from sleeping.
- **Background Tracking is Best-Effort**: Mobile browsers (especially iOS Safari and Chromium on Android) may throttle, suspend, or pause GPS watchers and timer intervals when the screen locks or when switching to other apps. While FitGenX timestamps preserve moving vs. paused times upon reopening, live route polyline recording cannot guarantee native background GPS fixes without a native device service.
- **Future Roadmap**: A native mobile wrapper (such as Capacitor or React Native) is planned for future phases to enable background core location services. We do not claim native Strava-level background tracking on web browsers.

---

## 🎨 Design System
FitGenX follows the **Kinetic Editorial** design language—a synthesis of high-end fashion editorial layouts and futuristic athletic telemetry.

- **Palette**: Deep Zincs (`#09090b`), Pure Whites, Emerald Accent (`#10b981`), Amber Warning
- **Typography**: Inter (UI / Data), Outfit (Headlines & Editorial Display)

---

## 📄 License
This project is licensed under the MIT License.

