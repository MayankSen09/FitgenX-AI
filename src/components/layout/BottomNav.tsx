import { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore, QUICK_ACTION_OPTIONS } from '../../stores/settingsStore';
import { useCreatureStore } from '../../stores/creatureStore';

const QUICK_ACTIONS = [
  { label: 'Companion', icon: 'pets', path: '/creature' },
  { label: 'AI Coach', icon: 'smart_toy', path: '/ai-coach' },
  { label: 'Track Run', icon: 'directions_run', path: '/track' },
  { label: 'Workouts', icon: 'fitness_center', path: '/workouts' },
  { label: 'Timer', icon: 'timer', path: '/timer' },
  { label: 'Challenges', icon: 'emoji_events', path: '/challenges' },
  { label: 'Analytics', icon: 'analytics', path: '/analytics' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { quickActionPath, setQuickActionPath } = useSettingsStore();
  const quickOption = QUICK_ACTION_OPTIONS.find((o) => o.path === quickActionPath);
  const { getStage } = useCreatureStore();
  const stage = getStage();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const wasLongPressed = useRef(false);

  const isCreatureMode = quickActionPath === '/creature';
  const isCenterActive = path === quickActionPath;

  const handleStartPress = () => {
    wasLongPressed.current = false;
    setIsLongPressing(true);
    longPressTimer.current = setTimeout(() => {
      setIsMenuOpen(true);
      wasLongPressed.current = true;
      if (window.navigator.vibrate) window.navigator.vibrate(60);
    }, 400);
  };

  const handleEndPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    setIsLongPressing(false);
  };

  const handleButtonClick = () => {
    if (wasLongPressed.current) {
      wasLongPressed.current = false;
      return;
    }
    if (isMenuOpen) setIsMenuOpen(false);
    else navigate(quickActionPath);
  };

  const navItems = [
    { label: 'Home', icon: 'home', to: '/dashboard' },
    { label: 'Explore', icon: 'insights', to: '/workouts' },
    { isCenter: true },
    { label: 'Social', icon: 'group', to: '/social' },
    { label: 'Profile', icon: 'person', to: '/profile' },
  ];

  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-[100] bg-zinc-950/70 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      <motion.nav 
        animate={{ y: (path === '/track' || path === '/analytics') ? 150 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-10 inset-x-0 mx-auto w-[90%] max-w-[340px] z-[110] rounded-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-3xl flex items-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/5 px-2 py-3"
      >
        {navItems.map((item, idx) => {
          if (item.isCenter) {
            return (
              <div key="center" className="flex-1 relative flex flex-col items-center justify-center">
                <div className="absolute top-[-32px]">
                  {/* Radial Menu Items */}
                  <AnimatePresence>
                    {isMenuOpen && QUICK_ACTIONS.map((action, i) => {
                      const span = 180;
                      const angle = (i * (span / (QUICK_ACTIONS.length - 1))) - 180;
                      const radian = (angle * Math.PI) / 180;
                      const radius = 130; 
                      const x = Math.cos(radian) * radius;
                      const y = Math.sin(radian) * radius;

                      return (
                        <motion.button
                          key={action.path}
                          initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                          animate={{ 
                            scale: 1, x, y, opacity: 1,
                            transition: { delay: i * 0.01, type: "spring", stiffness: 450, damping: 32 } 
                          }}
                          exit={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickActionPath(action.path);
                            navigate(action.path);
                            setIsMenuOpen(false);
                          }}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 shadow-lg transition-all ${
                            action.path === quickActionPath ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white' : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-100 dark:border-zinc-700'
                          }`}>
                            <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>

                  <motion.button
                    onPointerDown={handleStartPress}
                    onPointerUp={handleEndPress}
                    onClick={handleButtonClick}
                    animate={{ scale: isLongPressing ? 1.1 : 1 }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.2)] z-[130] transition-all duration-300 ${
                      isCenterActive 
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' 
                        : 'bg-zinc-900/90 dark:bg-zinc-800 text-white/90 dark:text-zinc-100'
                    }`}
                  >
                    {isCreatureMode && !isMenuOpen ? (
                      <stage.icon size={26} color={stage.color} />
                    ) : (
                      <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                        {isMenuOpen ? 'close' : (quickOption?.icon || 'add')}
                      </span>
                    )}
                  </motion.button>
                </div>
                {/* Center Label */}
                <span className={`text-[8px] uppercase tracking-[0.2em] font-black mt-8 transition-colors whitespace-nowrap ${isCenterActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
                  {isMenuOpen ? 'Close' : (quickOption?.label || 'Action')}
                </span>
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 transition-all ${isCenterActive ? 'bg-zinc-900 dark:bg-white opacity-100' : 'bg-transparent opacity-0'}`} />
              </div>
            );
          }

          const isActive = path === item.to;
          return (
            <Link
              key={item.to || idx}
              to={item.to || '#'}
              className="flex-1 flex flex-col items-center justify-center py-1 transition-all"
            >
              <span className={`material-symbols-outlined text-[22px] transition-all duration-300 ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`} style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}>
                {item.icon}
              </span>
              <span className={`text-[8px] uppercase tracking-wider font-black mt-1.5 transition-colors ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
                {item.label}
              </span>
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 transition-all ${isActive ? 'bg-zinc-900 dark:bg-white opacity-100' : 'bg-transparent opacity-0'}`} />
            </Link>
          );
        })}
      </motion.nav>
    </>
  );
}
