import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Play, Timer, ChevronRight, MoreHorizontal } from 'lucide-react';

export default function WorkoutPlayer() {
  const navigate = useNavigate();
  const { completeWorkout } = useAppStore();
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 mins
  const [currentExercise] = useState(0);
  const [bpm, setBpm] = useState(142);
  const [calories, setCalories] = useState(324);

  useEffect(() => {
    let timer: any;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        // Simulate biometrics
        setBpm(140 + Math.floor(Math.random() * 10));
        setCalories(prev => prev + 0.1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    completeWorkout(calories);
    navigate('/dashboard');
  };

  const exercises = [
    { name: 'Overhead Press', reps: '12 Reps', duration: '45s', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop' },
    { name: 'Lateral Raises', reps: '15 Reps', duration: '45s', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop' },
    { name: 'Dumbbell Flys', reps: '12 Reps', duration: '45s', image: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=1469&auto=format&fit=crop' },
  ];

  return (
    <motion.div 
      className="screen h-screen flex flex-col bg-bg-primary pt-safe"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="p-3 bg-bg-elevated rounded-full text-text-secondary">
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
           <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest leading-none mb-1">Session Active</p>
           <h2 className="text-sm font-bold text-primary italic uppercase tracking-tighter">Upper Body Power</h2>
        </div>
        <button className="p-3 bg-bg-elevated rounded-full text-text-secondary">
          <MoreHorizontal size={24} />
        </button>
      </div>

      {/* Main Player Area - Atmospheric Precision */}
      <div className="flex-1 flex flex-col items-center">
         <div className="relative w-full aspect-[4/5] bg-bg-elevated rounded-[3rem] overflow-hidden shadow-2xl mb-10 group">
            <img 
               src={exercises[currentExercise].image} 
               className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
               alt="Exercise" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-10 left-10 right-10 flex flex-col items-start">
               <span className="bg-secondary px-4 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest mb-4">Exercise {currentExercise + 1} of {exercises.length}</span>
               <h1 className="text-4xl font-extrabold text-white mb-2 leading-none">{exercises[currentExercise].name}</h1>
               <p className="text-white/60 font-medium text-sm">{exercises[currentExercise].reps} • {exercises[currentExercise].duration} Interval</p>
            </div>
            
            <div className="absolute top-8 right-8">
               <div className="w-16 h-16 rounded-2xl glass-strong flex flex-col items-center justify-center p-3">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-tighter mb-0.5">BPM</span>
                  <span className="text-xl font-black text-rose-500 tabular-nums">{bpm}</span>
               </div>
            </div>
         </div>

         {/* Playback Controls */}
         <div className="flex items-center gap-10 mb-12">
            <button className="p-5 bg-bg-elevated rounded-full text-text-tertiary hover:text-primary transition-colors">
               <ChevronRight size={28} className="rotate-180" />
            </button>
            <button 
               onClick={() => setIsPlaying(!isPlaying)}
               className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 active:scale-90 transition-transform"
            >
               {isPlaying ? <Timer size={40} /> : <Play size={40} className="ml-1" />}
            </button>
            <button className="p-5 bg-bg-elevated rounded-full text-text-tertiary hover:text-primary transition-colors">
               <ChevronRight size={28} />
            </button>
         </div>

         {/* Biometrics Ribbon */}
         <div className="w-full grid grid-cols-3 gap-4 mb-20">
            <div className="bg-white p-6 rounded-[2rem] flex flex-col items-center">
               <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-tighter mb-2">Timer</span>
               <span className="text-lg font-black text-primary tabular-nums">{formatTime(timeLeft)}</span>
            </div>
            <div className="bg-white p-6 rounded-[2rem] flex flex-col items-center">
               <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-tighter mb-2">Calories</span>
               <span className="text-lg font-black text-secondary tabular-nums">{Math.floor(calories)}</span>
            </div>
            <div className="bg-tertiary/10 p-6 rounded-[2rem] flex flex-col items-center">
               <span className="text-[10px] font-bold text-primary uppercase tracking-tighter mb-2">Intensity</span>
               <span className="text-lg font-black text-primary italic uppercase tabular-nums">High</span>
            </div>
         </div>
         
         <button 
           onClick={handleFinish}
           className="btn btn-primary w-full py-5 text-lg"
         >
           Finish Session
         </button>
      </div>
    </motion.div>
  );
}
