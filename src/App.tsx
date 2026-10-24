import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import ErrorBoundary from './components/common/ErrorBoundary.tsx';
import { ToastContainer } from './components/common/Toast.tsx';
import BottomNav from './components/layout/BottomNav.tsx';

// Routes converted to React.lazy for code splitting & on-demand loading
const Login = lazy(() => import('./pages/Login.tsx'));
const Onboarding = lazy(() => import('./pages/Onboarding.tsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.tsx'));
const WorkoutPlans = lazy(() => import('./pages/WorkoutPlans.tsx'));
const WorkoutDetail = lazy(() => import('./pages/WorkoutDetail.tsx'));
const WorkoutPlayer = lazy(() => import('./pages/WorkoutPlayer.tsx'));
const Profile = lazy(() => import('./pages/Profile.tsx'));
const Analytics = lazy(() => import('./pages/Analytics.tsx'));
const TimerTool = lazy(() => import('./pages/TimerTool.tsx'));
const Tracking = lazy(() => import('./pages/Tracking.tsx'));
const Challenges = lazy(() => import('./pages/Challenges.tsx'));
const AIAssistant = lazy(() => import('./pages/AIAssistant.tsx'));
const SocialFeeds = lazy(() => import('./pages/SocialFeeds.tsx'));
const Settings = lazy(() => import('./pages/Settings.tsx'));
const Creature = lazy(() => import('./pages/Creature.tsx'));
const CalendarView = lazy(() => import('./pages/CalendarView.tsx'));
const PlanningView = lazy(() => import('./pages/PlanningView.tsx'));
const Marketplace = lazy(() => import('./pages/Marketplace.tsx'));
const ExerciseDetail = lazy(() => import('./pages/ExerciseDetail.tsx'));
const NotFound = lazy(() => import('./pages/NotFound.tsx'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const showNav = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/onboarding';

  return (
    <>
      <ToastContainer />
      <Suspense fallback={<PageLoader />}>
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Public Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/onboarding" element={<Onboarding />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/workouts" element={<ProtectedRoute><WorkoutPlans /></ProtectedRoute>} />
              <Route path="/workout-detail/:id" element={<ProtectedRoute><WorkoutDetail /></ProtectedRoute>} />
              <Route path="/workout-player/:id" element={<ProtectedRoute><WorkoutPlayer /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/timer" element={<ProtectedRoute><TimerTool /></ProtectedRoute>} />
              <Route path="/track" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
              <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
              <Route path="/ai-coach" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
              <Route path="/social" element={<ProtectedRoute><SocialFeeds /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/creature" element={<ProtectedRoute><Creature /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
              <Route path="/planning" element={<ProtectedRoute><PlanningView /></ProtectedRoute>} />
              <Route path="/store" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
              <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
              <Route path="/exercise-detail/:id" element={<ProtectedRoute><ExerciseDetail /></ProtectedRoute>} />

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </ErrorBoundary>
      </Suspense>
      {showNav && <BottomNav />}
    </>
  );
}
