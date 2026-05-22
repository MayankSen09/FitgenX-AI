import { motion } from 'framer-motion';
import { Chapter } from '../types/roadmap';
import { Compass, ArrowRight } from 'lucide-react';

interface ChapterUnlockScreenProps {
  chapter: Chapter;
  onContinue: () => void;
}

export default function ChapterUnlockScreen({ chapter, onContinue }: ChapterUnlockScreenProps) {
  return (
    <div className="fixed inset-0 z-[210] bg-black/70 backdrop-blur-md flex items-center justify-center p-6 select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-[360px] bg-white dark:bg-zinc-900 border border-outline-variant/20 rounded-3xl p-6 space-y-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
      >
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-amber-500/15 text-amber-500 dark:text-amber-400 px-3 py-1 rounded-full mb-3 flex items-center gap-1.5">
            <Compass size={12} className="animate-spin" />
            Chapter {chapter.chapterNumber} Unlocked
          </span>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
            {chapter.title}
          </h2>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {chapter.subtitle}
          </p>
        </div>

        {/* Narrative / Lore quote */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 border border-outline-variant/10 dark:border-white/5 rounded-2xl">
          <p className="text-xs italic text-zinc-600 dark:text-zinc-300 leading-relaxed font-serif">
            "{chapter.loreText}"
          </p>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-3.5 bg-secondary hover:bg-secondary/90 dark:bg-white text-white dark:text-zinc-950 font-black uppercase tracking-wider text-xs rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-secondary/10"
        >
          <span>Begin Chapter</span>
          <ArrowRight size={14} />
        </button>
      </motion.div>
    </div>
  );
}
