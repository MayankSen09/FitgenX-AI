import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Flame, Check } from 'lucide-react';
import { microWorkouts, MicroWorkout } from '../data/microWorkouts';

export default function MicroWorkoutWidget() {
  const [selectedWorkout, setSelectedWorkout] = useState<MicroWorkout | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const startWorkout = (w: MicroWorkout) => {
    setSelectedWorkout(w);
    setSecondsLeft(w.duration);
    setIsRunning(true);
  };

  return (
    <div className="space-y-4 select-none">
      <div className="flex justify-between items-end">
        <h2 className="font-headline text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white">Micro Workouts</h2>
        <span className="text-zinc-500 dark:text-zinc-400 font-bold text-[0.6rem] uppercase tracking-widest">
          Quick movement breaks
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {microWorkouts.map((w) => (
          <div
            key={w.id}
            className="p-4 bg-surface-container-low border border-outline-variant/10 dark:bg-zinc-900/40 dark:border-white/5 rounded-3xl flex flex-col justify-between space-y-3 relative overflow-hidden"
          >
            <div>
              <p className="text-xs font-black text-zinc-900 dark:text-white leading-tight">{w.name}</p>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                <span className="text-[8px] font-black uppercase tracking-wider bg-surface-container-high dark:bg-white/5 px-2 py-0.5 rounded-lg border border-outline-variant/10 dark:border-white/5 text-zinc-600 dark:text-zinc-400">
                  {w.duration / 60}m
                </span>
                <span className="text-[8px] font-black uppercase tracking-wider bg-surface-container-high dark:bg-white/5 px-2 py-0.5 rounded-lg border border-outline-variant/10 dark:border-white/5 text-zinc-600 dark:text-zinc-400">
                  {w.space}
                </span>
              </div>
            </div>

            <button
              onClick={() => startWorkout(w)}
              className="w-full py-2 bg-secondary hover:bg-secondary/90 text-white font-black uppercase tracking-wider text-[10px] rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1 mt-auto"
            >
              <Play size={10} fill="currentColor" />
              <span>Start Break</span>
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedWorkout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-zinc-950/95 backdrop-blur-xl flex flex-col justify-center items-center p-6 text-white"
          >
            <div className="w-full max-w-sm flex flex-col text-center space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-1.5 justify-center">
                  <Flame size={12} fill="currentColor" /> Live Session Break
                </p>
                <h3 className="font-display font-black tracking-tight text-2xl leading-none">{selectedWorkout.name}</h3>
              </div>

              {/* Timer clock */}
              <div className="w-36 h-36 border-4 border-white/10 rounded-full flex items-center justify-center mx-auto bg-zinc-900/40 border-t-primary relative">
                <span className="text-3xl font-black font-headline tracking-tighter tabular-nums">
                  {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Steps/Exercises list */}
              <div className="bg-zinc-900/40 p-4 rounded-2xl border border-white/5 text-left space-y-2 max-h-[160px] overflow-y-auto">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-1">Workout Outline</p>
                {selectedWorkout.exercises.map((ex, i) => (
                  <p key={i} className="text-xs font-semibold text-zinc-300 leading-normal flex items-start gap-2">
                    <span className="text-primary text-[10px] mt-0.5">•</span>
                    <span>{ex}</span>
                  </p>
                ))}
              </div>

              <button
                onClick={() => setSelectedWorkout(null)}
                className="w-full py-3.5 bg-white text-zinc-950 rounded-2xl font-display font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all mt-4"
              >
                <Check size={16} />
                <span>Dismiss Break</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
