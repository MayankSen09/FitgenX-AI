import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Share2, Bell, Flame, Trophy, Route as RouteIcon, Dumbbell, ChevronRight, X } from 'lucide-react';
import { toast } from '../components/common/Toast';
import { useAppStore } from '../store/useAppStore';
import { formatTime, formatPace, getBestSplit } from '../utils/activityCalculations';
import LiveMap from '../components/map/LiveMap';
import type { Activity } from '../types/activity';

export default function Analytics() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activityIdParam = searchParams.get('activityId');

  const { workoutHistory, getStreak } = useAppStore();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(() => {
    if (activityIdParam && workoutHistory.length > 0) {
      return workoutHistory.find((a) => a.id === activityIdParam) || null;
    }
    return null;
  });

  const streak = getStreak();

  // Sort activities chronologically (newest first)
  const sortedActivities = useMemo(() => {
    return [...workoutHistory].sort((a, b) => {
      const timeA = new Date(a.startedAt || a.date).getTime();
      const timeB = new Date(b.startedAt || b.date).getTime();
      return timeB - timeA;
    });
  }, [workoutHistory]);

  // Outdoor/GPS activities for pace/route comparison
  const gpsActivities = useMemo(() => {
    return sortedActivities.filter((a) => a.type === 'run' || a.type === 'walk' || a.type === 'cycle');
  }, [sortedActivities]);

  const latestActivity = sortedActivities[0] || null;
  const previousActivity = sortedActivities[1] || null;

  const latestGps = gpsActivities[0] || null;
  const previousGps = gpsActivities[1] || null;

  // Calculate This Week's metrics (Monday 00:00:00 to now)
  const thisWeekStats = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    // Start of week: Monday (ISO week)
    const diffToMonday = (dayOfWeek + 6) % 7;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeekList = sortedActivities.filter((a) => {
      const actDate = new Date(a.startedAt || a.date);
      return actDate.getTime() >= startOfWeek.getTime();
    });

    const totalDistM = thisWeekList.reduce((acc, a) => acc + (a.distanceM || 0), 0);
    const totalMovingSec = thisWeekList.reduce((acc, a) => acc + (a.movingSeconds || a.duration || 0), 0);
    const totalCal = thisWeekList.reduce((acc, a) => acc + (a.calories || a.caloriesBurned || 0), 0);

    return {
      distanceKm: (totalDistM / 1000).toFixed(1),
      movingSec: totalMovingSec,
      calories: totalCal,
      count: thisWeekList.length,
    };
  }, [sortedActivities]);

  // Pace Comparison Trend between latest and previous GPS activity
  const paceTrend = useMemo(() => {
    if (!latestGps?.avgPaceSecPerKm || !previousGps?.avgPaceSecPerKm) {
      return null;
    }
    const diffSec = previousGps.avgPaceSecPerKm - latestGps.avgPaceSecPerKm;
    const percent = Math.round((diffSec / previousGps.avgPaceSecPerKm) * 100);
    const isFaster = diffSec > 0;
    return {
      diffSec: Math.abs(diffSec),
      percent: Math.abs(percent),
      isFaster,
      formattedText: isFaster ? `+${Math.abs(percent)}% FASTER` : `-${Math.abs(percent)}% PACE`,
    };
  }, [latestGps, previousGps]);

  // Duration Comparison
  const durationDiff = useMemo(() => {
    if (!latestActivity || !previousActivity) return null;
    const dur1 = latestActivity.movingSeconds || latestActivity.duration || 0;
    const dur2 = previousActivity.movingSeconds || previousActivity.duration || 0;
    const diff = dur2 - dur1;
    const isFaster = diff > 0;
    return {
      text: `${isFaster ? '-' : '+'}${formatTime(Math.abs(diff))}`,
      isFaster,
    };
  }, [latestActivity, previousActivity]);

  const handleShare = () => {
    if (!latestActivity) {
      navigator.clipboard.writeText(`FitGenX Performance: ${thisWeekStats.count} workouts this week, ${thisWeekStats.distanceKm} km logged!`);
      toast.success('Weekly progress copied to clipboard!', 'Shared successfully');
      return;
    }

    const typeStr = latestActivity.type.toUpperCase();
    const distStr = latestActivity.distanceM ? `${(latestActivity.distanceM / 1000).toFixed(2)} km | ` : '';
    const durStr = formatTime(latestActivity.movingSeconds || latestActivity.duration);
    const calStr = `${latestActivity.calories || latestActivity.caloriesBurned} kcal`;
    const paceStr = latestActivity.avgPaceSecPerKm
      ? ` | ${formatPace(latestActivity.avgPaceSecPerKm / 60)}/km`
      : '';

    navigator.clipboard.writeText(`My FitGenX ${typeStr}: ${distStr}${durStr}${paceStr} | ${calStr} burned!`);
    toast.success('Performance summary copied to clipboard!', 'Shared successfully');
  };

  return (
    <motion.div 
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-36 text-zinc-900 dark:text-zinc-50 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 hover:opacity-80 transition-opacity active:scale-90"
          >
            <ArrowLeft size={20} className="text-zinc-900 dark:text-zinc-50" />
          </button>
          <span className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 font-display">Analytics</span>
        </div>
        <button 
          onClick={() => toast.info(`Streak: ${streak} days active! Keep pushing.`)}
          className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800 hover:opacity-80 transition-opacity"
        >
          <Bell size={20} />
        </button>
      </nav>

      {/* Main Content */}
      <main className="pt-24 px-6 max-w-[430px] mx-auto space-y-6">
        {/* Empty State when no history exists */}
        {sortedActivities.length === 0 ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-5 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200/80 dark:border-zinc-800 shadow-sm mt-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <RouteIcon size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black font-display tracking-tight text-zinc-900 dark:text-white">
                No activities yet
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed font-medium">
                Start your first run or workout to track your pace, distance, calories, and performance trends over time.
              </p>
            </div>
            <div className="flex flex-col w-full gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => navigate('/track')}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <RouteIcon size={16} />
                Start Outdoor Activity
              </button>
              <button
                type="button"
                onClick={() => navigate('/workouts')}
                className="w-full py-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Dumbbell size={16} />
                Explore Workout Plans
              </button>
            </div>
          </div>
        ) : (
          <>
            <header className="space-y-1">
              <h1 className="font-display text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                Performance Comparison
              </h1>
              <p className="text-xs text-zinc-500 font-bold tracking-wider uppercase">
                {previousActivity ? 'Last Session vs. Latest' : 'First Recorded Session'}
              </p>
            </header>

            {/* Path Comparison / Route Cards (Real routes, no unsplash photos) */}
            {latestGps && (
              <section className="grid grid-cols-2 gap-4">
                {/* Previous Route or Placeholder */}
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="bg-white dark:bg-zinc-900 rounded-[2rem] p-4 overflow-hidden relative border border-zinc-100 dark:border-zinc-800 shadow-sm"
                >
                  <p className="text-[10px] uppercase tracking-widest font-black mb-3 text-zinc-400 truncate">
                    {previousGps ? `${previousGps.type} Path` : 'Previous Path'}
                  </p>
                  <div className="h-40 rounded-3xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
                    {previousGps && previousGps.route.length > 1 ? (
                      <LiveMap
                        isReadOnly={true}
                        initialPositions={previousGps.route.map((p) => [p.lat, p.lng])}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-zinc-400">
                        <RouteIcon size={24} className="opacity-40 mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {previousGps ? 'No GPS Route' : 'No prior run'}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-sm text-zinc-900 dark:text-white z-10">
                      {previousGps ? new Date(previousGps.startedAt || previousGps.date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'NONE'}
                    </div>
                  </div>
                </motion.div>

                {/* Latest Route */}
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="bg-white dark:bg-zinc-900 rounded-[2rem] p-4 overflow-hidden relative border-2 border-emerald-500/20 shadow-lg"
                >
                  <p className="text-[10px] uppercase tracking-widest font-black mb-3 text-emerald-500 truncate">
                    Latest {latestGps.type} Path
                  </p>
                  <div className="h-40 rounded-3xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
                    {latestGps.route.length > 1 ? (
                      <LiveMap
                        isReadOnly={true}
                        initialPositions={latestGps.route.map((p) => [p.lat, p.lng])}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-zinc-400">
                        <RouteIcon size={24} className="text-emerald-500/50 mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Manual / No GPS</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-emerald-500/95 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-sm z-10">
                      {new Date(latestGps.startedAt || latestGps.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </motion.div>
              </section>
            )}

            {/* Comparison Details Grid */}
            <section className="space-y-4">
              {/* Duration Card */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-white dark:bg-zinc-900 rounded-[2.25rem] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="text-[10px] font-black uppercase tracking-widest">Duration</span>
                  </div>
                  {durationDiff && (
                    <div className={`px-3 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-wider ${
                      durationDiff.isFaster 
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                    }`}>
                      {durationDiff.text}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase text-zinc-400 tracking-wider">Previous</p>
                    <p className="font-display text-2xl font-black text-zinc-400">
                      {previousActivity ? formatTime(previousActivity.movingSeconds || previousActivity.duration) : '—'}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">Latest</p>
                    <p className="font-display text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                      {latestActivity ? formatTime(latestActivity.movingSeconds || latestActivity.duration) : '0:00'}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Avg Pace Card */}
              {latestGps && (
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-white dark:bg-zinc-900 rounded-[2.25rem] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <span className="text-[10px] font-black uppercase tracking-widest">Avg Pace</span>
                    </div>
                    {paceTrend && (
                      <div className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-wider">
                        {paceTrend.formattedText}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase text-zinc-400 tracking-wider">Previous</p>
                      <p className="font-display text-2xl font-black text-zinc-400">
                        {previousGps?.avgPaceSecPerKm ? formatPace(previousGps.avgPaceSecPerKm / 60) : '—'}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">Latest</p>
                      <p className="font-display text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                        {latestGps.avgPaceSecPerKm ? formatPace(latestGps.avgPaceSecPerKm / 60) : '—'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Elevation Gain & Calories Sub-Grid */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-white dark:bg-zinc-900 rounded-[2.25rem] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-zinc-400 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest truncate">
                      {latestActivity?.distanceM ? 'Distance' : 'Elev Gain'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {latestActivity?.distanceM ? (
                      <p className="font-display text-3xl font-black text-zinc-900 dark:text-white leading-none">
                        {(latestActivity.distanceM / 1000).toFixed(2)}
                        <span className="text-sm font-normal ml-1">km</span>
                      </p>
                    ) : (
                      <p className="font-display text-3xl font-black text-zinc-900 dark:text-white leading-none">
                        {latestActivity?.elevationGainM !== null && latestActivity?.elevationGainM !== undefined
                          ? `${latestActivity.elevationGainM}`
                          : '—'}
                        <span className="text-sm font-normal ml-1">m</span>
                      </p>
                    )}
                    <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-wider">
                      {latestActivity?.elevationGainM !== null ? 'Honest barometric' : 'Latest session'}
                    </span>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-white dark:bg-zinc-900 rounded-[2.25rem] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-zinc-400 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest truncate">Calories</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-display text-3xl font-black text-zinc-900 dark:text-white leading-none">
                      {latestActivity ? (latestActivity.calories || latestActivity.caloriesBurned) : 0}
                      <span className="text-sm font-normal ml-1">kcal</span>
                    </p>
                    <span className="text-emerald-500 font-bold text-[9px] uppercase tracking-wider">
                      Honest MET Burn
                    </span>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* This Week's Cumulative Telemetry */}
            <section className="bg-white dark:bg-zinc-900 rounded-[2.25rem] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-black tracking-tight text-zinc-900 dark:text-white">
                    This Week's Volume
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Monday to Present
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-black">
                  <Flame size={14} />
                  <span>{streak}d Streak</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <p className="text-[9px] uppercase font-bold text-zinc-400 mb-1">Workouts</p>
                  <p className="text-base font-black font-display text-zinc-900 dark:text-white">{thisWeekStats.count}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-zinc-400 mb-1">Distance</p>
                  <p className="text-base font-black font-display text-zinc-900 dark:text-white">{thisWeekStats.distanceKm}k</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-zinc-400 mb-1">Time</p>
                  <p className="text-base font-black font-display text-zinc-900 dark:text-white">{Math.round(thisWeekStats.movingSec / 60)}m</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-zinc-400 mb-1">Burned</p>
                  <p className="text-base font-black font-display text-emerald-500">{thisWeekStats.calories}</p>
                </div>
              </div>
            </section>

            {/* Recent Activity Log with Links to Detail Views */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-black tracking-tight text-zinc-900 dark:text-white">
                  Activity History
                </h3>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {sortedActivities.length} total
                </span>
              </div>

              <div className="space-y-2.5">
                {sortedActivities.slice(0, 10).map((act) => {
                  const actDate = new Date(act.startedAt || act.date);
                  const title = act.planName || `${act.type.charAt(0).toUpperCase() + act.type.slice(1)} Session`;
                  
                  return (
                    <motion.div
                      key={act.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedActivity(act)}
                      className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between cursor-pointer shadow-sm hover:border-emerald-500/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          act.type === 'run' ? 'bg-emerald-500/10 text-emerald-500' :
                          act.type === 'cycle' ? 'bg-cyan-500/10 text-cyan-500' :
                          act.type === 'walk' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-indigo-500/10 text-indigo-500'
                        }`}>
                          {act.type === 'run' ? <RouteIcon size={18} /> :
                           act.type === 'walk' ? <RouteIcon size={18} /> :
                           act.type === 'cycle' ? <RouteIcon size={18} /> :
                           <Dumbbell size={18} />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-900 dark:text-white capitalize">{title}</p>
                          <p className="text-[10px] text-zinc-400 font-medium">
                            {actDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} • {
                              act.distanceM ? `${(act.distanceM / 1000).toFixed(2)} km • ` : ''
                            }{formatTime(act.movingSeconds || act.duration)}
                            {act.avgPaceSecPerKm ? ` • ${formatPace(act.avgPaceSecPerKm / 60)}/km` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-xs font-black text-emerald-500">
                            {act.calories || act.caloriesBurned} kcal
                          </p>
                          <p className="text-[9px] font-bold text-zinc-400">+{act.xpEarned} XP</p>
                        </div>
                        <ChevronRight size={16} className="text-zinc-400" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Actions */}
            <section className="space-y-4 pt-4">
              <motion.button 
                onClick={handleShare}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-display font-black py-4 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl hover:opacity-90 active:scale-95 transition-all duration-200"
              >
                <Share2 size={20} />
                <span className="text-xs uppercase tracking-wider">Share Achievement</span>
              </motion.button>
              
              <motion.button 
                onClick={() => navigate('/dashboard')} 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-display font-black py-3.5 rounded-[2rem] text-zinc-900 dark:text-white active:scale-95 transition-all duration-200 uppercase tracking-wider text-xs"
              >
                Done
              </motion.button>
            </section>
          </>
        )}
      </main>

      {/* ─── Activity Detail Modal with Route Replay & Splits ─── */}
      <AnimatePresence>
        {selectedActivity && (
          <ActivityDetailModal
            activity={selectedActivity}
            onClose={() => setSelectedActivity(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Detailed modal view for reviewing any historical activity with read-only map replay and splits.
 */
function ActivityDetailModal({
  activity,
  onClose,
}: {
  activity: Activity;
  onClose: () => void;
}) {
  const isGps = activity.type === 'run' || activity.type === 'walk' || activity.type === 'cycle';
  const mapPositions = (activity.route || []).map((p) => [p.lat, p.lng] as [number, number]);
  const bestSplit = getBestSplit(activity.splits || []);
  const distKm = activity.distanceM ? (activity.distanceM / 1000).toFixed(2) : null;
  const avgPace = activity.avgPaceSecPerKm ? formatPace(activity.avgPaceSecPerKm / 60) : null;

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-black/85 backdrop-blur-md p-4 pb-20 animate-fade-in flex flex-col items-center">
      <div className="w-full max-w-md space-y-4 pt-4">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-lg font-black font-display text-white capitalize">
              {activity.planName || `${activity.type} Detail`}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Date & XP Banner */}
        <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white">
              {new Date(activity.startedAt || activity.date).toLocaleDateString([], {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <p className="text-[10px] text-zinc-400">
              {new Date(activity.startedAt || activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black">
            <span>+{activity.xpEarned} XP</span>
          </div>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {distKm && (
            <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800">
              <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Distance</p>
              <p className="text-2xl font-black font-display text-white mt-1">{distKm} <span className="text-xs text-emerald-400">km</span></p>
            </div>
          )}
          <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800">
            <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Moving Time</p>
            <p className="text-2xl font-black font-display text-white mt-1">
              {formatTime(activity.movingSeconds || activity.duration)}
            </p>
          </div>
          {avgPace && (
            <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800">
              <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Avg Pace</p>
              <p className="text-2xl font-black font-display text-white mt-1">{avgPace} <span className="text-xs text-zinc-400">/km</span></p>
            </div>
          )}
          <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800">
            <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Calories</p>
            <p className="text-2xl font-black font-display text-white mt-1">
              {activity.calories || activity.caloriesBurned} <span className="text-xs text-emerald-400">kcal</span>
            </p>
          </div>
          {activity.elevationGainM !== null && activity.elevationGainM !== undefined && (
            <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800">
              <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Elevation Gain</p>
              <p className="text-2xl font-black font-display text-white mt-1">
                {activity.elevationGainM} <span className="text-xs text-zinc-400">m</span>
              </p>
            </div>
          )}
        </div>

        {/* Read-Only Route Replay Map for Outdoor Activities */}
        {isGps && (
          <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 h-56 relative shadow-lg">
            {mapPositions.length > 1 ? (
              <LiveMap
                isReadOnly={true}
                initialPositions={mapPositions}
                splits={activity.splits}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2 text-zinc-500">
                <RouteIcon size={32} className="opacity-40" />
                <p className="text-xs font-bold uppercase tracking-wider">No Route Recorded</p>
                <p className="text-[11px] text-zinc-600">Manual entry or GPS fix was not acquired.</p>
              </div>
            )}
          </div>
        )}

        {/* Splits Table for Outdoor Activities */}
        {activity.splits && activity.splits.length > 0 && (
          <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Kilometer Splits</h4>
              {bestSplit && (
                <span className="text-[10px] font-bold text-emerald-400">
                  Best: {bestSplit.km}k in {bestSplit.pace}/km
                </span>
              )}
            </div>
            <div className="space-y-2 pt-1">
              {activity.splits.map((s) => (
                <div key={s.km} className="flex justify-between items-center text-xs py-1 border-b border-zinc-800/60 last:border-none">
                  <span className="font-bold text-zinc-400">{s.km} km</span>
                  <span className="font-mono text-zinc-300">{formatTime(s.seconds)}</span>
                  <span className={`font-bold ${bestSplit?.km === s.km ? 'text-emerald-400' : 'text-zinc-200'}`}>
                    {s.pace} /km
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gym Completed Exercises & PR Badges */}
        {activity.type === 'gym' && activity.completedExercises && activity.completedExercises.length > 0 && (
          <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Completed Exercises</h4>
            <div className="space-y-3">
              {activity.completedExercises.map((ex: any, idx: number) => (
                <div key={ex.exerciseId || idx} className="p-3 rounded-2xl bg-zinc-800/60 border border-zinc-700/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{ex.exerciseName}</span>
                    <span className="text-[10px] font-bold text-zinc-400">{ex.sets?.length || 0} sets</span>
                  </div>
                  {ex.sets && (
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {ex.sets.map((s: any) => (
                        <div key={s.setNumber} className="bg-zinc-900/80 px-2 py-1 rounded-xl text-center text-[10px]">
                          <span className="text-zinc-400 font-bold block">Set {s.setNumber}</span>
                          <span className="text-white font-mono">{s.weightKg}kg × {s.reps}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PR Records */}
        {activity.newPRs && activity.newPRs.length > 0 && (
          <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
            <Trophy size={20} className="text-amber-400" />
            <div>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Personal Records Broken!
              </p>
              <p className="text-[10px] text-zinc-400">
                {activity.newPRs.map((pr: any) => `${pr.exerciseName}: ${pr.weightKg} kg`).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Close Detail
        </button>
      </div>
    </div>
  );
}

