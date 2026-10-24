import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from '../components/layout/BottomNav';
import LiveMap from '../components/map/LiveMap';
import { useAppStore } from '../store/useAppStore';
import { useSocialStore } from '../stores/socialStore';
import { toast } from '../components/common/Toast';
import type { Activity, ActivityType, KmSplit, RoutePoint } from '../types/activity';
import {
  formatTime,
  formatPace,
  computeAvgPaceSecPerKm,
  calculateRollingPace,
  evaluateSplits,
  getBestSplit,
  downsampleRoute,
  calculateHonestCalories,
  calculateActivityXP,
  calculateSessionTimestamps,
} from '../utils/activityCalculations';
import {
  playBeep,
  triggerHaptic,
  announceKilometerSplit,
  speakAnnouncement,
} from '../utils/audioCues';

const AUTOSAVE_STORAGE_KEY = 'fitgenx_active_run_session';

interface SavedRunSession {
  version: 1;
  savedAt: number;
  activityType: ActivityType;
  hasStarted: boolean;
  isPaused: boolean;
  startTime: number;
  pausedAt: number | null;
  totalPausedMs: number;
  distanceM: number;
  elevationGainM: number | null;
  routePoints: RoutePoint[];
  splits: KmSplit[];
  targetPaceSecPerKm: number | null;
  isMuted: boolean;
}

export default function Tracking() {
  const navigate = useNavigate();
  const { profile, addActivity } = useAppStore();
  const { addPost } = useSocialStore();

  // User Weight from profile (fall back to 70kg only if not set)
  const profileWeightKg = profile?.weight ? parseFloat(profile.weight) : 70;

  // Configuration State (Pre-Start)
  const [activityType, setActivityType] = useState<ActivityType>('run');
  const [targetPaceMinutes, setTargetPaceMinutes] = useState<string>(''); // e.g. "5:30"
  const [isMuted, setIsMuted] = useState(false);

  // Session Engine State
  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  const [totalPausedMs, setTotalPausedMs] = useState(0);

  // Display Timers (Updated via animation frame or timestamp calculation)
  const [movingSeconds, setMovingSeconds] = useState(0);
  const [pausedSeconds, setPausedSeconds] = useState(0);

  // Telemetry State
  const [distanceM, setDistanceM] = useState(0);
  const [, setSpeed] = useState(0); // m/s
  const [elevationGainM, setElevationGainM] = useState<number | null>(null);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [splits, setSplits] = useState<KmSplit[]>([]);

  // Modals & UI States
  const [isStatsExpanded, setIsStatsExpanded] = useState(true);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [completedActivity, setCompletedActivity] = useState<Activity | null>(null);
  const [resumePromptSession, setResumePromptSession] = useState<SavedRunSession | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [isPostedToFeed, setIsPostedToFeed] = useState(false);

  // Target Pace Coach Watcher
  const targetPaceSec = targetPaceMinutes
    ? (() => {
        const parts = targetPaceMinutes.split(':').map(Number);
        return parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])
          ? parts[0] * 60 + parts[1]
          : null;
      })()
    : null;

  const paceDeviationStartTimeRef = useRef<number | null>(null);
  const lastPaceAlertTimeRef = useRef<number>(0);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Wake Lock Engine
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch {
      // Browsers may reject wake lock silently
    }
  };

  const releaseWakeLock = async () => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } catch {
      // Fail silently
    }
  };

  // Check for unfinished session (<24 hours old) on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
      if (saved) {
        const parsed: SavedRunSession = JSON.parse(saved);
        const age = Date.now() - parsed.savedAt;

        // If older than 24 hours, discard silently
        if (age >= 24 * 60 * 60 * 1000) {
          localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
        } else if (parsed.hasStarted) {
          setResumePromptSession(parsed);
        }
      }
    } catch {
      localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
    }
  }, []);

  // Handle Session Resume
  const handleResumeSession = () => {
    if (!resumePromptSession) return;
    setActivityType(resumePromptSession.activityType);
    setHasStarted(true);
    setIsPaused(true); // Always resume in paused state so user can ready up
    setStartTime(resumePromptSession.startTime);
    setPausedAt(Date.now());
    setTotalPausedMs(
      resumePromptSession.totalPausedMs +
        (resumePromptSession.pausedAt ? Date.now() - resumePromptSession.pausedAt : 0)
    );
    setDistanceM(resumePromptSession.distanceM);
    setElevationGainM(resumePromptSession.elevationGainM);
    setRoutePoints(resumePromptSession.routePoints);
    setSplits(resumePromptSession.splits);
    setIsMuted(resumePromptSession.isMuted);
    if (resumePromptSession.targetPaceSecPerKm) {
      setTargetPaceMinutes(formatPace(resumePromptSession.targetPaceSecPerKm / 60));
    }
    setResumePromptSession(null);
    toast.info('Previous run session resumed in paused state.');
  };

  const handleDiscardSavedSession = () => {
    localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
    setResumePromptSession(null);
  };

  // Timestamp-based Timer Engine: computes moving & paused seconds via actual timestamps
  useEffect(() => {
    if (!hasStarted) {
      setMovingSeconds(0);
      setPausedSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      const { movingSeconds: mSec, pausedSeconds: pSec } = calculateSessionTimestamps(
        startTime,
        pausedAt,
        totalPausedMs,
        Date.now()
      );
      setMovingSeconds(mSec);
      setPausedSeconds(pSec);
    }, 500);

    return () => clearInterval(interval);
  }, [hasStarted, isPaused, startTime, pausedAt, totalPausedMs]);

  // Keep alive & update timestamps on visibilitychange
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && hasStarted && !isPaused) {
        requestWakeLock();
        const { movingSeconds: mSec, pausedSeconds: pSec } = calculateSessionTimestamps(
          startTime,
          pausedAt,
          totalPausedMs,
          Date.now()
        );
        setMovingSeconds(mSec);
        setPausedSeconds(pSec);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [hasStarted, isPaused, startTime, pausedAt, totalPausedMs]);

  // Autosave Session to localStorage every 5 seconds and on pause
  useEffect(() => {
    if (!hasStarted) return;

    const saveSession = () => {
      const payload: SavedRunSession = {
        version: 1,
        savedAt: Date.now(),
        activityType,
        hasStarted,
        isPaused,
        startTime,
        pausedAt,
        totalPausedMs,
        distanceM,
        elevationGainM,
        routePoints,
        splits,
        targetPaceSecPerKm: targetPaceSec,
        isMuted,
      };
      try {
        localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // storage overflow guard
      }
    };

    // Save immediately on pause
    if (isPaused) {
      saveSession();
    }

    const autosaveTimer = setInterval(saveSession, 5000);
    return () => clearInterval(autosaveTimer);
  }, [
    hasStarted,
    isPaused,
    activityType,
    startTime,
    pausedAt,
    totalPausedMs,
    distanceM,
    elevationGainM,
    routePoints,
    splits,
    targetPaceSec,
    isMuted,
  ]);

  // Start Run Session
  const handleStartRun = () => {
    const now = Date.now();
    setStartTime(now);
    setPausedAt(null);
    setTotalPausedMs(0);
    setHasStarted(true);
    setIsPaused(false);
    setDistanceM(0);
    setSpeed(0);
    setRoutePoints([]);
    setSplits([]);
    setElevationGainM(null);
    requestWakeLock();
    playBeep(659.25, 200, isMuted); // E5 start chime
    triggerHaptic(150, isMuted);
  };

  // Toggle Pause / Resume
  const handleTogglePause = () => {
    const now = Date.now();

    if (!isPaused) {
      // Pause
      setIsPaused(true);
      setPausedAt(now);
      releaseWakeLock();
      triggerHaptic(100, isMuted);
    } else {
      // Resume
      const additionalPaused = pausedAt ? now - pausedAt : 0;
      setTotalPausedMs((prev) => prev + additionalPaused);
      setPausedAt(null);
      setIsPaused(false);
      requestWakeLock();
      triggerHaptic([100, 50, 100], isMuted);
    }
  };

  // Location update from hardened LiveMap (Only called when isTracking === true)
  const handleLocationUpdate = useCallback(
    (data: {
      point: RoutePoint;
      positions: [number, number][];
      totalDistanceM: number;
      smoothedSpeed: number;
      elevationGainM: number | null;
    }) => {
      if (isLocked) return;

      setDistanceM(data.totalDistanceM);
      setSpeed(data.smoothedSpeed);
      if (data.elevationGainM !== null) {
        setElevationGainM(data.elevationGainM);
      }

      setRoutePoints((prev) => {
        const nextPoints = [...prev, data.point];

        // Evaluate Kilometer Splits
        setSplits((currentSplits) => {
          const { updatedSplits, newKmCompleted } = evaluateSplits(
            data.totalDistanceM,
            movingSeconds,
            currentSplits
          );

          if (newKmCompleted !== null) {
            const completedSplit = updatedSplits[updatedSplits.length - 1];
            announceKilometerSplit(newKmCompleted, completedSplit.seconds, isMuted);
          }

          return updatedSplits;
        });

        return nextPoints;
      });
    },
    [isLocked, movingSeconds, isMuted]
  );

  // Pace Metrics Calculations
  const distanceKm = (distanceM / 1000).toFixed(2);
  const avgPaceMinutes = distanceM > 0 ? (movingSeconds / 60) / (distanceM / 1000) : null;
  const avgPaceFormatted = formatPace(avgPaceMinutes);
  const rollingPaceMinutes = calculateRollingPace(routePoints, 30000);
  const rollingPaceFormatted = formatPace(rollingPaceMinutes);

  // Honest Calorie MET calculation
  const { calories, isEstimate: isCalorieEstimate } = calculateHonestCalories(
    activityType,
    movingSeconds,
    profileWeightKg,
    rollingPaceMinutes || avgPaceMinutes
  );

  // Target Pace Coach: check if off target by >15s/km for 30 consecutive seconds
  useEffect(() => {
    if (!hasStarted || isPaused || !targetPaceSec || !rollingPaceMinutes) {
      paceDeviationStartTimeRef.current = null;
      return;
    }

    const currentRollingSec = rollingPaceMinutes * 60;
    const diffSec = currentRollingSec - targetPaceSec;

    if (Math.abs(diffSec) > 15) {
      if (!paceDeviationStartTimeRef.current) {
        paceDeviationStartTimeRef.current = Date.now();
      } else if (
        Date.now() - paceDeviationStartTimeRef.current >= 30000 &&
        Date.now() - lastPaceAlertTimeRef.current >= 45000
      ) {
        // Trigger Coach Advice
        lastPaceAlertTimeRef.current = Date.now();
        const isSlower = diffSec > 15;
        const msg = isSlower
          ? `Pace Alert: You are running slower than your target ${targetPaceMinutes}/km.`
          : `Pace Alert: You are running faster than your target ${targetPaceMinutes}/km.`;

        toast.info(msg);
        playBeep(440, 200, isMuted);
        speakAnnouncement(isSlower ? 'Pick up your pace' : 'Ease up your pace', isMuted);
      }
    } else {
      paceDeviationStartTimeRef.current = null;
    }
  }, [hasStarted, isPaused, targetPaceSec, rollingPaceMinutes, targetPaceMinutes, isMuted]);

  // Finish & End Run
  const handleEndRun = () => {
    releaseWakeLock();
    const finalDownsampledRoute = downsampleRoute(routePoints, 5, 2000);
    const xpEarned = calculateActivityXP(activityType, distanceM);
    const avgPaceSec = computeAvgPaceSecPerKm(movingSeconds, distanceM);

    const activity: Activity = {
      id: `activity-${Date.now()}`,
      type: activityType,
      startedAt: new Date(startTime).toISOString(),
      endedAt: new Date().toISOString(),
      date: new Date(startTime).toISOString(),
      duration: movingSeconds,
      movingSeconds,
      pausedSeconds,
      distanceM,
      calories,
      caloriesBurned: calories,
      avgPaceSecPerKm: avgPaceSec,
      splits,
      route: finalDownsampledRoute,
      elevationGainM,
      mood: null,
      xpEarned,
    };

    // Save ONE activity through the unified store
    addActivity(activity);

    // Clear autosave session
    localStorage.removeItem(AUTOSAVE_STORAGE_KEY);

    // Present Summary View
    setCompletedActivity(activity);
    setShowEndConfirmation(false);
  };

  // Post to Social Community Feed
  const handlePostToFeed = () => {
    if (!completedActivity || isPostedToFeed) return;

    addPost({
      authorId: 'me',
      authorName: profile?.name || 'FitGenX Athlete',
      authorRole: `${activityType.toUpperCase()} ATHLETE`,
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      content: `Completed a ${distanceKm} km ${activityType}! Moving time: ${formatTime(movingSeconds)}, Average pace: ${avgPaceFormatted}/km. Earned +${completedActivity.xpEarned} XP!`,
      time: 'Just now',
      metrics: [
        { label: 'Distance', value: `${distanceKm}`, unit: 'km' },
        { label: 'Moving Time', value: formatTime(movingSeconds), unit: '' },
        { label: 'Avg Pace', value: avgPaceFormatted, unit: '/km' },
        { label: 'Calories', value: `${calories}`, unit: 'kcal' },
      ],
    });

    setIsPostedToFeed(true);
    toast.success('Activity posted to your social community feed!');
  };

  // Clipboard Share
  const handleCopyShareCard = () => {
    const text = `FitGenX ${activityType.toUpperCase()}: ${distanceKm} km | ${formatTime(movingSeconds)} | ${avgPaceFormatted}/km pace | ${calories} kcal burned!`;
    navigator.clipboard.writeText(text);
    toast.success('Performance copied to clipboard!');
  };

  const bestSplit = getBestSplit(splits);

  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden font-sans text-white select-none">
      {/* ─── Unfinished Session Recovery Modal ─── */}
      {resumePromptSession && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">history</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-headline">Unfinished Session Found</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                You have an uncompleted {resumePromptSession.activityType} from{' '}
                {new Date(resumePromptSession.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} with{' '}
                {(resumePromptSession.distanceM / 1000).toFixed(2)} km recorded.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDiscardSavedSession}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-xs font-bold text-zinc-400 hover:bg-zinc-800 transition-colors"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleResumeSession}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
              >
                Resume Run
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Manual Activity Entry Fallback Modal ─── */}
      {showManualModal && (
        <ManualEntryModal
          activityType={activityType}
          onClose={() => setShowManualModal(false)}
          onSave={(manualActivity) => {
            addActivity(manualActivity);
            setShowManualModal(false);
            setCompletedActivity(manualActivity);
          }}
        />
      )}

      {/* ─── Interactive Live Map Layer ─── */}
      {/* Highest priority requirement: isTracking = hasStarted && !isPaused */}
      <LiveMap
        activityType={activityType}
        hasStarted={hasStarted}
        isTracking={hasStarted && !isPaused}
        onLocationUpdate={handleLocationUpdate}
        onAutoPauseChange={(shouldPause) => {
          if (shouldPause && !isPaused) {
            handleTogglePause();
            toast.info('Run auto-paused: GPS signal lost for over 30s.');
          } else if (!shouldPause && isPaused) {
            handleTogglePause();
            toast.success('GPS signal restored: Run auto-resumed.');
          }
        }}
        onRequestManualEntry={() => setShowManualModal(true)}
      />

      {/* Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/85 pointer-events-none z-10" />

      {/* ─── Top Telemetry Header ─── */}
      <header className="absolute top-8 left-0 w-full px-6 flex justify-between items-center z-40">
        <div className="flex items-center gap-2">
          {/* Active Timer Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/90 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 flex items-center gap-2.5 shadow-2xl"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                !hasStarted ? 'bg-zinc-500' : isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span className="text-base font-black font-headline tabular-nums tracking-tighter">
              {formatTime(movingSeconds)}
            </span>
          </motion.div>

          {/* Mute Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="w-9 h-9 rounded-full bg-zinc-900/90 backdrop-blur-xl border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-base">
              {isMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>
        </div>

        {/* Lock Screen Toggle (Prevent Accidental Touches) */}
        {hasStarted && (
          <button
            type="button"
            onClick={() => {
              setIsLocked(!isLocked);
              triggerHaptic(60, isMuted);
              toast.info(isLocked ? 'Screen unlocked' : 'Screen locked (touches disabled)');
            }}
            className={`w-9 h-9 rounded-full backdrop-blur-xl flex items-center justify-center border transition-all ${
              isLocked
                ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900/90 text-zinc-300 border-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {isLocked ? 'lock' : 'lock_open'}
            </span>
          </button>
        )}
      </header>

      {/* ─── Pre-Start Configuration Drawer ─── */}
      {!hasStarted && (
        <div className="absolute top-24 inset-x-6 z-30 max-w-sm mx-auto space-y-3">
          {/* Activity Type Selector */}
          <div className="bg-zinc-900/90 backdrop-blur-xl p-3.5 rounded-3xl border border-white/10 shadow-2xl space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block px-1">
              Select Activity
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['run', 'walk', 'cycle'] as ActivityType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActivityType(type)}
                  className={`py-2 px-3 rounded-2xl flex flex-col items-center gap-1 text-xs font-bold capitalize transition-all ${
                    activityType === type
                      ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                      : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {type === 'run' ? 'directions_run' : type === 'walk' ? 'hiking' : 'directions_bike'}
                  </span>
                  <span>{type}</span>
                </button>
              ))}
            </div>

            {/* Optional Target Pace Input */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between px-1">
              <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                Target Pace
              </label>
              <input
                type="text"
                placeholder="e.g. 5:30"
                value={targetPaceMinutes}
                onChange={(e) => setTargetPaceMinutes(e.target.value)}
                className="w-20 px-2 py-1 rounded-xl bg-zinc-800 border border-white/10 text-xs font-mono text-center text-emerald-400 placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── Bottom HUD & Primary Metric Panel ─── */}
      <div className="absolute bottom-12 inset-x-0 px-6 z-40 max-w-md mx-auto space-y-4">
        {/* Metric Cards Panel */}
        <motion.div
          animate={{ height: isStatsExpanded ? 'auto' : '64px' }}
          className="bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Header of Drawer */}
          <div
            onClick={() => setIsStatsExpanded(!isStatsExpanded)}
            className="flex justify-between items-center cursor-pointer mb-2"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                {activityType} Telemetry
              </span>
            </div>
            <span className="material-symbols-outlined text-zinc-400 text-lg">
              {isStatsExpanded ? 'expand_more' : 'expand_less'}
            </span>
          </div>

          {/* Primary Hero Distance */}
          <div className="flex items-baseline gap-2 pt-1 pb-3">
            <span className="text-5xl font-black font-headline tracking-tighter text-white tabular-nums">
              {distanceKm}
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 font-label">
              Kilometers
            </span>
          </div>

          {/* Metric Sub-Grid */}
          {isStatsExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-4 gap-2 pt-4 border-t border-white/10"
            >
              {/* Rolling 30s Pace */}
              <div>
                <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold mb-0.5">Current</p>
                <p className="text-sm font-black font-headline tabular-nums text-emerald-400">
                  {rollingPaceFormatted}
                </p>
              </div>

              {/* Avg Pace */}
              <div>
                <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold mb-0.5">Avg Pace</p>
                <p className="text-sm font-black font-headline tabular-nums text-white">
                  {avgPaceFormatted}
                </p>
              </div>

              {/* Honest Calories */}
              <div>
                <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold mb-0.5">
                  Calories {isCalorieEstimate && <span className="text-[8px] text-zinc-500">(est.)</span>}
                </p>
                <p className="text-sm font-black font-headline tabular-nums text-white">
                  {calories}
                </p>
              </div>

              {/* Honest Altitude Gain */}
              <div>
                <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold mb-0.5">Elev Gain</p>
                <p className="text-sm font-black font-headline tabular-nums text-white">
                  {elevationGainM !== null ? `${elevationGainM}m` : '—'}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ─── Primary Controls ─── */}
        {!hasStarted ? (
          <button
            type="button"
            onClick={handleStartRun}
            className="w-full py-4 rounded-3xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-base font-black uppercase tracking-wider transition-all active:scale-95 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-2xl font-bold">play_arrow</span>
            Start {activityType}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {/* Pause / Resume Button */}
            <button
              type="button"
              disabled={isLocked}
              onClick={handleTogglePause}
              className={`flex-1 py-4 rounded-3xl text-sm font-black uppercase tracking-wider transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 ${
                isPaused
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                {isPaused ? 'play_arrow' : 'pause'}
              </span>
              {isPaused ? 'Resume' : 'Pause'}
            </button>

            {/* End Run Button */}
            <button
              type="button"
              disabled={isLocked}
              onClick={() => setShowEndConfirmation(true)}
              className="px-6 py-4 rounded-3xl bg-rose-600/90 hover:bg-rose-600 text-white text-sm font-black uppercase tracking-wider transition-all active:scale-95 shadow-xl shadow-rose-600/20 flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-xl">stop</span>
              Finish
            </button>
          </div>
        )}
      </div>

      {/* ─── End Run Confirmation Modal ─── */}
      {showEndConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">flag</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-headline">End {activityType}?</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Your workout will be saved to your cloud profile, creature XP will be awarded, and your route will be preserved.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEndConfirmation(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Continue {activityType}
              </button>
              <button
                type="button"
                onClick={handleEndRun}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20"
              >
                Save & Finish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Completed Activity Summary Screen with Replay Map & Social Share ─── */}
      {completedActivity && (
        <CompletedRunModal
          activity={completedActivity}
          bestSplit={bestSplit}
          isPostedToFeed={isPostedToFeed}
          onPostToFeed={handlePostToFeed}
          onCopyShare={handleCopyShareCard}
          onClose={() => navigate('/analytics')}
        />
      )}

      <BottomNav />
    </div>
  );
}

/**
 * Modal to enter an activity manually when GPS permission is denied or device has no GPS.
 */
function ManualEntryModal({
  activityType,
  onClose,
  onSave,
}: {
  activityType: ActivityType;
  onClose: () => void;
  onSave: (activity: Activity) => void;
}) {
  const [distKm, setDistKm] = useState('5.0');
  const [minutes, setMinutes] = useState('28');
  const [seconds, setSeconds] = useState('0');
  const [selectedType, setSelectedType] = useState<ActivityType>(activityType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const kmNum = parseFloat(distKm) || 0;
    const totalSec = (parseInt(minutes, 10) || 0) * 60 + (parseInt(seconds, 10) || 0);
    const distM = kmNum * 1000;
    const { calories } = calculateHonestCalories(selectedType, totalSec, 70, kmNum > 0 ? (totalSec / 60) / kmNum : null);
    const xpEarned = calculateActivityXP(selectedType, distM);
    const avgPaceSec = computeAvgPaceSecPerKm(totalSec, distM);

    const manualActivity: Activity = {
      id: `manual-${Date.now()}`,
      type: selectedType,
      startedAt: new Date(Date.now() - totalSec * 1000).toISOString(),
      endedAt: new Date().toISOString(),
      date: new Date().toISOString(),
      duration: totalSec,
      movingSeconds: totalSec,
      pausedSeconds: 0,
      distanceM: distM,
      calories,
      caloriesBurned: calories,
      avgPaceSecPerKm: avgPaceSec,
      splits: [],
      route: [],
      elevationGainM: null,
      mood: null,
      xpEarned,
    };

    onSave(manualActivity);
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-white font-headline">Manual Activity Entry</h3>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Activity Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['run', 'walk', 'cycle'] as ActivityType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedType(t)}
                  className={`py-1.5 rounded-xl text-xs font-bold capitalize ${
                    selectedType === t ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Distance (km)</label>
            <input
              type="number"
              step="0.01"
              required
              value={distKm}
              onChange={(e) => setDistKm(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Minutes</label>
              <input
                type="number"
                min="0"
                required
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Seconds</label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Save to Logbook
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * End-of-run detail replay view with read-only route map, splits table, XP badge, and social share.
 */
function CompletedRunModal({
  activity,
  bestSplit,
  isPostedToFeed,
  onPostToFeed,
  onCopyShare,
  onClose,
}: {
  activity: Activity;
  bestSplit: KmSplit | null;
  isPostedToFeed: boolean;
  onPostToFeed: () => void;
  onCopyShare: () => void;
  onClose: () => void;
}) {
  const distKm = (activity.distanceM / 1000).toFixed(2);
  const avgPace = formatPace(activity.avgPaceSecPerKm ? activity.avgPaceSecPerKm / 60 : null);
  const mapPositions = activity.route.map((p) => [p.lat, p.lng] as [number, number]);

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-zinc-950 p-4 pb-20 animate-fade-in flex flex-col items-center">
      <div className="w-full max-w-md space-y-6 pt-4">
        {/* Header Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <h2 className="text-xl font-black font-headline tracking-tight text-white capitalize">
              {activity.type} Complete!
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Creature XP Award Card */}
        <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-zinc-950 flex items-center justify-center font-black">
              ⚡
            </div>
            <div>
              <p className="text-xs font-black text-emerald-400 font-headline uppercase tracking-wider">
                Creature Companion Leveled
              </p>
              <p className="text-[11px] text-zinc-400">Awarded for consistent volume & endurance</p>
            </div>
          </div>
          <span className="text-lg font-black font-headline text-emerald-400">+{activity.xpEarned} XP</span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800">
            <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Distance</p>
            <p className="text-2xl font-black font-headline text-white mt-1">{distKm} <span className="text-xs text-emerald-400">km</span></p>
          </div>
          <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800">
            <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Moving Time</p>
            <p className="text-2xl font-black font-headline text-white mt-1">{formatTime(activity.movingSeconds)}</p>
          </div>
          <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800">
            <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Avg Pace</p>
            <p className="text-2xl font-black font-headline text-white mt-1">{avgPace} <span className="text-xs text-zinc-400">/km</span></p>
          </div>
          <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800">
            <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Calories</p>
            <p className="text-2xl font-black font-headline text-white mt-1">{activity.calories} <span className="text-xs text-zinc-400">kcal</span></p>
          </div>
        </div>

        {/* Read-Only Route Replay Map (Draws REAL recorded points only) */}
        <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 h-56 relative shadow-lg">
          {mapPositions.length > 1 ? (
            <LiveMap
              isReadOnly={true}
              initialPositions={mapPositions}
              splits={activity.splits}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2 text-zinc-500">
              <span className="material-symbols-outlined text-3xl">route</span>
              <p className="text-xs font-bold uppercase tracking-wider">No GPS Route Recorded</p>
              <p className="text-[11px] text-zinc-600">Route was entered manually or GPS fix was unavailable.</p>
            </div>
          )}
        </div>

        {/* Per-Km Splits Table */}
        {activity.splits.length > 0 && (
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

        {/* Action Buttons: Post to Feed, Share Clipboard, and Done */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={onPostToFeed}
            disabled={isPostedToFeed}
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <span className="material-symbols-outlined text-base">
              {isPostedToFeed ? 'done_all' : 'share'}
            </span>
            {isPostedToFeed ? 'Posted to Feed' : 'Post to Community Feed'}
          </button>

          <button
            type="button"
            onClick={onCopyShare}
            className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">content_copy</span>
            Copy Achievement Summary
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Done & Return to Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
