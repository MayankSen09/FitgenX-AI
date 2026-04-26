
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSettingsStore, QUICK_ACTION_OPTIONS } from '../../stores/settingsStore';
import { useCreatureStore } from '../../stores/creatureStore';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const quickActionPath = useSettingsStore((s) => s.quickActionPath);
  const quickOption = QUICK_ACTION_OPTIONS.find((o) => o.path === quickActionPath);
  const { getStage, getProgress } = useCreatureStore();
  const stage = getStage();
  const progress = getProgress();

  const isCreatureMode = quickActionPath === '/creature';

  const leftItems = [
    { label: 'Home', icon: 'home', to: '/dashboard' },
    { label: 'Explore', icon: 'insights', to: '/workouts' },
  ];

  const rightItems = [
    { label: 'Social', icon: 'group', to: '/social' },
    { label: 'Profile', icon: 'person', to: '/profile' },
  ];

  const renderNavItem = (item: { label: string; icon: string; to: string }) => {
    const isActive = path === item.to;
    return (
      <Link
        key={item.to}
        className={`flex flex-col items-center justify-center transition-all duration-300 active:scale-90 relative ${
          isActive ? 'text-primary scale-110' : 'text-zinc-400 dark:text-zinc-500'
        }`}
        to={item.to}
      >
        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}>{item.icon}</span>
        <span className="text-[9px] uppercase tracking-wider font-bold mt-1">{item.label}</span>
        {isActive && <div className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full"></div>}
      </Link>
    );
  };

  const isCenterActive = path === quickActionPath;

  return (
    <nav className="fixed bottom-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-[60] rounded-t-[2rem] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl flex justify-around items-end px-4 pb-8 pt-4 shadow-[0_-12px_40px_rgba(0,0,0,0.1)] border-t border-outline-variant/5">
      {leftItems.map(renderNavItem)}

      {/* Center Quick Action Button — elevated */}
      <div className="relative -mt-8 flex flex-col items-center">
        {isCreatureMode ? (
          /* Creature mode: show emoji with XP ring */
          <button
            onClick={() => navigate(quickActionPath)}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 active:scale-90 relative overflow-hidden bg-surface-container-low border-2 border-outline-variant/10"
            style={{ boxShadow: `0 4px 16px ${stage.glow}` }}
          >
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="25" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="3" />
              <circle
                cx="28" cy="28" r="25" fill="none"
                stroke={stage.color}
                strokeWidth="3"
                strokeDasharray={`${progress * 1.571} 157.1`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
            </svg>
            <span className="text-xl relative z-10">{stage.emoji}</span>
          </button>
        ) : (
          /* Normal mode: show material icon */
          <button
            onClick={() => navigate(quickActionPath)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 active:scale-90 ${
              isCenterActive
                ? 'bg-primary shadow-primary/30'
                : 'bg-primary shadow-primary/20 hover:shadow-primary/40'
            }`}
          >
            <span
              className="material-symbols-outlined text-white text-[26px]"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              {quickOption?.icon || 'add'}
            </span>
          </button>
        )}
        <span className={`text-[9px] uppercase tracking-wider font-bold mt-1.5 ${isCenterActive ? 'text-primary' : 'text-zinc-400 dark:text-zinc-500'}`}>
          {quickOption?.label || 'Action'}
        </span>
      </div>

      {rightItems.map(renderNavItem)}
    </nav>
  );
}
