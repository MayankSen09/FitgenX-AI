import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Flame, Activity, ChevronRight, Share2 } from 'lucide-react';

export default function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const exercises = [
    { name: 'Overhead Press', reps: '12 Reps', duration: '45s', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop' },
    { name: 'Lateral Raises', reps: '15 Reps', duration: '45s', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop' },
    { name: 'Dumbbell Flys', reps: '12 Reps', duration: '45s', image: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=1469&auto=format&fit=crop' },
    { name: 'Front Raises', reps: '12 Reps', duration: '45s', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa20019b?q=80&w=1470&auto=format&fit=crop' },
  ];

  return (
    <motion.div 
      className="screen pt-safe bg-bg-primary min-h-screen"
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
            src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop" 
            className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110" 
            alt="Workout Hero" 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent"></div>
         <div className="absolute bottom-8 left-8 right-8">
            <span className="bg-tertiary text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 inline-block">Advanced Coaching</span>
            <h1 className="text-4xl font-extrabold text-white mb-2 italic uppercase">Upper Body Power</h1>
            <p className="text-white/60 text-sm font-medium">45 mins • Intermediate • Intensity: High</p>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
         <div className="bg-white p-5 rounded-[2rem] flex flex-col items-center text-center shadow-sm">
            <Clock size={20} className="text-secondary mb-3" />
            <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-tighter leading-none mb-1">Time</span>
            <span className="text-sm font-black text-primary italic uppercase">45m</span>
         </div>
         <div className="bg-white p-5 rounded-[2rem] flex flex-col items-center text-center shadow-sm">
            <Activity size={20} className="text-tertiary mb-3" />
            <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-tighter leading-none mb-1">Focus</span>
            <span className="text-sm font-black text-primary italic uppercase">Power</span>
         </div>
         <div className="bg-white p-5 rounded-[2rem] flex flex-col items-center text-center shadow-sm">
            <Flame size={20} className="text-rose-500 mb-3" />
            <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-tighter leading-none mb-1">Burn</span>
            <span className="text-sm font-black text-primary italic uppercase">420k</span>
         </div>
      </div>

      <section className="section">
         <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-6">Movement Profile</h3>
         <div className="flex flex-col gap-4 mb-32">
            {exercises.map((ex, i) => (
               <div key={i} className="card p-5 group flex items-center justify-between hover:bg-bg-elevated transition-colors cursor-pointer">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 transition-transform group-hover:scale-110">
                        <img src={ex.image} className="w-full h-full object-cover" alt={ex.name} />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-primary mb-1 uppercase italic tracking-tighter">{ex.name}</h4>
                        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{ex.reps} • {ex.duration}</p>
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
           onClick={() => navigate(`/workout-player/${id}`)}
           className="btn btn-primary w-full py-6 text-xl shadow-2xl flex items-center justify-center gap-4 group"
         >
           <Play size={28} className="fill-current" />
           START SESSION
         </button>
      </div>
    </motion.div>
  );
}
