import { useNavigate, useLocation } from 'react-router-dom';
import { useSettingsStore, QUICK_ACTION_OPTIONS } from '../../stores/settingsStore';

export default function QuickActionButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const quickActionPath = useSettingsStore((s) => s.quickActionPath);

  // Don't show on login, onboarding, or the tracking page (has its own controls)
  const hiddenPaths = ['/', '/login', '/onboarding', '/track', '/settings'];
  if (hiddenPaths.includes(location.pathname)) return null;

  // Don't show if we're already on the quick action page
  if (location.pathname === quickActionPath) return null;

  const option = QUICK_ACTION_OPTIONS.find((o) => o.path === quickActionPath);
  const icon = option?.icon || 'add';

  return (
    <button
      onClick={() => navigate(quickActionPath)}
      className="fixed bottom-24 right-4 z-[55] h-12 px-4 rounded-full bg-zinc-800/90 backdrop-blur-md text-white flex items-center gap-2 active:scale-95 hover:bg-zinc-700/90 transition-all duration-200 border border-zinc-700/50 shadow-lg shadow-black/30"
      aria-label={`Quick action: ${option?.label || 'Navigate'}`}
    >
      <span
        className="material-symbols-outlined text-[20px] text-primary"
        style={{ fontVariationSettings: '"FILL" 1' }}
      >
        {icon}
      </span>
      <span className="text-xs font-bold tracking-wide text-zinc-200">{option?.label}</span>
    </button>
  );
}
