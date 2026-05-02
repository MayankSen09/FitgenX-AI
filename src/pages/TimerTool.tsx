import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TimerTool() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(60 * 5); // 5 mins
  const [isActive, setIsActive] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(60 * 5);

  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  return (
    <motion.div 
      className="bg-bg-primary min-h-screen pb-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex justify-between items-center px-6 py-4 border-b border-outline-variant/5">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low active:scale-95 transition-transform">
          <ArrowLeft size={20} className="text-zinc-900 dark:text-zinc-50" />
        </button>
        <div className="text-center">
          <p className="text-[0.6rem] font-bold uppercase tracking-widest text-secondary font-label leading-none mb-1">Workout Tool</p>
          <h2 className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-headline">Focus Timer</h2>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low active:scale-95 transition-transform">
          <RotateCcw size={20} onClick={() => { setSeconds(totalSeconds); setIsActive(false); }} className="text-zinc-900 dark:text-zinc-50" />
        </button>
      </header>

      <main className="mt-32 px-6 max-w-[430px] mx-auto flex flex-col items-center w-full">
        {/* Hero Progress Ring */}
        <div className="relative w-72 h-72 flex items-center justify-center mb-16">
          <svg className="w-full h-full -rotate-90">
            <circle 
              cx="144" cy="144" r="130" fill="none" stroke="currentColor" 
              className="text-zinc-100 dark:text-zinc-800"
              strokeWidth="10" strokeLinecap="round" 
            />
            <motion.circle 
              cx="144" cy="144" r="130" fill="none" stroke="url(#vitality-gradient-timer)" 
              strokeWidth="10" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 130}
              animate={{ 
                strokeDashoffset: (2 * Math.PI * 130) * (1 - (progress / 100))
              }}
              transition={{ duration: 1, ease: "linear" }}
            />
            <defs>
              <linearGradient id="vitality-gradient-timer" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#0058bc" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div 
              animate={isActive ? { scale: [1, 1.02, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-center"
            >
              <h1 className="text-6xl font-black tabular-nums tracking-tighter text-zinc-900 dark:text-zinc-50 font-headline mb-1">{formatTime(seconds)}</h1>
              <div className="flex items-center justify-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#10b981] animate-pulse' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-label">{isActive ? 'Flowing' : 'Paused'}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Presets Section */}
        <section className="w-full mb-10">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-headline text-sm font-extrabold tracking-tight">Presets</h3>
            <span className="text-tertiary font-bold font-label text-[0.6rem] uppercase tracking-widest">Select Duration</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[60, 300, 600, 900].map((t) => (
              <button 
                key={t}
                onClick={() => { setSeconds(t); setTotalSeconds(t); setIsActive(false); }}
                className={`py-4 rounded-2xl border transition-all flex flex-col items-center justify-center shadow-sm ${
                  totalSeconds === t 
                    ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20' 
                    : 'bg-white dark:bg-zinc-900 border-outline-variant/10 text-zinc-900 dark:text-zinc-50'
                }`}
              >
                <span className="text-lg font-black font-headline">{t / 60}</span>
                <span className="text-[8px] font-black uppercase tracking-widest opacity-60 font-label">Min</span>
              </button>
            ))}
          </div>
        </section>

        {/* Manual Adjustments */}
        <section className="w-full mb-12">
          <div className="bg-surface-container-low p-3 rounded-[2rem] border border-outline-variant/5 flex items-center justify-between">
            <button 
              onClick={() => setSeconds(Math.max(0, seconds - 30))}
              className="w-14 h-14 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-zinc-900 dark:text-zinc-50 active:scale-90 transition-transform"
            >
              <Minus size={20} />
            </button>
            <div className="text-center">
              <p className="text-[0.6rem] font-bold uppercase tracking-widest text-zinc-400 font-label">Precision Adjustment</p>
              <p className="font-headline font-black text-lg text-secondary">± 30 Seconds</p>
            </div>
            <button 
              onClick={() => setSeconds(seconds + 30)}
              className="w-14 h-14 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-zinc-900 dark:text-zinc-50 active:scale-90 transition-transform"
            >
              <Plus size={20} />
            </button>
          </div>
        </section>

        {/* Primary Action Button */}
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`w-full py-5 rounded-[2rem] flex items-center justify-center gap-4 font-headline text-xl font-black italic uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] ${
            isActive 
              ? 'bg-zinc-900 text-white' 
              : 'bg-secondary text-white shadow-secondary/30'
          }`}
        >
          {isActive ? (
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>pause</span>
          ) : (
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>play_arrow</span>
          )}
          {isActive ? 'Freeze' : 'Propel'}
        </button>
      </main>
    </motion.div>
  );
}
