import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Flame, Activity, ChevronRight, Share2 } from 'lucide-react';
import { getWorkoutPlanById, getWorkoutExercises } from '../data/workoutPlans';

export default function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const plan = getWorkoutPlanById(id || '');
  const exercises = plan ? getWorkoutExercises(plan) : [];

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Workout plan not found.</p>
          <button onClick={() => navigate('/workouts')} className="text-primary font-bold">← Back to Workouts</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="screen pt-safe bg-bg-primary min-h-screen pb-32"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
    >
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-full text-text-secondary shadow-sm">
          <ArrowLeft size={24} />
        </button>
        <button className="p-3 bg-white rounded-full text-text-secondary shadow-sm">
          <Share2 size={24} />
        </button>
      </div>

      <div className="relative mb-10 group overflow-hidden rounded-[2.5rem] bg-bg-elevated aspect-video shadow-xl">
         <img
            src={plan.image}
            className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110"
            alt={plan.name}
         />
         <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent"></div>
         <div className="absolute bottom-8 left-8 right-8">
            <span className="bg-tertiary text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 inline-block">{plan.type}</span>
            <h1 className="text-4xl font-extrabold text-white mb-2 italic uppercase">{plan.name}</h1>
            <p className="text-white/60 text-sm font-medium">{plan.duration} • {plan.difficulty} • ~{plan.calorieEstimate} kcal</p>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
         <div className="bg-white p-5 rounded-[2rem] flex flex-col items-center text-center shadow-sm">
            <Clock size={20} className="text-secondary mb-3" />
            <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-tighter leading-none mb-1">Time</span>
            <span className="text-sm font-black text-primary italic uppercase">{plan.duration}</span>
         </div>
         <div className="bg-white p-5 rounded-[2rem] flex flex-col items-center text-center shadow-sm">
            <Activity size={20} className="text-tertiary mb-3" />
            <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-tighter leading-none mb-1">Exercises</span>
            <span className="text-sm font-black text-primary italic uppercase">{exercises.length}</span>
         </div>
         <div className="bg-white p-5 rounded-[2rem] flex flex-col items-center text-center shadow-sm">
            <Flame size={20} className="text-rose-500 mb-3" />
            <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-tighter leading-none mb-1">Burn</span>
            <span className="text-sm font-black text-primary italic uppercase">{plan.calorieEstimate}</span>
         </div>
      </div>

      {/* Description */}
      <div className="px-2 mb-8">
        <p className="text-sm text-on-surface-variant leading-relaxed">{plan.description}</p>
      </div>

      <section className="section">
         <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-6">Exercises ({exercises.length})</h3>
         <div className="flex flex-col gap-4 mb-32">
            {exercises.map((ex, i) => (
               <div key={ex.id} className="card p-5 group flex items-center justify-between hover:bg-bg-elevated transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                       {i + 1}
                     </div>
                     <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 transition-transform group-hover:scale-110">
                        <img src={ex.image} className="w-full h-full object-cover" alt={ex.name} />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-primary mb-0.5">{ex.name}</h4>
                        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                          {ex.sets} sets × {ex.reps} • Rest {ex.rest}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{ex.equipment}</p>
                     </div>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-text-tertiary group-hover:text-primary transition-colors">
                     <ChevronRight size={20} />
                  </div>
               </div>
            ))}
         </div>
      </section>

      <div className="fixed bottom-24 left-6 right-6 z-50">
         <button
           onClick={() => navigate(`/workout-player/${plan.id}`)}
           className="btn btn-primary w-full py-6 text-xl shadow-2xl flex items-center justify-center gap-4 group"
         >
           <Play size={28} className="fill-current" />
           START SESSION
         </button>
      </div>
    </motion.div>
  );
}
