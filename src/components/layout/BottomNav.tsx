
import { Link } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 rounded-t-[2rem] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex justify-around items-center px-4 pb-8 pt-4 shadow-[0_-12px_40px_rgba(0,0,0,0.06)]">
<Link className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 transition-transform duration-200" to="/dashboard">
<span className="material-symbols-outlined text-[22px]" data-icon="home">home</span>
<span className="Inter text-[9px] uppercase tracking-wider font-bold mt-1">Home</span>
</Link>
<Link className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 transition-transform duration-200" to="/workouts">
<span className="material-symbols-outlined text-[22px]" data-icon="insights">insights</span>
<span className="Inter text-[9px] uppercase tracking-wider font-bold mt-1">Explore</span>
</Link>
<Link className="flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 bg-emerald-100/50 dark:bg-emerald-900/30 rounded-xl px-2 py-1.5 active:scale-90 transition-transform duration-200" to="/track">
<span className="material-symbols-outlined text-[22px]" data-icon="add_circle">add_circle</span>
<span className="Inter text-[9px] uppercase tracking-wider font-bold mt-1">Track</span>
</Link>
<Link className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 transition-transform duration-200" to="/social">
<span className="material-symbols-outlined text-[22px]" data-icon="group">group</span>
<span className="Inter text-[9px] uppercase tracking-wider font-bold mt-1">Social</span>
</Link>
<Link className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 transition-transform duration-200" to="/profile">
<span className="material-symbols-outlined text-[22px]" data-icon="person">person</span>
<span className="Inter text-[9px] uppercase tracking-wider font-bold mt-1">Profile</span>
</Link>
</nav>
  );
}
