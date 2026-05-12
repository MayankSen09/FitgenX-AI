import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Play, Info, Layers, Dumbbell } from 'lucide-react';
import { getExerciseById } from '../data/exercises';

export default function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const exercise = getExerciseById(id || '');

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Exercise could not be found.</p>
          <button onClick={() => navigate('/workouts')} className="text-primary font-bold">← Back to Exercises</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-bg-primary min-h-screen pb-32"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low active:scale-95 transition-transform">
          <ArrowLeft size={20} className="text-zinc-900 dark:text-zinc-50" />
        </button>
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-50 font-headline">Exercise Library</h2>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low active:scale-95 transition-transform">
          <Share2 size={20} className="text-zinc-900 dark:text-zinc-50" />
        </button>
      </header>

      <main className="pt-24 px-6 max-w-[430px] mx-auto">
        {/* Media Section */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-zinc-100 dark:bg-zinc-800 aspect-square shadow-xl mb-8 group">
          {exercise.videoUrl ? (
            <iframe 
              src={exercise.videoUrl}
              className="w-full h-full border-none"
              title={exercise.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          )}
          {!exercise.videoUrl && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <span className="material-symbols-outlined text-white text-5xl opacity-80">play_circle</span>
            </div>
          )}
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <div className="flex gap-2 mb-3">
             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                exercise.difficulty === 'Beginner' ? 'bg-emerald-500/20 text-emerald-600' :
                exercise.difficulty === 'Intermediate' ? 'bg-amber-500/20 text-amber-600' :
                'bg-red-500/20 text-red-600'
             }`}>
                {exercise.difficulty}
             </span>
             <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                {exercise.muscle}
             </span>
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-zinc-50 mb-2">{exercise.name}</h1>
          <p className="text-zinc-500 text-sm font-medium flex items-center gap-2">
            <Layers size={14} />
            Targeting the {exercise.muscle}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-surface-container-low p-5 rounded-[2rem] border border-outline-variant/5">
            <div className="flex items-center gap-3 mb-2">
              <Dumbbell size={18} className="text-secondary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 font-label">Equipment</span>
            </div>
            <p className="font-bold text-zinc-900 dark:text-zinc-50 text-sm leading-snug">{exercise.equipment}</p>
          </div>
          <div className="bg-surface-container-low p-5 rounded-[2rem] border border-outline-variant/5">
            <div className="flex items-center gap-3 mb-2">
              <Play size={18} className="text-tertiary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 font-label">Volume</span>
            </div>
            <p className="font-bold text-zinc-900 dark:text-zinc-50 text-sm leading-snug">{exercise.sets} Sets × {exercise.reps}</p>
          </div>
        </div>

        {/* Instructions */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-lg vitality-gradient flex items-center justify-center">
              <Info size={14} className="text-white" />
            </div>
            <h3 className="font-headline text-lg font-black tracking-tight italic uppercase">How to Perform</h3>
          </div>
          <div className="space-y-4">
            {exercise.instructions.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 group"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-500 group-hover:bg-secondary group-hover:text-white transition-colors">
                  {i + 1}
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-medium pt-1">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action - Professional Style */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 rounded-[2rem] flex items-center justify-between shadow-sm mb-12">
          <div className="flex-1">
            <h4 className="text-lg font-black italic uppercase tracking-tighter text-zinc-900 dark:text-zinc-50 leading-none mb-1">Add to Routine</h4>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Customize your plan</p>
          </div>
          <button className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all shadow-lg shadow-zinc-900/10">
            Add to My Plan
          </button>
        </section>
      </main>
    </motion.div>
  );
}
