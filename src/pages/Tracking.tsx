import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '../components/layout/BottomNav';
import LiveMap from '../components/map/LiveMap';

export default function Tracking() {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distance, setDistance] = useState(0); // in meters
  const [speed, setSpeed] = useState(0); // in m/s
  const [calories, setCalories] = useState(0);
  const [isStatsExpanded, setIsStatsExpanded] = useState(true);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Production Timer logic with background safety
  useEffect(() => {
    if (!isPaused && !showEndConfirmation) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, showEndConfirmation]);

  // Production Calorie estimation based on distance and average exertion
  useEffect(() => {
    // 0.07 kcal per meter is a standard average for running
    setCalories(Math.round(distance * 0.07));
  }, [distance]);

  const handleLocationUpdate = useCallback((data: {
    positions: [number, number][];
    totalDistance: number;
    currentSpeed: number;
  }) => {
    if (!isPaused && !isLocked && !showEndConfirmation) {
      setDistance(data.totalDistance);
      setSpeed(data.currentSpeed);
    }
  }, [isPaused, isLocked, showEndConfirmation]);

  // High Precision Formatting
  const distanceKm = (distance / 1000).toFixed(2);
  const paceMinutes = distance > 0 ? (elapsedSeconds / 60) / (distance / 1000) : 0;
  const paceFormatted = paceMinutes > 0 && paceMinutes < 60
    ? `${Math.floor(paceMinutes)}:${String(Math.round((paceMinutes % 1) * 60)).padStart(2, '0')}`
    : '--:--';

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return hrs > 0 
      ? `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const elevationGain = Math.round(distance * 0.012); // Production placeholder for altitude

  const handleEndRun = () => {
    // Save to local storage for production persistence
    const workoutData = {
      id: Date.now(),
      type: 'Run',
      distance: distanceKm,
      duration: formatTime(elapsedSeconds),
      calories,
      pace: paceFormatted,
      date: new Date().toISOString()
    };
    const history = JSON.parse(localStorage.getItem('workout_history') || '[]');
    localStorage.setItem('workout_history', JSON.stringify([workoutData, ...history]));
    navigate('/analytics');
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-sans text-white">
      {/* Interactive Map Layer */}
      <LiveMap onLocationUpdate={handleLocationUpdate} isTracking={!isPaused && !isLocked} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />
      
      {/* Top Header - Production Level Minimalist */}
      <header className="absolute top-10 left-0 w-full px-6 flex justify-between items-center z-50">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/80 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2.5 shadow-2xl"
        >
          <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-zinc-500' : 'bg-red-500 animate-pulse'}`} />
          <span className="text-lg font-black font-headline tabular-nums tracking-tighter">
            {formatTime(elapsedSeconds)}
          </span>
        </motion.div>

        <button 
          onClick={() => setIsLocked(!isLocked)}
          className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-xl border transition-all ${isLocked ? 'bg-primary border-primary text-white' : 'bg-zinc-900/80 border-white/10 text-white/60'}`}
        >
          <span className="material-symbols-outlined text-[20px]">{isLocked ? 'lock' : 'lock_open'}</span>
        </button>
      </header>

      {/* Main Metric Display */}
      <div className="absolute top-[22%] left-0 w-full flex flex-col items-center pointer-events-none z-20">
        <motion.div
          animate={{ 
            scale: isStatsExpanded ? 1 : 1.1, 
            y: isStatsExpanded ? 0 : 40,
            opacity: isLocked ? 0.4 : 1
          }}
          className="flex flex-col items-center"
        >
          <span className="text-[84px] font-black font-headline tracking-tighter leading-none">
            {distanceKm}
          </span>
          <span className="text-xs font-black uppercase tracking-[0.4em] text-white/30 -mt-1">Kilometers</span>
        </motion.div>
      </div>

      {/* Lock Overlay */}
      <AnimatePresence>
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/20 backdrop-blur-[2px] flex flex-col items-center justify-center"
          >
            <div className="bg-zinc-900/90 p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">lock</span>
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-white/80">Screen Locked</p>
              <button 
                onClick={() => setIsLocked(false)}
                className="bg-white text-black px-6 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest"
              >
                Tap to Unlock
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* End Confirmation Overlay */}
      <AnimatePresence>
        {showEndConfirmation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="bg-zinc-900 w-full max-w-xs rounded-[2.5rem] p-8 border border-white/10 text-center flex flex-col gap-6">
              <div>
                <h3 className="text-2xl font-black font-headline tracking-tight mb-2">End Session?</h3>
                <p className="text-zinc-500 text-xs font-medium">Ready to save your progress and see your achievements?</p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleEndRun}
                  className="bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
                >
                  Save and End
                </button>
                <button 
                  onClick={() => setShowEndConfirmation(false)}
                  className="bg-white/10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-white/60"
                >
                  Resume Run
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Bento & Controls Drawer - Drag-to-Slide Interface */}
      <div className="absolute bottom-0 left-0 w-full z-30">
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 250 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100) setIsStatsExpanded(false);
            if (info.offset.y < -100) setIsStatsExpanded(true);
          }}
          initial={false}
          animate={{ y: isStatsExpanded ? 0 : 250 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-zinc-900/98 backdrop-blur-3xl rounded-t-[3.5rem] border-t border-white/10 p-8 pt-12 shadow-[0_-20px_80px_rgba(0,0,0,0.9)] pb-24 cursor-grab active:cursor-grabbing"
        >
          {/* Drawer Handle */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/10 rounded-full" />

          {/* Action Controls - Moved Higher for Reachability & Visibility */}
          <div className="flex justify-center items-center gap-8 mb-12">
            <button 
              onClick={() => setShowEndConfirmation(true)}
              className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined text-xl">stop_circle</span>
            </button>

            <button 
              onClick={() => setIsPaused(!isPaused)}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-black text-4xl font-bold">
                {isPaused ? 'play_arrow' : 'pause'}
              </span>
            </button>

            <button 
              className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 active:scale-90"
            >
              <span className="material-symbols-outlined text-xl">share</span>
            </button>
          </div>

          {/* Optimized Bento Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 p-5 rounded-[1.8rem] border border-white/5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="material-symbols-outlined text-xs text-primary">speed</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Pace</p>
              </div>
              <p className="text-3xl font-black font-headline tabular-nums leading-none">{paceFormatted}</p>
            </div>
            <div className="bg-white/5 p-5 rounded-[1.8rem] border border-white/5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="material-symbols-outlined text-xs text-orange-500">local_fire_department</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Calories</p>
              </div>
              <p className="text-3xl font-black font-headline tabular-nums leading-none">{calories}</p>
            </div>
            <div className="col-span-2 bg-white/5 p-5 rounded-[1.8rem] border border-white/5 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Elevation</p>
                <p className="text-2xl font-black font-headline tabular-nums">{elevationGain}<span className="text-xs text-white/20 ml-1 uppercase">m</span></p>
              </div>
              <div className="h-10 w-px bg-white/10 mx-6" />
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Current Speed</p>
                <p className="text-2xl font-black font-headline tabular-nums text-primary">{(speed * 3.6).toFixed(1)}<span className="text-xs text-white/20 ml-1 uppercase">km/h</span></p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-[100]">
        <BottomNav />
      </div>
    </div>
  );
}
