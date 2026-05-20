import { motion } from 'framer-motion';
import { RoadmapNode } from '../types/roadmap';
import { Check, Lock, Star, Zap } from 'lucide-react';

interface RoadmapNodeProps {
  node: RoadmapNode;
  onTap: (node: RoadmapNode) => void;
}

export default function RoadmapNodeComponent({ node, onTap }: RoadmapNodeProps) {
  const isCompleted = node.status === 'completed';
  const isActive = node.status === 'active';
  const isLocked = node.status === 'locked';

  // State specific colors/rings
  const getThemeColor = () => {
    if (isCompleted) return 'bg-emerald-500 border-emerald-600 shadow-emerald-500/20';
    if (isActive) {
      switch (node.color) {
        case 'teal': return 'bg-teal-500 border-teal-600 shadow-teal-500/30';
        case 'purple': return 'bg-purple-500 border-purple-600 shadow-purple-500/30';
        case 'amber': return 'bg-amber-500 border-amber-600 shadow-amber-500/30';
        case 'coral': return 'bg-coral-500 border-coral-600 shadow-coral-500/30';
        case 'blue': return 'bg-blue-500 border-blue-600 shadow-blue-500/30';
        default: return 'bg-indigo-500 border-indigo-600 shadow-indigo-500/30';
      }
    }
    return 'bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600';
  };

  const isBoss = node.type === 'boss';

  return (
    <div
      onClick={() => onTap(node)}
      className="absolute flex flex-col items-center justify-center cursor-pointer select-none"
      style={{
        left: `${node.position.x}%`,
        top: `${node.position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isActive ? { scale: [1, 1.08, 1] } : {}}
        transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
        className={`flex items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300 ${getThemeColor()} ${
          isBoss ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-12 h-12 sm:w-14 sm:h-14'
        }`}
      >
        {isCompleted ? (
          <Check size={isBoss ? 28 : 20} className="text-white" />
        ) : isLocked ? (
          <Lock size={isBoss ? 24 : 16} className="text-zinc-400 dark:text-zinc-600" />
        ) : isBoss ? (
          <Star size={28} className="text-white animate-pulse" />
        ) : (
          <Zap size={20} className="text-white" />
        )}
      </motion.div>

      {/* Label under node */}
      <div className="mt-2 text-center max-w-[120px] px-1">
        <p className="text-[10px] sm:text-xs font-black tracking-tight text-zinc-800 dark:text-zinc-100 leading-tight">
          {node.title}
        </p>
        <span className="text-[8px] sm:text-[9px] font-semibold text-zinc-500 uppercase tracking-wide">
          {node.type}
        </span>
      </div>
    </div>
  );
}
