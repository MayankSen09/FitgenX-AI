import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProteinStore } from '../stores/proteinStore';
import { proteinSources } from '../data/proteinSources';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function ProteinTrackerWidget() {
  const { todaysProtein, dailyProteinGoal, addProtein } = useProteinStore();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-5 bg-surface-container-low border border-outline-variant/10 dark:bg-zinc-900/40 dark:border-white/5 rounded-3xl space-y-4 select-none">
      {/* Clickable Header for Collapsing/Expanding */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-start cursor-pointer hover:opacity-90 transition-all select-none"
      >
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary dark:text-primary flex items-center gap-1.5 leading-none">
            <Sparkles size={12} /> Intake status
          </span>
          <h3 className="text-sm font-black font-headline tracking-tight text-zinc-900 dark:text-white mt-1 flex items-center gap-1">
            <span>Protein Goals</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </h3>
          <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
            {isExpanded ? 'Click to minimize food items.' : 'Click to add common food items instantly.'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black font-headline text-zinc-900 dark:text-white tabular-nums leading-none">
            {todaysProtein} <span className="text-xs font-semibold tracking-wide text-zinc-500">/ {dailyProteinGoal} g</span>
          </p>
          <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Today's target</p>
        </div>
      </div>

      <div className="w-full bg-zinc-200 dark:bg-zinc-800/60 h-2 rounded-full overflow-hidden border border-outline-variant/10 dark:border-white/5 flex">
        <div
          className="bg-secondary dark:bg-primary h-full transition-all duration-500"
          style={{ width: `${Math.min(100, (todaysProtein / dailyProteinGoal) * 100)}%` }}
        />
      </div>

      {/* Expandable Food List Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 180 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2 pt-2">
              {proteinSources.map((item) => (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    addProtein(item.proteinPerServing);
                  }}
                  className="p-3 bg-white hover:bg-zinc-50 dark:bg-white/5 dark:hover:bg-white/10 border border-outline-variant/10 dark:border-white/5 rounded-2xl flex flex-col items-start gap-1 transition-all active:scale-95 text-left select-none"
                >
                  <p className="text-xs font-black text-zinc-900 dark:text-white leading-tight">{item.name}</p>
                  <p className="text-[9px] font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">{item.servingLabel}</p>
                  <p className="text-[10px] font-black uppercase tracking-wider text-secondary dark:text-primary mt-auto">+{item.proteinPerServing}g</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
