import { motion } from 'framer-motion';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';

interface NodeCompletionCelebrationProps {
  xpEarned: number;
  tokensEarned: number;
  onDismiss: () => void;
}

export default function NodeCompletionCelebration({ xpEarned, tokensEarned, onDismiss }: NodeCompletionCelebrationProps) {
  // 20 particle items
  const particles = Array.from({ length: 20 });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md select-none">
      {/* Dynamic Particle Bursts */}
      {particles.map((_, i) => {
        const angle = (i * 18) * (Math.PI / 180);
        const radius = 100 + Math.random() * 80;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={i}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{ scale: 1, x, y, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 100, duration: 1.2, delay: 0.1 }}
            className={`absolute w-3 h-3 rounded-full ${
              i % 2 === 0 ? 'bg-secondary' : 'bg-amber-400'
            }`}
          />
        );
      })}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="w-full max-w-[340px] bg-white dark:bg-zinc-900 border border-outline-variant/20 rounded-3xl p-6 text-center space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] mx-4"
      >
        <div className="w-16 h-16 bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-500 shadow-lg animate-bounce">
          <Trophy size={32} />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white uppercase">
            Milestone Cleared!
          </h3>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Fantastic progress on your fitness journey map.
          </p>
        </div>

        {/* Rewards slide up */}
        <div className="grid grid-cols-2 gap-3 bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-outline-variant/10 dark:border-white/5">
          <div className="space-y-0.5">
            <span className="text-xs font-black text-secondary dark:text-primary flex items-center justify-center gap-1">
              <Sparkles size={12} /> XP Gained
            </span>
            <p className="text-xl font-black text-zinc-800 dark:text-zinc-100">+{xpEarned}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-black text-amber-500 flex items-center justify-center gap-1">
              Tokens
            </span>
            <p className="text-xl font-black text-zinc-800 dark:text-zinc-100">+{tokensEarned}</p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="w-full py-3.5 bg-secondary hover:bg-secondary/90 dark:bg-white text-white dark:text-zinc-950 font-black uppercase tracking-wider text-xs rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-secondary/10"
        >
          <span>Continue Journey</span>
          <ArrowRight size={14} />
        </button>
      </motion.div>
    </div>
  );
}
