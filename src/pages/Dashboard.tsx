import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAppStore } from '../store/useAppStore';
import { getTodaysWorkouts } from '../data/workoutPlans';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, getStreak, workoutHistory, profile } = useAppStore();

  const userName = profile?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Athlete';
  const userPhoto = user?.photoURL || '';
  const streak = getStreak();
  const todaysWorkouts = getTodaysWorkouts();

  // Build the week display
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const weekDays = dayLabels.map((label, i) => {
    const dateObj = new Date(today);
    dateObj.setDate(today.getDate() - dayOfWeek + i);
    const dateStr = dateObj.toISOString().split('T')[0];
    const hasWorkout = workoutHistory.some((w) => w.date.startsWith(dateStr));
    const isToday = i === dayOfWeek;
    const isPast = i < dayOfWeek;
    return { label, date: dateObj.getDate(), isToday, isPast, hasWorkout };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-bg-primary min-h-screen pb-32"
    >
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex justify-between items-center px-6 py-4 border-b border-outline-variant/5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high transition-transform active:scale-95 cursor-pointer border-none p-0 outline-none ring-2 ring-primary/10">
            {userPhoto ? (
              <img alt="Profile" className="w-full h-full object-cover" src={userPhoto} referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">person</span>
              </div>
            )}
          </button>
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-secondary font-label leading-none">
              {profile?.college || 'Aura Peak'}
            </p>
            <h1 className="text-xl font-extrabold tracking-tighter text-zinc-900 dark:text-zinc-50 font-headline">Welcome, {userName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity p-2 bg-surface-container-low rounded-full active:scale-95">notifications</button>
        </div>
      </header>

      <main className="mt-24 px-6 max-w-[430px] mx-auto space-y-10">

        {/* ─── Activity Streak ─── */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-headline text-lg font-extrabold tracking-tight">Activity Streak</h2>
            <span className="text-tertiary font-bold font-label text-[0.6rem] uppercase tracking-widest">
              {streak > 0 ? `${streak} DAY STREAK` : 'START YOUR STREAK'}
            </span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className={`text-[0.6rem] font-bold font-label ${day.isToday ? 'text-secondary' : 'text-on-surface-variant'}`}>{day.label}</span>
                <div className={`w-10 h-14 rounded-full flex items-center justify-center transition-all ${
                  day.isToday ? 'bg-secondary text-white shadow-lg shadow-secondary/20 ring-2 ring-secondary/20 ring-offset-2' :
                  day.hasWorkout ? 'vitality-gradient text-white shadow-sm' :
                  day.isPast ? 'bg-red-500/10 border border-red-500/20' : 'bg-surface-container-low border border-outline-variant/10'
                }`}>
                  {day.hasWorkout ? (
                    <span className="material-symbols-outlined text-base">check</span>
                  ) : (
                    <span className="text-sm font-bold">{day.date}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Stats Grid ─── */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/ai-coach')}
            className="col-span-1 text-left p-6 rounded-2xl bg-zinc-900 text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-48 cursor-pointer border border-white/5"
          >
            <div className="z-10">
              <p className="text-[0.6rem] font-bold font-label uppercase tracking-widest text-secondary mb-1">AI Coach</p>
              <h3 className="font-headline text-2xl font-black italic">PRO</h3>
            </div>
            <div className="z-10">
              <span className="font-headline text-5xl font-extrabold tracking-tighter text-white">A<span className="text-secondary text-2xl">+</span></span>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 vitality-gradient opacity-30 rounded-full blur-3xl pointer-events-none"></div>
          </motion.button>

          <div className="col-span-1 flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-surface-container-low flex flex-col justify-between h-[calc(50%-8px)] border border-outline-variant/5 shadow-sm">
               <div className="flex justify-between items-start">
                 <span className="material-symbols-outlined text-secondary text-xl">footprint</span>
                 <p className="text-[0.6rem] font-bold font-label uppercase tracking-widest text-outline">Steps</p>
               </div>
               <p className="font-headline font-bold text-xl">{stats.steps > 0 ? `${(stats.steps / 1000).toFixed(1)}k` : '0'}</p>
            </div>
            <div className="p-5 rounded-2xl bg-surface-container-low flex flex-col justify-between h-[calc(50%-8px)] border border-outline-variant/5 shadow-sm">
               <div className="flex justify-between items-start">
                 <span className="material-symbols-outlined text-tertiary text-xl">local_fire_department</span>
                 <p className="text-[0.6rem] font-bold font-label uppercase tracking-widest text-outline">Burn</p>
               </div>
               <p className="font-headline font-bold text-xl">{stats.calories}<span className="text-xs ml-0.5">kcal</span></p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-2 p-6 rounded-2xl bg-secondary-container/10 border border-secondary/10 relative overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/20 rounded-2xl">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>auto_awesome</span>
              </div>
              <div>
                <p className="font-headline text-md font-extrabold text-on-surface">Today's Focus</p>
                <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                  {todaysWorkouts.length > 0 
                    ? <>Your scheduled workout is <span className="text-secondary font-bold">{todaysWorkouts[0].name}</span>. Estimated burn: <span className="text-secondary font-bold">{todaysWorkouts[0].calorieEstimate} kcal</span>.</>
                    : <>Rest day! Recovery is just as important as training.</>
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Today's Routine ─── */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline text-lg font-extrabold tracking-tight">Today's Routine</h2>
            <button onClick={() => navigate('/workouts')} className="text-secondary font-bold text-xs uppercase tracking-widest">Explore All</button>
          </div>
          <div className="flex flex-col gap-6">
            {todaysWorkouts.map((workout) => (
              <motion.div
                whileTap={{ scale: 0.98 }}
                key={workout.id}
                onClick={() => navigate(`/workout-detail/${workout.id}`)}
                className="group relative h-56 rounded-[2rem] overflow-hidden flex flex-col justify-end p-8 shadow-lg cursor-pointer"
              >
                <img alt={workout.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={workout.image}/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="relative z-10 flex justify-between items-end">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-secondary/80 backdrop-blur-md text-white text-[0.6rem] font-bold uppercase tracking-widest mb-3">{workout.type}</span>
                    <h3 className="text-white font-headline text-2xl font-bold tracking-tight">{workout.name}</h3>
                    <p className="text-white/60 text-xs mt-1 font-medium">{workout.duration} • {workout.difficulty} • ~{workout.calorieEstimate} kcal</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-xl">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>play_arrow</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── Recent Activity ─── */}
        {workoutHistory.length > 0 && (
          <section>
            <h2 className="font-headline text-lg font-extrabold tracking-tight mb-6">Recent Activity</h2>
            <div className="space-y-3">
              {workoutHistory.slice(0, 3).map((entry) => (
                <div key={entry.id} className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between border border-outline-variant/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl vitality-gradient flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-sm">fitness_center</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{entry.planName}</p>
                      <p className="text-[10px] text-on-surface-variant font-semibold">
                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {Math.round(entry.duration / 60)} min
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-tertiary">{entry.caloriesBurned} kcal</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </motion.div>
  );
}
