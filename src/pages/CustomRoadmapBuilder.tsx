import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoadmapStore } from '../stores/roadmapStore';
import { generateCustomRoadmap } from '../utils/roadmapGenerator';
import { ArrowLeft, Sparkles, Wand2, ShieldAlert } from 'lucide-react';

export default function CustomRoadmapBuilder() {
  const navigate = useNavigate();

  const isPremium = true;

  const [goal, setGoal] = useState('Build muscle');
  const [weeks, setWeeks] = useState(4);
  const [fitnessLevel, setFitnessLevel] = useState('Intermediate');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    if (!isPremium) {
      alert('🔒 This feature is exclusive to Pro or Ultimate subscribers. Please upgrade your subscription!');
      return;
    }

    setGenerating(true);

    setTimeout(() => {
      const { chapters, nodes } = generateCustomRoadmap(goal, weeks, fitnessLevel);
      useRoadmapStore.setState({
        chapters,
        nodes,
        activeNodeId: chapters[0].nodes[0],
        currentChapterId: chapters[0].id,
      });

      setGenerating(false);
      navigate('/journey');
    }, 1200);
  };

  return (
    <div className="bg-bg-primary min-h-screen pb-24 max-w-[430px] mx-auto select-none flex flex-col">
      {/* Header bar */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between border-b border-outline-variant/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl fixed top-0 w-full max-w-[430px] z-[100]">
        <button
          onClick={() => navigate('/journey')}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full text-zinc-700 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-400">
          Custom Journey
        </h1>
        <div className="w-8" />
      </header>

      <main className="mt-24 px-6 flex-1 flex flex-col space-y-6">
        <div className="p-5 bg-surface-container-low border border-outline-variant/10 dark:bg-zinc-900/40 dark:border-white/5 rounded-3xl space-y-2 select-none">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary dark:text-primary flex items-center gap-1.5">
            <Sparkles size={12} className="animate-pulse" /> AI Goal Generator
          </span>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Generate your personalized, structured fitness roadmap tailored to your own timeline and specific targets.
          </p>
        </div>

        {/* Subscription Gating Notice if Free */}
        {!isPremium && (
          <div className="p-4 bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-2xl flex items-start gap-3">
            <ShieldAlert className="flex-shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-xs font-black uppercase">PRO Feature</p>
              <p className="text-[10px] font-semibold mt-0.5 leading-relaxed">
                The Custom Journey builder is a premium feature available to Pro & Ultimate subscribers. Upgrade today to design custom goals!
              </p>
            </div>
          </div>
        )}

        {/* Form elements */}
        <div className="p-5 bg-surface-container-low border border-outline-variant/10 dark:bg-zinc-900/40 dark:border-white/5 rounded-3xl space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Your Objective Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              disabled={!isPremium}
              className="w-full bg-white dark:bg-zinc-950/60 border border-outline-variant/15 dark:border-white/5 rounded-2xl p-4 text-xs font-bold text-zinc-800 dark:text-white focus:outline-none"
            >
              <option>Build muscle</option>
              <option>General fitness</option>
              <option>Lose weight</option>
              <option>Half marathon</option>
              <option>Full marathon</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Timeline Duration
            </label>
            <select
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              disabled={!isPremium}
              className="w-full bg-white dark:bg-zinc-950/60 border border-outline-variant/15 dark:border-white/5 rounded-2xl p-4 text-xs font-bold text-zinc-800 dark:text-white focus:outline-none"
            >
              <option value={4}>4 Weeks</option>
              <option value={8}>8 Weeks</option>
              <option value={12}>12 Weeks</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Current Fitness Level
            </label>
            <select
              value={fitnessLevel}
              onChange={(e) => setFitnessLevel(e.target.value)}
              disabled={!isPremium}
              className="w-full bg-white dark:bg-zinc-950/60 border border-outline-variant/15 dark:border-white/5 rounded-2xl p-4 text-xs font-bold text-zinc-800 dark:text-white focus:outline-none"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              onClick={handleGenerate}
              className="w-full py-4 bg-secondary hover:bg-secondary/90 dark:bg-primary text-white dark:text-zinc-950 font-black uppercase tracking-wider text-xs rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Wand2 size={16} />
              <span>{generating ? 'Generating Custom Map...' : 'Create Roadmap'}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
