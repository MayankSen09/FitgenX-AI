import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Login from './pages/Login.tsx';
import Onboarding from './pages/Onboarding.tsx';
import Dashboard from './pages/Dashboard.tsx';
import WorkoutPlans from './pages/WorkoutPlans.tsx';
import AIAssistant from './pages/AIAssistant.tsx';
import SocialFeeds from './pages/SocialFeeds.tsx';
import WorkoutDetail from './pages/WorkoutDetail.tsx';
import WorkoutPlayer from './pages/WorkoutPlayer.tsx';
import Profile from './pages/Profile.tsx';
import Analytics from './pages/Analytics.tsx';
import TimerTool from './pages/TimerTool.tsx';
import Challenges from './pages/Challenges.tsx';
import Tracking from './pages/Tracking.tsx';
import Settings from './pages/Settings.tsx';
import Creature from './pages/Creature.tsx';
import CalendarView from './pages/CalendarView.tsx';
import PlanningView from './pages/PlanningView.tsx';
import Marketplace from './pages/Marketplace.tsx';
import ExerciseDetail from './pages/ExerciseDetail.tsx';
import Notifications from './pages/Notifications.tsx';
import PremiumPlans from './pages/PremiumPlans.tsx';
import BuddyMatch from './pages/BuddyMatch.tsx';
import BarcodeMealScanner from './pages/BarcodeMealScanner.tsx';
import MeasurementsPage from './pages/MeasurementsPage.tsx';
import CoachMarketplace from './pages/CoachMarketplace.tsx';
import RoadmapPage from './pages/RoadmapPage.tsx';
import CustomRoadmapBuilder from './pages/CustomRoadmapBuilder.tsx';
import { ToastContainer } from './components/common/Toast.tsx';
import BottomNav from './components/layout/BottomNav.tsx';

export default function App() {
  const location = useLocation();
  const showNav = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/onboarding';

  return (
    <>
      <ToastContainer />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workouts" element={<WorkoutPlans />} />
          <Route path="/workout-detail/:id" element={<WorkoutDetail />} />
          <Route path="/workout-player/:id" element={<WorkoutPlayer />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/timer" element={<TimerTool />} />
          <Route path="/track" element={<Tracking />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/ai-coach" element={<AIAssistant />} />
          <Route path="/social" element={<SocialFeeds />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/creature" element={<Creature />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/planning" element={<PlanningView />} />
          <Route path="/store" element={<Marketplace />} />
          <Route path="/exercise-detail/:id" element={<ExerciseDetail />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/plans" element={<PremiumPlans />} />
          <Route path="/buddy" element={<BuddyMatch />} />
          <Route path="/barcode" element={<BarcodeMealScanner />} />
          <Route path="/measurements" element={<MeasurementsPage />} />
          <Route path="/coaches" element={<CoachMarketplace />} />
          <Route path="/journey" element={<RoadmapPage />} />
          <Route path="/journey/builder" element={<CustomRoadmapBuilder />} />
        </Routes>
      </AnimatePresence>
      {showNav && <BottomNav />}
    </>
  );
}
