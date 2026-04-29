import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { WORKOUT_PLANS } from '../data/workoutPlans';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function PlanningView() {
  const navigate = useNavigate();
  const { weeklySchedule, updateSchedule } = useAppStore();
  const [editingDay, setEditingDay] = useState<number | null>(null);

  const handleUpdate = (planId: string) => {
    if (editingDay !== null) {
      updateSchedule(editingDay, planId);
      setEditingDay(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg-primary pb-32"
    >
      {/* Header */}
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex items-center justify-between px-6 py-4 border-b border-outline-variant/5">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-zinc-500">arrow_back</span>
        </button>
        <h1 className="text-xl font-headline font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">Weekly Planning</h1>
        <div className="w-10" />
      </header>

      <main className="pt-24 px-6 max-w-[430px] mx-auto space-y-6">
        <div className="space-y-4">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Customize your weekly workout routine. Click on a day to change the assigned plan.
          </p>
          
          <div className="space-y-3">
            {DAYS.map((day, index) => {
              const planId = weeklySchedule[index];
              const plan = WORKOUT_PLANS.find(p => p.id === planId);
              const isToday = new Date().getDay() === index;

              return (
                <motion.div
                  key={day}
                  layoutId={day}
                  onClick={() => setEditingDay(index)}
                  className={`bg-surface-container-low p-4 rounded-2xl flex items-center justify-between border border-outline-variant/5 cursor-pointer hover:shadow-md transition-shadow ${isToday ? 'ring-2 ring-zinc-900/20' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-bold text-[10px] uppercase tracking-tighter">
                      {day.substring(0, 3)}
                    </div>
                    <div>
                      <p className="font-bold text-sm flex items-center gap-2">
                        {day}
                        {isToday && <span className="text-[10px] bg-zinc-900/10 text-zinc-900 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Today</span>}
                      </p>
                      <p className="text-xs text-on-surface-variant font-medium">
                        {plan ? plan.name : 'Rest Day'}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-zinc-400">edit</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Plan Selection Modal */}
      <AnimatePresence>
        {editingDay !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingDay(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white dark:bg-zinc-900 rounded-t-[2.5rem] p-8 z-[70] max-h-[80vh] overflow-y-auto no-scrollbar shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-outline-variant/20 rounded-full mx-auto mb-8" />
              <h2 className="text-2xl font-headline font-bold mb-6">Select Plan for {DAYS[editingDay]}</h2>
              <div className="grid gap-4">
                <button
                  onClick={() => handleUpdate('')}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-high border border-outline-variant/10 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-zinc-400">bedtime</span>
                  </div>
                  <div>
                    <p className="font-bold">Rest Day</p>
                    <p className="text-xs text-on-surface-variant">No workout scheduled</p>
                  </div>
                </button>
                {WORKOUT_PLANS.map(plan => (
                  <button
                    key={plan.id}
                    onClick={() => handleUpdate(plan.id)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-high border border-outline-variant/10 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <img src={plan.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <div>
                      <p className="font-bold">{plan.name}</p>
                      <p className="text-xs text-on-surface-variant">{plan.type} • {plan.duration}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
