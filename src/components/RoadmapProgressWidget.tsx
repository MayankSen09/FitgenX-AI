import { Link } from 'react-router-dom';
import { useRoadmapStore } from '../stores/roadmapStore';
import { Compass, ArrowRight } from 'lucide-react';

export default function RoadmapProgressWidget() {
  const { chapters, nodes } = useRoadmapStore();

  const activeChapter = chapters.find((c) => c.status === 'active') || chapters[0];
  if (!activeChapter) return null;

  // Compute active chapter progress
  const chNodes = Object.values(nodes).filter((n) => n.chapterId === activeChapter.id);
  const completedNodes = chNodes.filter((n) => n.status === 'completed').length;
  const totalNodes = chNodes.length;
  const percent = Math.min(100, Math.round((completedNodes / (totalNodes || 1)) * 100));

  return (
    <Link
      to="/journey"
      className="block p-5 bg-surface-container-low border border-outline-variant/10 dark:bg-zinc-900/40 dark:border-white/5 rounded-3xl select-none hover:border-secondary/20 dark:hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary dark:text-primary flex items-center gap-1.5">
            <Compass size={12} /> Fitness Journey Roadmap
          </span>
          <h3 className="text-sm font-black text-zinc-800 dark:text-white leading-snug">
            {activeChapter.title}
          </h3>
          <p className="text-xs font-semibold text-zinc-400">Chapter {activeChapter.chapterNumber}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-zinc-500 dark:text-zinc-400">RPG Level Progress</span>
          <span className="font-black text-zinc-800 dark:text-zinc-100">{percent}%</span>
        </div>

        {/* Progress Fill */}
        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
          <div className="bg-secondary dark:bg-primary h-full" style={{ width: `${percent}%` }} />
        </div>

        <div className="flex justify-between items-center pt-2 text-xs font-black text-secondary dark:text-primary hover:underline">
          <span>Continue Journey</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}
