
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppStore } from '../store/useAppStore';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { stats, workoutHistory, getStreak, profile } = useAppStore();

  const displayName = profile?.name || user?.displayName || 'Guest Athlete';
  const photoURL = user?.photoURL || '';
  const email = user?.email || 'guest@fitgenx.app';
  const streak = getStreak();
  const totalWorkouts = workoutHistory.length;
  const totalCalories = workoutHistory.reduce((sum, w) => sum + w.caloriesBurned, 0);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high">
            {photoURL ? (
              <img className="w-full h-full object-cover" src={photoURL} alt="Profile" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
            )}
          </div>
          <h1 className="text-xl font-headline font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">Profile</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/settings')} className="hover:opacity-80 transition-opacity active:scale-95 duration-200">
            <span className="material-symbols-outlined text-zinc-500">settings</span>
          </button>
          <button className="hover:opacity-80 transition-opacity active:scale-95 duration-200">
            <span className="material-symbols-outlined text-zinc-500">notifications</span>
          </button>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8 pb-32">
        {/* Profile Card */}
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-surface-container-high ring-4 ring-primary/10">
              {photoURL ? (
                <img className="w-full h-full object-cover" src={photoURL} alt="Profile" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">person</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="font-headline text-2xl font-extrabold tracking-tight">{displayName}</h2>
              <div className="space-y-0.5">
                <p className="text-on-surface-variant text-sm font-medium">{email}</p>
                {profile?.college && (
                  <p className="text-primary text-[11px] uppercase tracking-wider font-bold">{profile.college}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-3 gap-3">
          <div className="bg-surface-container-low p-5 rounded-2xl text-center">
            <p className="font-headline text-2xl font-extrabold text-primary">{totalWorkouts}</p>
            <p className="font-label text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant mt-1">Workouts</p>
          </div>
          <div className="bg-surface-container-low p-5 rounded-2xl text-center">
            <p className="font-headline text-2xl font-extrabold text-secondary">{streak}</p>
            <p className="font-label text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant mt-1">Day Streak</p>
          </div>
          <div className="bg-surface-container-low p-5 rounded-2xl text-center">
            <p className="font-headline text-2xl font-extrabold text-tertiary">{totalCalories > 1000 ? `${(totalCalories/1000).toFixed(1)}k` : totalCalories}</p>
            <p className="font-label text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant mt-1">Calories</p>
          </div>
        </section>

        {/* Active Minutes */}
        <section className="bg-surface-container-low p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-end">
            <span className="font-label text-[0.6875rem] uppercase tracking-widest font-bold text-secondary">Active Time</span>
            <span className="font-headline text-xl font-bold">{stats.activeMinutes} <span className="text-on-surface-variant text-sm font-normal">mins</span></span>
          </div>
          <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full vitality-gradient rounded-full transition-all duration-500" style={{ width: `${Math.min((stats.activeMinutes / 300) * 100, 100)}%` }}></div>
          </div>
          <p className="text-xs text-on-surface-variant">Goal: 300 minutes per week</p>
        </section>

        {/* Share Progress Card */}
        <section className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-transform">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">share</span>
            </div>
            <div>
              <p className="font-headline font-extrabold text-sm text-primary uppercase tracking-tight">Share Your Progress</p>
              <p className="text-xs text-on-surface-variant font-medium">Show your streak to the world!</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
        </section>

        {/* Workout History */}
        {workoutHistory.length > 0 && (
          <section className="space-y-4">
            <h3 className="font-headline text-xl font-bold">Workout History</h3>
            <div className="space-y-3">
              {workoutHistory.slice(0, 10).map((entry) => (
                <div key={entry.id} className="bg-surface-container-lowest p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl vitality-gradient flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-white text-sm">fitness_center</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{entry.planName}</p>
                      <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {Math.round(entry.duration / 60)} min
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-tertiary">{entry.caloriesBurned} kcal</p>
                    <p className="text-[10px] text-on-surface-variant">{entry.exercisesCompleted}/{entry.totalExercises} exercises</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="space-y-3 pb-8">
          <button
            onClick={handleSignOut}
            className="w-full py-4 bg-red-500/10 text-red-500 rounded-full font-bold active:scale-[0.98] transition-transform border border-red-500/20"
          >
            Sign Out
          </button>
        </div>
      </main>
    </>
  );
}
