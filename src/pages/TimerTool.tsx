import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
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
      className="screen pt-safe bg-bg-primary h-screen flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
    >
      <div className="flex items-center justify-between mb-12">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-full text-text-secondary shadow-sm">
          <ArrowLeft size={24} />
        </button>
        <h2 className="headline-md text-primary">Focused Intervallic</h2>
        <div className="w-12"></div>
      </div>

      <div className="flex-1 flex flex-col items-center">
         <div className="relative w-80 h-80 flex items-center justify-center mb-16">
            <svg className="w-full h-full -rotate-90">
               <circle 
                  cx="160" cy="160" r="140" fill="none" stroke="var(--bg-elevated)" 
                  strokeWidth="20" strokeLinecap="round" 
               />
               <motion.circle 
                  cx="160" cy="160" r="140" fill="none" stroke="var(--secondary)" 
                  strokeWidth="20" strokeLinecap="round"
                  strokeDasharray="880"
                  animate={{ strokeDashoffset: 880 - (880 * progress) / 100 }}
                  transition={{ duration: 1, ease: "linear" }}
                  className="vitality-ring"
               />
            </svg>
            <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center">
               <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-widest mb-2 leading-none">Intensity Momentum</span>
               <h1 className="display-lg text-primary tabular-nums tracking-tighter mb-1 leading-none">{formatTime(seconds)}</h1>
               <span className="text-xs font-bold text-secondary uppercase tracking-tighter">Remaining</span>
            </div>
         </div>

         {/* Timer Presets */}
         <div className="grid grid-cols-2 gap-4 w-full mb-12">
            {[300, 600, 1200, 1800].map((t) => (
               <button 
                  key={t}
                  onClick={() => { setSeconds(t); setTotalSeconds(t); setIsActive(false); }}
                  className={`card p-6 flex flex-col items-center justify-center text-center hover:bg-bg-elevated transition-colors border-2 ${
                    totalSeconds === t ? 'border-secondary bg-secondary/5' : 'border-transparent'
                  }`}
               >
                  <span className="text-xs font-extrabold text-primary mb-1 uppercase tracking-tighter">{t / 60} Min</span>
                  <span className="text-[10px] font-bold text-text-tertiary uppercase">Session</span>
               </button>
            ))}
         </div>

         {/* Precision Adjustments */}
         <div className="flex items-center gap-10 mb-20 bg-bg-elevated p-4 rounded-full">
            <button 
               onClick={() => setSeconds(Math.max(0, seconds - 30))}
               className="w-14 h-14 rounded-full bg-white text-primary flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform"
            >
               <Minus size={24} />
            </button>
            <div className="flex flex-col items-center min-w-[60px]">
               <span className="text-sm font-black text-primary">30s</span>
               <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-tighter">Adjust</span>
            </div>
            <button 
               onClick={() => setSeconds(seconds + 30)}
               className="w-14 h-14 rounded-full bg-white text-primary flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform"
            >
               <Plus size={24} />
            </button>
         </div>

         <div className="flex items-center gap-6 w-full mb-20 px-2">
            <button 
               onClick={() => { setSeconds(totalSeconds); setIsActive(false); }}
               className="p-6 bg-white rounded-full text-text-tertiary hover:text-rose-500 transition-colors shadow-sm"
            >
               <RotateCcw size={32} />
            </button>
            <button 
               onClick={() => setIsActive(!isActive)}
               className="btn btn-primary flex-1 py-6 text-xl shadow-2xl flex items-center justify-center gap-4 group uppercase"
            >
               {isActive ? <Pause size={32} className="fill-current" /> : <Play size={32} className="fill-current" />}
               {isActive ? 'Freeze' : 'Propel'}
            </button>
         </div>
      </div>
    </motion.div>
  );
}
