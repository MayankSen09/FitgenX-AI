import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EXERCISES = [
  { id: 1, name: 'Dumbbell Press', category: 'Chest', items: '42 Exercises', icon: 'fitness_center', color: 'secondary' },
  { id: 2, name: 'Incline Bench', category: 'Chest', items: '42 Exercises', icon: 'fitness_center', color: 'secondary' },
  { id: 3, name: 'Lat Pulldown', category: 'Back', items: '38 Items', icon: 'fitness_center', color: 'tertiary' },
  { id: 4, name: 'Deadlift', category: 'Back', items: '38 Items', icon: 'fitness_center', color: 'tertiary' },
  { id: 5, name: 'Squats', category: 'Legs', items: '54 Items', icon: 'directions_run', color: 'secondary' },
  { id: 6, name: 'Leg Press', category: 'Legs', items: '54 Items', icon: 'directions_run', color: 'secondary' },
  { id: 7, name: 'Plank', category: 'Core', items: '29 Items', icon: 'accessibility_new', color: 'primary' },
  { id: 8, name: 'Crunches', category: 'Core', items: '29 Items', icon: 'accessibility_new', color: 'primary' },
  { id: 9, name: 'Bicep Curls', category: 'Arms', items: '41 Items', icon: 'exercise', color: 'on-secondary-fixed-variant' },
];

export default function WorkoutPlans() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isImmersive, setIsImmersive] = useState(false);

  const filteredExercises = EXERCISES.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? ex.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(EXERCISES.map(ex => ex.category)));

  return (
    <>
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden">
            <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQf0_GtxUATyUintzit17pB72IWzdycPulhBYVln6IyH8_egzv0tlkZghjSXefNlb40nTZ_mBkazfyMX5-89tGmXo3Kg3zwFpyRq4La9pE4XhUMKZYEwAX3wW2eqlQGiyzfvdgzMrlZVcK-SEUTjtW-YpRSwPWMpuedaFnHXmYUjibiMOdNtxewEdg_ta_t_MNspdXJoFiPc4s9yxn35YVF98BsPrMfNSpz_ReWOSRjsJDkHNi69UR9KYxu48Alr5Tmx-pOCZz7Dg"/>
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 font-headline">Goals</h1>
        </div>
        <div className="flex gap-4">
          <button className="material-symbols-outlined text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity active:scale-95 duration-200" data-icon="notifications">notifications</button>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-5xl mx-auto max-w-[430px]">
        <section className="mb-10">
          <h2 className="font-headline text-[1.75rem] font-bold leading-tight mb-6">Exercise Library</h2>
          <div className="relative mb-8">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 placeholder:text-outline-variant text-body-lg shadow-sm" 
              placeholder="Search exercises..." 
              type="text"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              layout
              onClick={() => setSelectedCategory(null)}
              className={`col-span-2 p-6 rounded-2xl flex flex-col justify-between group cursor-pointer overflow-hidden relative transition-all ${!selectedCategory ? 'vitality-gradient text-white ring-4 ring-secondary/20' : 'bg-surface-container-low'}`}
            >
              <div className="z-10">
                <span className={`font-label text-[10px] font-bold tracking-widest uppercase ${!selectedCategory ? 'text-white/80' : 'text-secondary'}`}>DISCOVER</span>
                <h3 className="font-headline text-2xl font-bold mt-1">All Workouts</h3>
              </div>
              <p className="z-10 text-sm mt-1 opacity-80">{EXERCISES.length} Exercises total</p>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-10" data-icon="explore">explore</span>
            </motion.div>

            {categories.map((cat) => {
              const catData = EXERCISES.find(ex => ex.category === cat)!;
              const isSelected = selectedCategory === cat;
              return (
                <motion.div 
                  layout
                  key={cat}
                  onClick={() => setSelectedCategory(isSelected ? null : cat)}
                  className={`p-5 rounded-2xl flex flex-col justify-between transition-all cursor-pointer ${isSelected ? 'ring-2 ring-secondary bg-secondary-container/10' : 'bg-surface-container-low hover:bg-surface-container'}`}
                >
                  <span className={`material-symbols-outlined text-3xl ${isSelected ? 'text-secondary' : 'text-zinc-400'}`} data-icon={catData.icon}>{catData.icon}</span>
                  <div>
                    <h3 className="font-headline text-lg font-bold">{cat}</h3>
                    <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider opacity-60">{catData.items}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline text-xl font-bold">Recommended</h2>
            <button className="text-secondary font-bold text-xs">See All</button>
          </div>

          <div className="space-y-4">
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
                    <div className="w-14 h-14 rounded-xl bg-zinc-900 overflow-hidden flex items-center justify-center">
                       <span className="material-symbols-outlined text-secondary opacity-50" data-icon={ex.icon}>{ex.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-on-surface">{ex.name}</h3>
                      <p className="text-xs text-on-surface-variant font-medium">{ex.category} • 12 mins</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsImmersive(true)}
                    className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary active:scale-90 transition-transform"
                  >
                    <span className="material-symbols-outlined">play_arrow</span>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Immersive Workout Overlay */}
      <AnimatePresence>
        {isImmersive && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="fixed inset-0 z-[100] bg-zinc-950 text-white flex flex-col"
          >
            <button onClick={() => setIsImmersive(false)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>

            <div className="p-8 pt-16 flex flex-col items-center">
              <div className="w-full max-w-md h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '33%' }} className="h-full vitality-gradient"></motion.div>
              </div>
              <span className="font-label text-sm tracking-widest text-zinc-400 uppercase font-bold">Exercise 3 of 10</span>
              <h2 className="font-headline text-4xl font-bold mt-4">Incline Bench</h2>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
              <div className="relative mb-12">
                <div className="w-64 h-64 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" fill="none" r="126" stroke="rgba(255,255,255,0.05)" strokeWidth="8"></circle>
                    <circle cx="50%" cy="50%" fill="none" r="126" stroke="url(#it-grad)" strokeDasharray="792" strokeDashoffset="200" strokeLinecap="round" strokeWidth="8"></circle>
                    <defs>
                      <linearGradient id="it-grad" x1="0%" x2="100%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#AAF0D1"></stop>
                        <stop offset="100%" stopColor="#007AFF"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="text-7xl font-headline font-bold tabular-nums">20:00</span>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-panel-dark px-4 py-2 rounded-full text-xs font-bold text-secondary">TIME REMAINING</div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 w-full max-w-sm mb-12">
                <div className="flex flex-col items-center">
                  <span className="text-zinc-500 font-label uppercase tracking-widest text-xs">Set</span>
                  <span className="text-3xl font-headline font-bold">2 / 4</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-zinc-500 font-label uppercase tracking-widest text-xs">Target Reps</span>
                  <span className="text-3xl font-headline font-bold">12</span>
                </div>
              </div>
            </div>

            <div className="p-12 pb-20 flex flex-col items-center bg-gradient-to-t from-zinc-950 to-transparent">
              <button 
                onClick={() => setIsImmersive(false)}
                className="w-full max-w-md bg-white text-zinc-950 py-6 rounded-full font-bold text-xl active:scale-95 transition-transform flex items-center justify-center gap-3"
              >
                Next Set
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="mt-8 text-zinc-500 font-bold hover:text-white transition-colors">Pause Workout</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

