import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Play, Pause, CheckCircle, Sparkles } from 'lucide-react';
import { getWorkoutPlanById, getWorkoutExercises } from '../data/workoutPlans';
import { formatTime, calculateHonestCalories } from '../utils/activityCalculations';
import { playMilestoneChime, playBeep, triggerHaptic } from '../utils/audioCues';
import type { Activity, CompletedExerciseLog, LoggedSet } from '../types/activity';

export default function WorkoutPlayer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { workoutHistory, addActivity, profile } = useAppStore();

  const plan = getWorkoutPlanById(id || '');
  const exercises = plan ? getWorkoutExercises(plan) : [];

  // Play/Pause & Timing State (Accurate Moving Seconds)
  const [isPlaying, setIsPlaying] = useState(true);
  const [movingSeconds, setMovingSeconds] = useState(0);

  // Exercise and Set Navigation
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [currentSetIdx, setCurrentSetIdx] = useState(1);

  // Set Input Log (Current Exercise)
  const [currentWeight, setCurrentWeight] = useState<number>(20);
  const [currentReps, setCurrentReps] = useState<number>(10);

  // Completed Exercises Accumulator (Only exercises with ALL sets finished)
  const [completedExerciseLogs, setCompletedExerciseLogs] = useState<CompletedExerciseLog[]>([]);
  // In-progress sets for the current active exercise
  const [activeExerciseSets, setActiveExerciseSets] = useState<LoggedSet[]>([]);

  // Rest Timer State
  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(60);
  const [customRestDuration, setCustomRestDuration] = useState(60);
  const [autoAdvanceOnRestEnd, setAutoAdvanceOnRestEnd] = useState(false);

  // PRs broken during this workout session
  const [newPRsAchieved, setNewPRsAchieved] = useState<
    Array<{ exerciseName: string; type: 'weight' | 'volume'; value: number }>
  >([]);

  // Confirmation Modal
  const [showExitModal, setShowExitModal] = useState(false);

  // User weight for honest gym calories
  const userWeightKg = profile?.weight ? parseFloat(profile.weight) : 70;

  // Moving Seconds Timer (pauses when isPlaying is false)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setMovingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Rest Countdown Timer
  useEffect(() => {
    if (!isResting) return;

    const interval = setInterval(() => {
      setRestSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleRestComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isResting, autoAdvanceOnRestEnd]);

  const currentEx = exercises[currentExerciseIdx];

  // Progressive Overload Lookup: Find previous session for current exercise
  const previousExercisePerformance = useMemo(() => {
    if (!currentEx) return null;

    for (const act of workoutHistory) {
      if (act.completedExercises && Array.isArray(act.completedExercises)) {
        const found = act.completedExercises.find(
          (ex) => ex.exerciseId === currentEx.id || ex.name === currentEx.name
        );
        if (found && found.sets.length > 0) {
          const lastSet = found.sets[found.sets.length - 1];
          return {
            weightKg: lastSet.weightKg,
            reps: lastSet.reps,
            setsCount: found.sets.length,
          };
        }
      }
    }
    return null;
  }, [currentEx, workoutHistory]);

  // Historical PR Lookup: Find historical Max Weight and Best Volume
  const historicalPRs = useMemo(() => {
    if (!currentEx) return { maxWeight: 0, bestVolume: 0 };
    let maxWeight = 0;
    let bestVolume = 0;

    for (const act of workoutHistory) {
      if (act.completedExercises && Array.isArray(act.completedExercises)) {
        const found = act.completedExercises.find(
          (ex) => ex.exerciseId === currentEx.id || ex.name === currentEx.name
        );
        if (found) {
          if (found.maxWeightKg && found.maxWeightKg > maxWeight) maxWeight = found.maxWeightKg;
          if (found.totalVolumeKg && found.totalVolumeKg > bestVolume) bestVolume = found.totalVolumeKg;

          // Fallback calculation from sets
          let vol = 0;
          for (const s of found.sets) {
            if (s.weightKg > maxWeight) maxWeight = s.weightKg;
            vol += s.weightKg * s.reps;
          }
          if (vol > bestVolume) bestVolume = vol;
        }
      }
    }
    return { maxWeight, bestVolume };
  }, [currentEx, workoutHistory]);

  // Set Initial Inputs from Previous Session (Progressive Overload)
  useEffect(() => {
    if (previousExercisePerformance) {
      setCurrentWeight(previousExercisePerformance.weightKg);
      setCurrentReps(previousExercisePerformance.reps);
    } else {
      setCurrentWeight(20);
      setCurrentReps(10);
    }
  }, [currentExerciseIdx, previousExercisePerformance]);

  if (!plan || exercises.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center p-6">
          <p className="text-zinc-400 mb-4 font-bold">Workout not found.</p>
          <button
            onClick={() => navigate('/workouts')}
            className="px-6 py-2.5 rounded-2xl bg-zinc-800 text-white font-bold"
          >
            ← Back to Workouts
          </button>
        </div>
      </div>
    );
  }

  const totalSets = currentEx.sets;

  // Honest Calorie Expenditure (5.5 MET for vigorous strength conditioning)
  const { calories: caloriesBurned } = calculateHonestCalories('gym', movingSeconds, userWeightKg);

  // Trigger Rest Finished (Beep, Vibrate, Option to Auto-Advance)
  const handleRestComplete = () => {
    playMilestoneChime(false);
    triggerHaptic([150, 100, 150], false);
    setIsResting(false);

    if (autoAdvanceOnRestEnd) {
      // Auto advance
      proceedToNextStep();
    }
  };

  // Move forward to next set or next exercise
  const proceedToNextStep = () => {
    setIsResting(false);
    if (currentSetIdx < totalSets) {
      setCurrentSetIdx((prev) => prev + 1);
    } else {
      // Finalize the current exercise log
      const exerciseMaxWeight = Math.max(...activeExerciseSets.map((s) => s.weightKg), currentWeight);
      const exerciseTotalVolume =
        activeExerciseSets.reduce((sum, s) => sum + s.weightKg * s.reps, 0) +
        currentWeight * currentReps;

      const finalizedLog: CompletedExerciseLog = {
        exerciseId: currentEx.id,
        name: currentEx.name,
        sets: [...activeExerciseSets],
        maxWeightKg: exerciseMaxWeight,
        totalVolumeKg: exerciseTotalVolume,
      };

      setCompletedExerciseLogs((prev) => [...prev, finalizedLog]);
      setActiveExerciseSets([]);

      if (currentExerciseIdx < exercises.length - 1) {
        setCurrentExerciseIdx((prev) => prev + 1);
        setCurrentSetIdx(1);
      } else {
        handleFinishWorkout();
      }
    }
  };

  // Log Set Click
  const handleLogSet = () => {
    const isNewWeightPR = currentWeight > historicalPRs.maxWeight && historicalPRs.maxWeight > 0;
    const newLoggedSet: LoggedSet = {
      setNumber: currentSetIdx,
      weightKg: currentWeight,
      reps: currentReps,
      isPR: isNewWeightPR,
    };

    if (isNewWeightPR) {
      playMilestoneChime(false);
      triggerHaptic([100, 50, 100], false);
      setNewPRsAchieved((prev) => [
        ...prev,
        { exerciseName: currentEx.name, type: 'weight', value: currentWeight },
      ]);
    } else {
      playBeep(659.25, 120, false);
      triggerHaptic(60, false);
    }

    const updatedActiveSets = [...activeExerciseSets, newLoggedSet];
    setActiveExerciseSets(updatedActiveSets);

    // Is this the very last set of the entire workout?
    const isFinalSetOfWorkout =
      currentExerciseIdx === exercises.length - 1 && currentSetIdx === totalSets;

    if (isFinalSetOfWorkout) {
      // Complete workout immediately without rest timer
      const exerciseMaxWeight = Math.max(...updatedActiveSets.map((s) => s.weightKg));
      const exerciseTotalVolume = updatedActiveSets.reduce((sum, s) => sum + s.weightKg * s.reps, 0);

      const finalLog: CompletedExerciseLog = {
        exerciseId: currentEx.id,
        name: currentEx.name,
        sets: updatedActiveSets,
        maxWeightKg: exerciseMaxWeight,
        totalVolumeKg: exerciseTotalVolume,
      };

      saveWorkoutToStore([...completedExerciseLogs, finalLog]);
    } else {
      // Trigger Rest Timer between sets
      setRestSecondsLeft(customRestDuration);
      setIsResting(true);
    }
  };

  // Save Workout honestly (Only saves completed exercises)
  const saveWorkoutToStore = (completedLogs: CompletedExerciseLog[]) => {
    const xpEarned = 50 + completedLogs.length * 25;

    const activity: Activity = {
      id: `gym-${Date.now()}`,
      type: 'gym',
      planId: plan.id,
      planName: plan.name,
      startedAt: new Date(Date.now() - movingSeconds * 1000).toISOString(),
      endedAt: new Date().toISOString(),
      date: new Date().toISOString(),
      duration: movingSeconds,
      movingSeconds,
      pausedSeconds: 0,
      distanceM: 0,
      calories: caloriesBurned,
      caloriesBurned,
      avgPaceSecPerKm: null,
      splits: [],
      route: [],
      elevationGainM: null,
      mood: null,
      xpEarned,
      exercisesCompleted: completedLogs.length,
      totalExercises: exercises.length,
      completedExercises: completedLogs,
      newPRs: newPRsAchieved,
    };

    addActivity(activity);
    navigate('/dashboard');
  };

  // Early finish confirmation
  const handleFinishWorkout = () => {
    // Only exercises whose sets were fully completed are saved
    saveWorkoutToStore(completedExerciseLogs);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-zinc-950 font-sans text-white select-none pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* ─── Top Workout Header ─── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-[430px] mx-auto">
        <button
          onClick={() => setShowExitModal(true)}
          className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="text-center">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none mb-1">
            {plan.name}
          </p>
          <h2 className="text-base font-black font-headline tracking-tight text-white">
            Ex {currentExerciseIdx + 1} of {exercises.length}
          </h2>
        </div>

        {/* Finish Early Button */}
        <button
          onClick={() => setShowExitModal(true)}
          className="px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white"
        >
          Finish
        </button>
      </header>

      {/* ─── Main Workout Area ─── */}
      <main className="flex-1 flex flex-col pt-24 px-6 max-w-[430px] mx-auto w-full space-y-6">
        {/* Progress & Live Moving Duration HUD */}
        <div className="bg-zinc-900/90 rounded-3xl p-4 border border-white/10 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-2xl bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-lg shadow-emerald-500/20"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <div>
              <p className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">Moving Time</p>
              <p className="text-lg font-black font-headline tabular-nums text-white">
                {formatTime(movingSeconds)}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">Burn</p>
            <p className="text-lg font-black font-headline text-emerald-400 tabular-nums">
              {caloriesBurned} <span className="text-xs text-zinc-400">kcal</span>
            </p>
          </div>
        </div>

        {/* Exercise Presentation Card */}
        <div className="bg-zinc-900 border border-white/10 rounded-[2.5rem] p-6 space-y-4 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Target: {currentEx.muscle || 'Strength'}
              </span>
              <h3 className="text-2xl font-black font-headline text-white mt-1 leading-tight">
                {currentEx.name}
              </h3>
            </div>

            {/* Set Counter Badge */}
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-black">
              SET {currentSetIdx} / {totalSets}
            </div>
          </div>

          {/* Progressive Overload Indicator */}
          {previousExercisePerformance && (
            <div className="p-3 bg-zinc-800/80 rounded-2xl border border-white/5 flex items-center gap-2 text-xs">
              <span className="material-symbols-outlined text-emerald-400 text-base">history</span>
              <span className="text-zinc-300">
                Last session:{' '}
                <strong className="text-white font-mono">
                  {previousExercisePerformance.weightKg} kg × {previousExercisePerformance.reps} reps
                </strong>
              </span>
            </div>
          )}

          {/* PR Alert Badge */}
          {currentWeight > historicalPRs.maxWeight && historicalPRs.maxWeight > 0 && (
            <div className="p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-2xl flex items-center gap-2 text-xs text-amber-300 font-bold animate-pulse">
              <Sparkles size={16} className="text-amber-400" />
              <span>⚡ Weight PR: +{(currentWeight - historicalPRs.maxWeight).toFixed(1)} kg over best!</span>
            </div>
          )}

          {/* Set Inputs (Weight & Reps) */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-zinc-800/60 p-4 rounded-2xl border border-white/5 text-center">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-1">
                Weight (kg)
              </label>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentWeight(Math.max(0, currentWeight - 2.5))}
                  className="w-7 h-7 rounded-lg bg-zinc-700 text-white font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  step="0.5"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                  className="w-16 bg-transparent text-center text-xl font-black font-headline text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setCurrentWeight(currentWeight + 2.5)}
                  className="w-7 h-7 rounded-lg bg-zinc-700 text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-zinc-800/60 p-4 rounded-2xl border border-white/5 text-center">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-1">
                Reps
              </label>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentReps(Math.max(1, currentReps - 1))}
                  className="w-7 h-7 rounded-lg bg-zinc-700 text-white font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  value={currentReps}
                  onChange={(e) => setCurrentReps(parseInt(e.target.value, 10) || 0)}
                  className="w-16 bg-transparent text-center text-xl font-black font-headline text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setCurrentReps(currentReps + 1)}
                  className="w-7 h-7 rounded-lg bg-zinc-700 text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Log Set Action Button */}
          {!isResting && (
            <button
              type="button"
              onClick={handleLogSet}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm uppercase tracking-wider transition-all active:scale-95 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Complete Set {currentSetIdx}
            </button>
          )}
        </div>

        {/* ─── Active Rest Timer Card ─── */}
        <AnimatePresence>
          {isResting && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-zinc-900 border-2 border-emerald-500/40 rounded-[2.5rem] p-6 text-center space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  Rest Interval
                </span>
                <label className="flex items-center gap-1.5 cursor-pointer text-zinc-400 text-[11px]">
                  <input
                    type="checkbox"
                    checked={autoAdvanceOnRestEnd}
                    onChange={(e) => setAutoAdvanceOnRestEnd(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Auto-advance</span>
                </label>
              </div>

              {/* Countdown Numbers */}
              <div>
                <p className="text-6xl font-black font-headline text-white tracking-tighter tabular-nums">
                  {formatTime(restSecondsLeft)}
                </p>
                <p className="text-xs text-zinc-400 mt-1">Next: Set {currentSetIdx + 1} of {totalSets}</p>
              </div>

              {/* Rest Controls */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const next = customRestDuration === 60 ? 90 : customRestDuration === 90 ? 120 : 60;
                    setCustomRestDuration(next);
                    setRestSecondsLeft(next);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 transition-colors"
                >
                  {customRestDuration}s
                </button>
                <button
                  type="button"
                  onClick={() => setRestSecondsLeft((s) => s + 15)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition-colors"
                >
                  +15s
                </button>
                <button
                  type="button"
                  onClick={proceedToNextStep}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-emerald-500/20"
                >
                  Skip Rest
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ─── Exit / Finish Early Confirmation Modal ─── */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-headline">Finish Workout?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You completed <strong className="text-white">{completedExerciseLogs.length}</strong> of{' '}
              {exercises.length} exercises. Finishing will honestly save completed exercises to your cloud profile and award creature XP.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-xs font-bold text-zinc-400 hover:bg-zinc-800 transition-colors"
              >
                Keep Going
              </button>
              <button
                type="button"
                onClick={handleFinishWorkout}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20"
              >
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
