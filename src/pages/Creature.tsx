import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCreatureStore, CREATURE_STAGES } from '../stores/creatureStore';
import { useAppStore } from '../store/useAppStore';

export default function Creature() {
  const navigate = useNavigate();
  const { xp, getStage, getProgress, getNextStage } = useCreatureStore();
  const { workoutHistory } = useAppStore();

  const stage = getStage();
  const progress = getProgress();
  const nextStage = getNextStage();
  const currentStageIndex = CREATURE_STAGES.findIndex((s) => s.name === stage.name);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg-primary pb-32"
    >
      {/* Header */}
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex items-center justify-between px-6 py-4 border-b border-outline-variant/5">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-zinc-500">arrow_back</span>
        </button>
        <h1 className="text-xl font-headline font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">Your Companion</h1>
        <div className="w-10" />
      </header>

      <main className="pt-24 px-6 max-w-[430px] mx-auto">
        {/* Creature Display */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="relative flex flex-col items-center justify-center py-10 bg-surface-container-low rounded-[2rem] border border-outline-variant/10 shadow-sm"
        >
          {/* Glow effect */}
          <div
            className="absolute w-36 h-36 rounded-full blur-[60px] opacity-40 animate-pulse"
            style={{ backgroundColor: stage.color }}
          />

          {/* Creature */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="relative z-10"
          >
            <span className={`${stage.size} select-none`} style={{ filter: `drop-shadow(0 0 12px ${stage.glow})` }}>
              {stage.emoji}
            </span>
          </motion.div>

          {/* Name & Level */}
          <div className="mt-6 text-center z-10">
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">{stage.name}</h2>
            <p className="text-sm font-bold uppercase tracking-widest mt-1" style={{ color: stage.color }}>
              Stage {currentStageIndex + 1} of {CREATURE_STAGES.length}
            </p>
          </div>
        </motion.div>

        {/* XP Progress */}
        <div className="mt-8 space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[0.6rem] font-bold uppercase tracking-widest text-outline">Experience</span>
            <span className="text-sm font-bold text-on-surface tabular-nums">{xp} XP</span>
          </div>
          <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: stage.color }}
            />
          </div>
          {nextStage ? (
            <p className="text-xs text-on-surface-variant">
              <span className="text-on-surface font-semibold">{nextStage.minXP - xp} XP</span> until evolution to{' '}
              <span style={{ color: nextStage.color }} className="font-bold">{nextStage.emoji} {nextStage.name}</span>
            </p>
          ) : (
            <p className="text-xs font-bold" style={{ color: stage.color }}>⚡ MAX EVOLUTION REACHED</p>
          )}
        </div>

        {/* Evolution Timeline */}
        <div className="mt-10 space-y-3">
          <h3 className="text-[0.6rem] font-bold uppercase tracking-widest text-outline">Evolution Path</h3>
          <div className="space-y-2">
            {CREATURE_STAGES.map((s) => {
              const isUnlocked = xp >= s.minXP;
              const isCurrent = s.name === stage.name;
              return (
                <div
                  key={s.name}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                    isCurrent ? 'bg-surface-container-low ring-2 shadow-sm' : isUnlocked ? 'bg-surface-container-lowest' : 'opacity-50'
                  }`}
                  style={isCurrent ? { borderColor: stage.color + '40' } : {}}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      isUnlocked ? '' : 'grayscale'
                    }`}
                    style={isUnlocked ? { backgroundColor: s.color + '15' } : { backgroundColor: 'rgba(0,0,0,0.03)' }}
                  >
                    {isUnlocked ? s.emoji : '🔒'}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${isUnlocked ? 'text-on-surface' : 'text-outline'}`}>
                      {s.name}
                      {isCurrent && <span className="text-[10px] ml-2 uppercase tracking-widest font-bold" style={{ color: s.color }}>Current</span>}
                    </p>
                    <p className="text-[10px] text-on-surface-variant font-semibold">{s.minXP} XP required</p>
                  </div>
                  {isUnlocked && (
                    <span className="material-symbols-outlined text-sm" style={{ color: s.color, fontVariationSettings: '"FILL" 1' }}>
                      check_circle
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* How to earn XP */}
        <div className="mt-10 mb-8 space-y-3">
          <h3 className="text-[0.6rem] font-bold uppercase tracking-widest text-outline">How to Earn XP</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/5">
              <span className="text-lg">🏋️</span>
              <p className="text-xs font-bold text-on-surface mt-2">Complete Workout</p>
              <p className="text-[10px] text-secondary font-bold">+50-200 XP</p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/5">
              <span className="text-lg">🔥</span>
              <p className="text-xs font-bold text-on-surface mt-2">Daily Streak</p>
              <p className="text-[10px] text-secondary font-bold">+25 XP/day</p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/5">
              <span className="text-lg">🏃</span>
              <p className="text-xs font-bold text-on-surface mt-2">Track a Run</p>
              <p className="text-[10px] text-secondary font-bold">+75 XP</p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/5">
              <span className="text-lg">💬</span>
              <p className="text-xs font-bold text-on-surface mt-2">Ask AI Coach</p>
              <p className="text-[10px] text-secondary font-bold">+10 XP</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 bg-surface-container-low p-5 rounded-2xl border border-outline-variant/5 flex items-center justify-between">
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-outline">Total Workouts</p>
            <p className="text-2xl font-headline font-extrabold text-on-surface">{workoutHistory.length}</p>
          </div>
          <div className="text-right">
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-outline">Total XP</p>
            <p className="text-2xl font-headline font-extrabold" style={{ color: stage.color }}>{xp}</p>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
