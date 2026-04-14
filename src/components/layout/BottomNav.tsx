
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { label: 'Home', icon: 'home', to: '/dashboard' },
    { label: 'Explore', icon: 'insights', to: '/workouts' },
    { label: 'Track', icon: 'add_circle', to: '/track' },
    { label: 'Coach', icon: 'smart_toy', to: '/ai-coach' },
    { label: 'Social', icon: 'group', to: '/social' },
    { label: 'Profile', icon: 'person', to: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-[60] rounded-t-[2rem] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl flex justify-around items-center px-4 pb-8 pt-4 shadow-[0_-12px_40px_rgba(0,0,0,0.1)] border-t border-outline-variant/5">
      {navItems.map((item) => {
        const isActive = path === item.to;
        return (
          <Link 
            key={item.to}
            className={`flex flex-col items-center justify-center transition-all duration-300 active:scale-90 ${
              isActive ? 'text-primary scale-110' : 'text-zinc-400 dark:text-zinc-500'
            }`} 
            to={item.to}
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}>{item.icon}</span>
            <span className="text-[9px] uppercase tracking-wider font-bold mt-1">{item.label}</span>
            {isActive && <div className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full"></div>}
          </Link>
        );
      })}
    </nav>
  );
}
