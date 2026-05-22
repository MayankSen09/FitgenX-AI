import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRoadmapStore } from '../stores/roadmapStore';
import { RoadmapNode, Chapter } from '../types/roadmap';
import RoadmapPath from '../components/RoadmapPath';
import NodeDetailSheet from '../components/NodeDetailSheet';
import NodeCompletionCelebration from '../components/NodeCompletionCelebration';
import ChapterUnlockScreen from '../components/ChapterUnlockScreen';
import { ArrowLeft, Compass, Lock, Sparkles } from 'lucide-react';

export default function RoadmapPage() {
  const navigate = useNavigate();
  const {
    chapters,
    nodes,
    initializeRoadmap,
    completeNode,
    currentChapterId,
    setCurrentChapterId,
  } = useRoadmapStore();

  // Premium tier gating
  const isPremium = true;

  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [celebrationRewards, setCelebrationRewards] = useState<{ xp: number; tokens: number } | null>(null);
  const [newUnlockedChapter, setNewUnlockedChapter] = useState<Chapter | null>(null);

  useEffect(() => {
    initializeRoadmap();
  }, [initializeRoadmap]);

  const activeChapter =
    chapters.find((c) => c.id === currentChapterId) ||
    chapters.find((c) => c.status === 'active') ||
    chapters[0];

  if (!activeChapter || Object.keys(nodes).length === 0) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center select-none text-zinc-500 text-sm">
        Loading journey roadmap...
      </div>
    );
  }

  const activeNodes = activeChapter.nodes.map((nId) => nodes[nId]).filter(Boolean);

  const handleNodeClick = (node: RoadmapNode) => {
    // Check for Gated Premium Chapters on Free Tier
    const chNum = Number(node.chapterId.replace('ch', ''));
    if (chNum >= 4 && !isPremium) {
      alert('🔒 This chapter is exclusive to Pro or Ultimate subscribers. Please upgrade your plan!');
      return;
    }
    setSelectedNode(node);
  };

  const handleCompleteNode = (nodeId: string) => {
    const rewards = completeNode(nodeId);
    if (rewards) {
      setSelectedNode(null);
      setCelebrationRewards(rewards);

      // Check if boss node was cleared and a new chapter was unlocked
      const nodeObj = nodes[nodeId];
      if (nodeObj && nodeObj.type === 'boss') {
        const nextNum = Number(nodeObj.chapterId.replace('ch', '')) + 1;
        const nextChapter = chapters.find((c) => c.chapterNumber === nextNum);
        if (nextChapter) {
          setNewUnlockedChapter(nextChapter);
        }
      }
    }
    return rewards;
  };

  const handleChapterClick = (chapter: Chapter) => {
    if (chapter.status === 'locked' && !isPremium) {
      alert('🔒 Chapter is currently locked. Complete the previous chapter to unlock!');
      return;
    }
    setCurrentChapterId(chapter.id);
  };

  return (
    <div className="bg-bg-primary min-h-screen pb-24 max-w-[430px] mx-auto select-none flex flex-col relative">
      {/* Header bar */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between border-b border-outline-variant/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl fixed top-0 w-full max-w-[430px] z-[100]">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full text-zinc-700 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-400">
          Fitness Journey
        </h1>
        <button
          onClick={() => navigate('/journey/builder')}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full text-zinc-700 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white transition-all flex items-center gap-1 text-xs font-black uppercase tracking-wider text-secondary dark:text-primary"
        >
          <Sparkles size={16} />
          <span>Custom</span>
        </button>
      </header>

      <main className="mt-24 px-6 flex-1 flex flex-col space-y-6">
        {/* Horizontal Chapter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 select-none">
          {chapters.map((ch) => {
            const isActive = ch.id === currentChapterId;
            const isLocked = ch.status === 'locked';

            return (
              <button
                key={ch.id}
                onClick={() => handleChapterClick(ch)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 border ${
                  isActive
                    ? 'bg-secondary dark:bg-primary text-white dark:text-zinc-950 border-secondary dark:border-primary shadow-lg shadow-secondary/10 dark:shadow-primary/10'
                    : 'bg-surface-container-low dark:bg-zinc-900/40 border-outline-variant/15 dark:border-white/5 text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {isLocked ? <Lock size={12} /> : <span>Chapter {ch.chapterNumber}</span>}
                <span>{ch.title}</span>
              </button>
            );
          })}
        </div>

        {/* Themed Chapter Header Card */}
        <motion.div
          key={activeChapter.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-surface-container-low border border-outline-variant/10 dark:bg-zinc-900/40 dark:border-white/5 rounded-3xl space-y-3 relative overflow-hidden"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary dark:text-primary flex items-center gap-1">
              <Compass size={12} className="animate-spin-slow" />
              Chapter {activeChapter.chapterNumber}
            </span>
            <h2 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
              {activeChapter.title}
            </h2>
            <p className="text-xs font-semibold text-zinc-400">
              {activeChapter.subtitle}
            </p>
          </div>

          <div className="p-3 bg-white/40 dark:bg-zinc-950/40 border border-outline-variant/5 rounded-2xl">
            <p className="text-xs font-medium italic text-zinc-600 dark:text-zinc-300 font-serif leading-relaxed">
              "{activeChapter.loreText}"
            </p>
          </div>

          {/* Completion Statistics Bar */}
          <div className="space-y-1 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-zinc-500 dark:text-zinc-400">RPG Nodes Progress</span>
              <span className="font-black text-secondary dark:text-primary">
                {activeChapter.completedNodes} / {activeChapter.totalNodes}
              </span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden flex">
              <div
                className="bg-secondary dark:bg-primary h-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((activeChapter.completedNodes / activeChapter.totalNodes) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* The Map Scrollable Path */}
        <div className="bg-surface-container-low border border-outline-variant/10 dark:bg-zinc-900/40 dark:border-white/5 rounded-3xl overflow-y-auto max-h-[500px] flex-1 p-2 relative">
          <RoadmapPath nodes={activeNodes} onTapNode={handleNodeClick} />
        </div>
      </main>

      {/* Overlays */}
      <AnimatePresence>
        {selectedNode && (
          <NodeDetailSheet
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onComplete={handleCompleteNode}
          />
        )}

        {celebrationRewards && (
          <NodeCompletionCelebration
            xpEarned={celebrationRewards.xp}
            tokensEarned={celebrationRewards.tokens}
            onDismiss={() => setCelebrationRewards(null)}
          />
        )}

        {newUnlockedChapter && (
          <ChapterUnlockScreen
            chapter={newUnlockedChapter}
            onContinue={() => {
              setNewUnlockedChapter(null);
              setCurrentChapterId(newUnlockedChapter.id);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
