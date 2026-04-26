import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EXERCISES, MUSCLE_GROUPS } from '../data/exercises';
import { WORKOUT_PLANS } from '../data/workoutPlans';

export default function WorkoutPlans() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [view, setView] = useState<'plans' | 'exercises'>('plans');

  const filteredExercises = EXERCISES.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? ex.muscle === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const filteredPlans = WORKOUT_PLANS.filter((plan) => {
    return plan.name.toLowerCase().includes(search.toLowerCase());
  });

  const muscleGroupCounts = MUSCLE_GROUPS.map((muscle) => ({
    muscle,
    count: EXERCISES.filter((e) => e.muscle === muscle).length,
    icon: EXERCISES.find((e) => e.muscle === muscle)?.icon || 'fitness_center',
  }));

  return (
    <>
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-xl">fitness_center</span>
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 font-headline">Workouts</h1>
        </div>
        <button onClick={() => navigate('/settings')} className="material-symbols-outlined text-zinc-500 hover:opacity-80 transition-opacity active:scale-95 duration-200">settings</button>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-[430px] mx-auto">
        {/* Search */}
        <div className="relative mb-6">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 placeholder:text-outline-variant text-body-lg shadow-sm"
            placeholder={view === 'plans' ? 'Search workout plans...' : 'Search exercises...'}
            type="text"
          />
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setView('plans')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              view === 'plans'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-surface-container-low text-zinc-500'
            }`}
          >
            Workout Plans
          </button>
          <button
            onClick={() => setView('exercises')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              view === 'exercises'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-surface-container-low text-zinc-500'
            }`}
          >
            Exercise Library
          </button>
        </div>

        {/* ─── WORKOUT PLANS VIEW ─── */}
        {view === 'plans' && (
          <section className="space-y-4">
            {filteredPlans.map((plan) => (
              <motion.div
                key={plan.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/workout-detail/${plan.id}`)}
                className="group relative h-48 rounded-[1.5rem] overflow-hidden flex flex-col justify-end p-6 shadow-lg cursor-pointer"
              >
                <img
                  alt={plan.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={plan.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="relative z-10">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider">
                      {plan.type}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider">
                      {plan.difficulty}
                    </span>
                  </div>
                  <h3 className="text-white font-headline text-xl font-bold tracking-tight">{plan.name}</h3>
                  <p className="text-white/60 text-xs mt-1 font-medium">
                    {plan.duration} • {plan.exerciseIds.length} exercises • ~{plan.calorieEstimate} kcal
                  </p>
                </div>
              </motion.div>
            ))}
          </section>
        )}

        {/* ─── EXERCISE LIBRARY VIEW ─── */}
        {view === 'exercises' && (
          <>
            {/* Muscle Group Filter */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  !selectedCategory ? 'bg-primary text-white' : 'bg-surface-container-low text-zinc-500'
                }`}
              >
                All ({EXERCISES.length})
              </button>
              {muscleGroupCounts.map((mg) => (
                <button
                  key={mg.muscle}
                  onClick={() => setSelectedCategory(selectedCategory === mg.muscle ? null : mg.muscle)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === mg.muscle ? 'bg-primary text-white' : 'bg-surface-container-low text-zinc-500'
                  }`}
                >
                  {mg.muscle} ({mg.count})
                </button>
              ))}
            </div>

            {/* Exercise List */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredExercises.map((ex) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={ex.id}
                    className="bg-surface-container p-4 rounded-2xl flex items-center justify-between group hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={ex.image} alt={ex.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-on-surface text-sm">{ex.name}</h3>
                        <p className="text-[11px] text-on-surface-variant font-medium">
                          {ex.muscle} • {ex.sets}×{ex.reps} • {ex.equipment}
                        </p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                      ex.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-600' :
                      ex.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-600' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {ex.difficulty}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>
    </>
  );
}
