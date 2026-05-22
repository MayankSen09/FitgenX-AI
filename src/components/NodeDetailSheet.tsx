import { motion } from 'framer-motion';
import { RoadmapNode } from '../types/roadmap';
import { Check, X, Flame, ArrowRight, Award } from 'lucide-react';
import { useRoadmapStore } from '../stores/roadmapStore';

interface NodeDetailSheetProps {
  node: RoadmapNode;
  onClose: () => void;
  onComplete: (nodeId: string) => { xp: number; tokens: number } | null;
}

export default function NodeDetailSheet({ node, onClose, onComplete }: NodeDetailSheetProps) {
  const { updateNodeProgress } = useRoadmapStore();
  const isActive = node.status === 'active';
  const isCompleted = node.status === 'completed';

  const progressPercent = Math.min(
    100,
    Math.round((node.requirement.progress / node.requirement.value) * 100)
  );

  const handleMakeProgress = () => {
    // Manually push progress for direct simulation/gamification
    const nextProgress = Math.min(node.requirement.value, node.requirement.progress + 1);
    updateNodeProgress(node.id, nextProgress);
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: '0%' }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="fixed bottom-0 inset-x-0 mx-auto w-full max-w-[430px] bg-white dark:bg-zinc-900 border-t border-outline-variant/20 rounded-t-3xl shadow-[0_-15px_50px_rgba(0,0,0,0.15)] z-[150] p-6 pb-8 select-none"
    >
      {/* Drawer Handle */}
      <div className="w-12 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-5" />

      {/* Header Info */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-secondary dark:text-primary bg-secondary/10 dark:bg-primary/10 px-2 py-0.5 rounded-md flex items-center gap-1 w-max mb-1">
            <Flame size={10} />
            {node.type}
          </span>
          <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
            {node.title}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 rounded-full transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-5 leading-normal">
        {node.description}
      </p>

      {/* Requirement Details */}
      <div className="bg-surface-container-low border border-outline-variant/10 dark:bg-zinc-950/40 dark:border-white/5 rounded-2xl p-4 space-y-3 mb-6">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-zinc-800 dark:text-zinc-300">
            Requirement: {node.requirement.description}
          </span>
          <span className="font-black text-secondary dark:text-primary">
            {node.requirement.progress} / {node.requirement.value} {node.requirement.unit}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden flex">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            className="bg-secondary dark:bg-primary h-full"
          />
        </div>
      </div>

      {/* Rewards preview */}
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-1">
          <Award size={12} /> Milestone Completion Rewards
        </p>
        <div className="flex flex-wrap gap-2">
          {node.rewards.map((r, i) => (
            <span
              key={i}
              className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-outline-variant/10 dark:border-white/5 flex items-center gap-1.5"
            >
              {r.label}
            </span>
          ))}
        </div>
      </div>

      {/* Boss Specific Narrative */}
      {node.type === 'boss' && node.bossData && (
        <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 space-y-1 mb-6">
          <p className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            Chapter Gate — {node.bossData.name}
          </p>
          <p className="text-xs italic text-zinc-600 dark:text-zinc-400">
            "{node.bossData.backstory}"
          </p>
        </div>
      )}

      {/* CTA and Progress Options */}
      <div className="space-y-3">
        {isActive ? (
          <div className="flex flex-col gap-2">
            <button
              onClick={handleMakeProgress}
              className="w-full py-3.5 bg-secondary hover:bg-secondary/90 dark:bg-primary text-white dark:text-zinc-950 font-black uppercase tracking-wider text-xs rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-secondary/10 dark:shadow-primary/10"
            >
              <span>Add Progress +1</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onComplete(node.id)}
              className="w-full py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100 font-bold uppercase tracking-wider text-xs rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Check size={14} />
              <span>Instant Complete</span>
            </button>
          </div>
        ) : isCompleted ? (
          <div className="w-full py-3.5 bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-wider text-xs rounded-2xl text-center flex items-center justify-center gap-1.5">
            <Check size={16} />
            <span>Milestone Completed</span>
          </div>
        ) : (
          <div className="w-full py-3.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 font-black uppercase tracking-wider text-xs rounded-2xl text-center border border-dashed border-outline-variant/20 dark:border-white/5">
            Milestone Gated / Locked
          </div>
        )}
      </div>
    </motion.div>
  );
}
