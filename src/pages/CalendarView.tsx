import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { WORKOUT_PLANS } from '../data/workoutPlans';

export default function CalendarView() {
  const navigate = useNavigate();
  const { getStreak, workoutHistory, weeklySchedule } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const streak = getStreak();

  // Calendar generation logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  // Determine workouts for selected date
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const historyForSelected = workoutHistory.filter(w => w.date.startsWith(selectedDateStr));

  // Determine planned workout for selected date
  const dayOfWeek = selectedDate.getDay();
  const plannedId = weeklySchedule[dayOfWeek];
  const plannedWorkout = WORKOUT_PLANS.find(p => p.id === plannedId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-bg-primary pb-32"
    >
      {/* Header */}
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex items-center justify-between px-6 py-4 border-b border-outline-variant/5">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-zinc-500">arrow_back</span>
        </button>
        <h1 className="text-xl font-headline font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">Calendar & Plans</h1>
        <div className="w-10" />
      </header>

      <main className="pt-24 px-6 max-w-[430px] mx-auto space-y-8">
        {/* Streak Overview */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex justify-between items-center"
        >
          <div className="z-10">
            <p className="text-[0.6rem] font-bold font-label uppercase tracking-widest text-zinc-500 mb-1">Current Streak</p>
            <h2 className="text-4xl font-headline font-extrabold flex items-center gap-2">
              {streak} <span className="text-2xl text-zinc-400">Days</span>
              <span className="material-symbols-outlined text-zinc-400" style={{ fontVariationSettings: '"FILL" 1' }}>local_fire_department</span>
            </h2>
          </div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-zinc-800/50 rounded-full blur-3xl pointer-events-none"></div>
        </motion.div>

        {/* Calendar View */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/5 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline text-xl font-extrabold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-secondary/10 transition-colors">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-secondary/10 transition-colors">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-[0.6rem] font-bold text-on-surface-variant uppercase tracking-widest">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-2 gap-x-2">
            <AnimatePresence mode="popLayout">
              {days.map((d, i) => {
                if (!d) return <div key={`empty-${i}`} className="h-10"></div>;
                const dateStr = d.toISOString().split('T')[0];
                const hasWorkout = workoutHistory.some(w => w.date.startsWith(dateStr));
                const isSelected = selectedDate.toDateString() === d.toDateString();
                const isToday = new Date().toDateString() === d.toDateString();
                
                return (
                  <motion.button
                    key={d.toISOString()}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedDate(d)}
                    className={`h-10 w-full rounded-xl flex items-center justify-center text-sm font-bold transition-colors relative
                      ${isSelected ? 'bg-zinc-900 text-white shadow-md' : 'hover:bg-surface-container-high'}
                      ${isToday && !isSelected ? 'text-secondary ring-2 ring-secondary/30 ring-inset' : ''}
                      ${!isSelected && !isToday ? 'text-on-surface' : ''}
                    `}
                  >
                    {d.getDate()}
                    {hasWorkout && (
                      <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-secondary' : 'bg-secondary'}`}></span>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Selected Date Details */}
        <motion.div
          key={selectedDate.toISOString()}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring' }}
          className="space-y-4"
        >
          <h3 className="font-headline text-lg font-extrabold flex justify-between items-end">
            {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
            {new Date().toDateString() === selectedDate.toDateString() && (
               <span className="text-[0.6rem] text-secondary uppercase tracking-widest font-label ml-2 mb-0.5">Today</span>
            )}
          </h3>

          {historyForSelected.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-[0.6rem] font-bold uppercase tracking-widest text-outline">Completed Workouts</h4>
              {historyForSelected.map((entry, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={entry.id} 
                  className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between border border-outline-variant/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl vitality-gradient flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-white text-sm">check</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{entry.planName}</p>
                      <p className="text-[10px] text-on-surface-variant font-semibold">
                        {Math.round(entry.duration / 60)} min • {entry.caloriesBurned} kcal
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[0.6rem] font-bold uppercase tracking-widest text-outline">Planned Workout</h4>
                <button onClick={() => navigate('/planning')} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1 active:scale-95 transition-transform">
                  <span className="material-symbols-outlined text-[14px]">edit_calendar</span>
                  Edit Plan
                </button>
              </div>
              {plannedWorkout ? (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/workout-detail/${plannedWorkout.id}`)}
                  className="bg-surface-container-low p-4 rounded-2xl flex items-center gap-4 border border-outline-variant/5 cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden relative">
                    <img src={plannedWorkout.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/20"></div>
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-surface-container-highest text-[0.6rem] font-bold uppercase tracking-widest mb-1">{plannedWorkout.type}</span>
                    <p className="font-bold text-sm">{plannedWorkout.name}</p>
                    <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">
                      {plannedWorkout.duration} • ~{plannedWorkout.calorieEstimate} kcal
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-zinc-400 ml-auto group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">arrow_forward_ios</span>
                </motion.div>
              ) : (
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/5 text-center">
                  <span className="material-symbols-outlined text-3xl text-zinc-300 dark:text-zinc-600 block mb-2">event_available</span>
                  <p className="text-sm text-zinc-500 font-medium">Rest Day</p>
                  <button onClick={() => navigate('/planning')} className="text-xs text-zinc-400 mt-2 underline">Change plan</button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </motion.div>
  );
}
