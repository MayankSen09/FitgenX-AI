import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Play, Pause, ChevronRight, MoreHorizontal, CheckCircle } from 'lucide-react';
import { getWorkoutPlanById, getWorkoutExercises } from '../data/workoutPlans';
import { useCreatureStore } from '../stores/creatureStore';

export default function WorkoutPlayer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { completeWorkout } = useAppStore();

  const plan = getWorkoutPlanById(id || '');
  const exercises = plan ? getWorkoutExercises(plan) : [];

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [bpm, setBpm] = useState(125);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        // Simulate heart rate based on workout intensity
        setBpm(120 + Math.floor(Math.random() * 30));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  if (!plan || exercises.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Workout not found.</p>
          <button onClick={() => navigate('/workouts')} className="text-primary font-bold">← Back to Workouts</button>
        </div>
      </div>
    );
  }

  const currentEx = exercises[currentExercise];
  const totalSets = currentEx.sets;
  const caloriesBurned = Math.round((elapsedSeconds / 60) * (plan.calorieEstimate / parseInt(plan.duration)));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextSet = () => {
    if (currentSet < totalSets) {
      setCurrentSet(currentSet + 1);
    } else {
      // Exercise complete
      const newCompleted = new Set(completedExercises);
      newCompleted.add(currentExercise);
      setCompletedExercises(newCompleted);

      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setCurrentSet(1);
      } else {
        handleFinish();
      }
    }
  };

  const handlePrevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setCurrentSet(1);
    }
  };

  const handleNextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      const newCompleted = new Set(completedExercises);
      newCompleted.add(currentExercise);
      setCompletedExercises(newCompleted);
      setCurrentExercise(currentExercise + 1);
      setCurrentSet(1);
    }
  };

  const handleFinish = () => {
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
    completeWorkout({
      planId: plan.id,
      planName: plan.name,
      date: new Date().toISOString(),
      duration,
      caloriesBurned: Math.max(caloriesBurned, 50),
      exercisesCompleted: completedExercises.size + 1,
      totalExercises: exercises.length,
    });
    // Award creature XP based on workout completion
    const xpEarned = 50 + (completedExercises.size * 25);
    useCreatureStore.getState().addXP(xpEarned);
    navigate('/dashboard');
  };

  return (
    <motion.div
      className="screen h-screen flex flex-col bg-bg-primary pt-safe"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between mb-6 px-2">
        <button onClick={() => navigate(-1)} className="p-3 bg-bg-elevated rounded-full text-text-secondary">
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
           <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest leading-none mb-1">Session Active</p>
           <h2 className="text-sm font-bold text-primary italic uppercase tracking-tighter">{plan.name}</h2>
        </div>
        <button onClick={handleFinish} className="p-3 bg-bg-elevated rounded-full text-text-secondary">
          <MoreHorizontal size={24} />
        </button>
      </div>

      {/* Main Player Area */}
      <div className="flex-1 flex flex-col items-center overflow-y-auto">
         <div className="relative w-full aspect-[4/5] max-h-[50vh] bg-bg-elevated rounded-[3rem] overflow-hidden shadow-2xl mb-8 group mx-4">
            <img
               src={currentEx.image}
               className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
               alt={currentEx.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            <div className="absolute bottom-8 left-8 right-8 flex flex-col items-start">
               <span className="bg-secondary px-4 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest mb-3">
                 Exercise {currentExercise + 1} of {exercises.length}
               </span>
               <h1 className="text-3xl font-extrabold text-white mb-1 leading-none">{currentEx.name}</h1>
               <p className="text-white/60 font-medium text-sm">{currentEx.muscle} • {currentEx.equipment}</p>
            </div>

            <div className="absolute top-6 right-6">
               <div className="w-16 h-16 rounded-2xl bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-3 border border-white/10">
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-tighter mb-0.5">BPM</span>
                  <span className="text-xl font-black text-rose-500 tabular-nums">{bpm}</span>
               </div>
            </div>
         </div>

         {/* Set & Rep Info */}
         <div className="grid grid-cols-3 gap-4 w-full px-6 mb-6">
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl flex flex-col items-center">
               <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-tighter mb-1">Set</span>
               <span className="text-2xl font-black text-primary tabular-nums">{currentSet} / {totalSets}</span>
            </div>
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl flex flex-col items-center">
               <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-tighter mb-1">Reps</span>
               <span className="text-2xl font-black text-secondary tabular-nums">{currentEx.reps}</span>
            </div>
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl flex flex-col items-center">
               <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-tighter mb-1">Rest</span>
               <span className="text-2xl font-black text-zinc-500 tabular-nums">{currentEx.rest}</span>
            </div>
         </div>

         {/* Instructions */}
         <div className="w-full px-6 mb-6">
           <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/5">
             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Instructions</p>
             <div className="space-y-2">
               {currentEx.instructions.map((step, i) => (
                 <div key={i} className="flex gap-3 items-start">
                   <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                   <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">{step}</p>
                 </div>
               ))}
             </div>
           </div>
         </div>

         {/* Playback Controls */}
         <div className="flex items-center gap-8 mb-6">
            <button onClick={handlePrevExercise} className="p-4 bg-bg-elevated rounded-full text-text-tertiary hover:text-primary transition-colors">
               <ChevronRight size={24} className="rotate-180" />
            </button>
            <button
               onClick={() => setIsPlaying(!isPlaying)}
               className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 active:scale-90 transition-transform"
            >
               {isPlaying ? <Pause size={36} /> : <Play size={36} className="ml-1" />}
            </button>
            <button onClick={handleNextExercise} className="p-4 bg-bg-elevated rounded-full text-text-tertiary hover:text-primary transition-colors">
               <ChevronRight size={24} />
            </button>
         </div>

         {/* Bottom Stats */}
         <div className="w-full grid grid-cols-3 gap-4 px-6 mb-8">
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl flex flex-col items-center">
               <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-tighter mb-1">Timer</span>
               <span className="text-lg font-black text-primary tabular-nums">{formatTime(elapsedSeconds)}</span>
            </div>
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl flex flex-col items-center">
               <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-tighter mb-1">Calories</span>
               <span className="text-lg font-black text-secondary tabular-nums">{caloriesBurned}</span>
            </div>
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl flex flex-col items-center">
               <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-tighter mb-1">Done</span>
               <span className="text-lg font-black text-emerald-500 tabular-nums">{completedExercises.size}/{exercises.length}</span>
            </div>
         </div>

         {/* Action Buttons */}
         <div className="w-full px-6 pb-8 space-y-3">
           <button
             onClick={handleNextSet}
             className="btn btn-primary w-full py-5 text-lg flex items-center justify-center gap-3"
           >
             <CheckCircle size={24} />
             {currentSet < totalSets
               ? `Complete Set ${currentSet}`
               : currentExercise < exercises.length - 1
               ? 'Next Exercise'
               : 'Finish Workout'}
           </button>
           <button
             onClick={handleFinish}
             className="w-full py-4 text-zinc-500 font-bold hover:text-primary transition-colors text-sm"
           >
             End Session Early
           </button>
         </div>
      </div>
    </motion.div>
  );
}
