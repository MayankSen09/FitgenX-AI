import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import LiveMap from '../components/map/LiveMap';

export default function Tracking() {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distance, setDistance] = useState(0); // in meters
  const [speed, setSpeed] = useState(0); // in m/s
  const [calories, setCalories] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  // Estimate calories burned (rough MET-based formula for running)
  useEffect(() => {
    // ~0.07 kcal per meter for an average 70kg person running
    setCalories(Math.round(distance * 0.07 / 1000 * 1000));
  }, [distance]);

  const handleLocationUpdate = useCallback((data: {
    positions: [number, number][];
    totalDistance: number;
    currentSpeed: number;
  }) => {
    if (!isPaused) {
      setDistance(data.totalDistance);
      setSpeed(data.currentSpeed);
    }
  }, [isPaused]);

  // Format distance as km
  const distanceKm = (distance / 1000).toFixed(2);

  // Calculate pace (min/km)
  const paceMinutes = distance > 0 ? (elapsedSeconds / 60) / (distance / 1000) : 0;
  const paceFormatted = paceMinutes > 0 && paceMinutes < 60
    ? `${Math.floor(paceMinutes)}:${String(Math.round((paceMinutes % 1) * 60)).padStart(2, '0')}`
    : '--:--';

  // Format elapsed time
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Estimate elevation gain (placeholder — real elevation requires altitude data)
  const elevationGain = Math.round(distance * 0.015); // rough estimate

  return (
    <div className="relative min-h-screen bg-zinc-900 overflow-hidden font-sans">
      {/* Interactive Map */}
      <LiveMap onLocationUpdate={handleLocationUpdate} isTracking={!isPaused} />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/10 to-zinc-900/40 pointer-events-none z-0"></div>

      {/* Top Bar Navigation Area */}
      <header className="relative z-10 w-full px-6 pt-12 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high border-2 border-zinc-700">
            <img 
              alt="User profile" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgfoBemLwZbeIYHlbXnjyKMHqE-ACtroJgVrq_GF7hm4KHR133OKXb248APnZZ-gI58GLJeRu6IqOObfMr4Okxdm5aydVBNy24qQyw2V4ziy-c300gBKnq7ZHLsjCDHnDROsKfjeytLXlMI-ZqNBlqcFDAf_DQXhIXUPhe3gfUk7ekxuXTtQ-9bRYIMSjoIO533rIrglayQ5rQOwnzUjZZ-xN4bQGoOrPjgGbQC_4XowJ-VDzELItj7cWPtPOFOe5KpyKb2zKvMAw"
            />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white font-headline">Tracking</span>
            <p className="text-[10px] text-zinc-400 font-semibold">
              {isPaused ? '⏸ PAUSED' : '🔴 LIVE'} • {formatTime(elapsedSeconds)}
            </p>
          </div>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors">
          <span className="material-symbols-outlined" data-icon="more_horiz">more_horiz</span>
        </button>
      </header>

      {/* Top Metrics Area */}
      <main className="relative z-10 px-4 pt-6 pb-40 flex flex-col h-full justify-between pointer-events-none">
        
        {/* Top Cards Loop */}
        <div className="space-y-3 pointer-events-auto">
          {/* Main Stats Card */}
          <div className="bg-white/70 dark:bg-zinc-800/60 backdrop-blur-xl rounded-[1.5rem] p-4 shadow-lg border border-white/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-label text-[0.6rem] uppercase tracking-widest font-bold text-zinc-600 dark:text-zinc-400 mb-0.5">Distance</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-headline font-extrabold text-zinc-900 dark:text-white tracking-tighter">{distanceKm}</span>
                  <span className="text-base font-bold text-zinc-500">km</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-label text-[0.6rem] uppercase tracking-widest font-bold text-zinc-600 dark:text-zinc-400 mb-0.5">Avg Pace</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-headline font-bold text-zinc-900 dark:text-white tracking-tight">{paceFormatted}</span>
                  <span className="text-xs font-bold text-zinc-500">/km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats Row */}
          <div className="flex gap-3">
            <div className="flex-1 bg-white/70 dark:bg-zinc-800/60 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-white/20">
              <p className="font-label text-[0.6rem] uppercase tracking-widest font-bold text-zinc-600 dark:text-zinc-400 mb-0.5">Energy Burned</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-headline font-bold text-zinc-900 dark:text-white tracking-tight">{calories}</span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase">kcal</span>
              </div>
            </div>
            <div className="flex-1 bg-white/70 dark:bg-zinc-800/60 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-white/20">
              <p className="font-label text-[0.6rem] uppercase tracking-widest font-bold text-zinc-600 dark:text-zinc-400 mb-0.5">Gain</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-headline font-bold text-zinc-900 dark:text-white tracking-tight">{elevationGain}</span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase">m</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Bottom Floating Interaction Area */}
      <div className="absolute bottom-40 left-0 w-full flex flex-col items-center gap-3 pointer-events-auto z-10">
        <button className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/30 shadow-sm active:scale-95 transition-transform">
          <div className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-primary animate-pulse'}`}></div>
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            Speed: <span className="text-primary font-bold">{(speed * 3.6).toFixed(1)} km/h</span>
          </span>
        </button>

        <div className="w-[85%] max-w-sm bg-white/70 dark:bg-zinc-800/60 backdrop-blur-xl p-3 flex items-center justify-between rounded-xl border border-white/20 shadow-md active:scale-95 transition-transform cursor-pointer">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center backdrop-blur-md">
                 <span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
              </div>
              <div>
                 <p className="text-xs font-bold text-zinc-900 dark:text-white">Live Tracking</p>
                 <p className="text-[9px] text-zinc-600 dark:text-zinc-400 font-semibold">GPS signal active • Real-time data</p>
              </div>
           </div>
           <span className="material-symbols-outlined text-sm text-zinc-400">chevron_right</span>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-20 left-0 w-full flex justify-center items-center gap-5 px-8 z-10 pointer-events-auto">
         {/* Stop Button routes to Analytics Summary */}
         <button 
           onClick={() => navigate('/analytics')}
           className="w-14 h-14 rounded-full bg-white/70 dark:bg-zinc-800/70 backdrop-blur-xl flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-red-500 border border-white/20 shadow-lg active:scale-90 transition-all"
         >
            <div className="w-3.5 h-3.5 bg-current rounded-sm"></div>
         </button>

         {/* Pause / Play Button */}
         <button 
           onClick={() => setIsPaused(!isPaused)}
           className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(0,122,255,0.4)] border-4 border-white dark:border-zinc-900 active:scale-95 transition-all outline outline-offset-2 outline-primary/30"
         >
            <span className="material-symbols-outlined text-white text-4xl font-bold select-none" data-icon={isPaused ? 'play_arrow' : 'pause'}>
              {isPaused ? 'play_arrow' : 'pause'}
            </span>
         </button>

         {/* Lock Screen Button */}
         <button className="w-14 h-14 rounded-full bg-white/70 dark:bg-zinc-800/70 backdrop-blur-xl flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-white/20 shadow-lg active:scale-90 transition-all">
            <span className="material-symbols-outlined text-xl" data-icon="lock">lock</span>
         </button>
      </div>

      <BottomNav />
    </div>
  );
}
