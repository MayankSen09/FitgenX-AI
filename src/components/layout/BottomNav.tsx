import { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore, QUICK_ACTION_OPTIONS } from '../../stores/settingsStore';
import { useCreatureStore } from '../../stores/creatureStore';

const QUICK_ACTIONS = [
  { label: 'Companion', icon: 'pets', path: '/creature' },
  { label: 'AI Coach', icon: 'smart_toy', path: '/ai-coach' },
  { label: 'Track Run', icon: 'directions_run', path: '/track' },
  { label: 'Journey', icon: 'route', path: '/journey' },
  { label: 'Workouts', icon: 'fitness_center', path: '/workouts' },
  { label: 'Timer', icon: 'timer', path: '/timer' },
  { label: 'Challenges', icon: 'emoji_events', path: '/challenges' },
  { label: 'Analytics', icon: 'analytics', path: '/analytics' },
];

// Radial geometry: place N items evenly on a semicircle arc above the center button.
// Arc spans from 180° (left) to 0° (right), i.e. the top half.
// 0° = right, 90° = bottom, 180° = left, 270° = top  (standard math convention)
// We want items across the top, so from 180° to 360° (or equivalently 180° to 0° going CCW).
// Using: startAngle=180, endAngle=0 going counter-clockwise through 270° (top).
function getRadialPosition(index: number, total: number, radius: number) {
  // Distribute evenly from 170° to 10° (a 160° arc across the top, centered on 90° / straight up)
  // 170° = left-up, 90° = straight up, 10° = right-up
  const arcStart = 170; // degrees – left side
  const arcEnd = 10;    // degrees – right side
  const angleDeg = arcStart + (index / (total - 1)) * (arcEnd - arcStart);
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.cos(angleRad) * radius,
    y: -Math.sin(angleRad) * radius, // negate because CSS y goes downward
  };
}

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

  const leftNav = [
    { label: 'Home', icon: 'home', to: '/dashboard' },
    { label: 'Explore', icon: 'insights', to: '/workouts' },
  ];
  const rightNav = [
    { label: 'Social', icon: 'group', to: '/social' },
    { label: 'Profile', icon: 'person', to: '/profile' },
  ];

  const renderNavItem = (item: { label: string; icon: string; to: string }, idx: number) => {
    const isActive = path === item.to;
    return (
      <Link
        key={item.to || idx}
        to={item.to}
        className="flex flex-col items-center justify-center w-[60px] py-1 transition-all"
      >
        <span
          className={`material-symbols-outlined text-[22px] transition-all duration-300 ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}
          style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}
        >
          {item.icon}
        </span>
        <span className={`text-[8px] uppercase tracking-wider font-black mt-1.5 transition-colors ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
          {item.label}
        </span>
        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 transition-all ${isActive ? 'bg-zinc-900 dark:bg-white opacity-100' : 'bg-transparent opacity-0'}`} />
      </Link>
    );
  };

  const RADIUS = 120;
  const ITEM_SIZE = 46; // w-[46px] h-[46px]
  const CENTER_SIZE = 64; // w-16 h-16

  return (
    <>
      {/* Backdrop overlay */}
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

      {/* Floating center button + radial menu — positioned independently for true centering */}
      <motion.div
        animate={{ y: (path === '/track' || path === '/analytics') ? 150 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-10 inset-x-0 mx-auto w-[90%] max-w-[340px] z-[120]"
        style={{ pointerEvents: 'none' }}
      >
        {/* This wrapper is the same width as the nav bar. The center button is placed at its exact center. */}
        <div
          className="absolute bottom-0 left-1/2"
          style={{
            width: CENTER_SIZE,
            height: CENTER_SIZE,
            transform: `translate(-50%, -30%)`,
            pointerEvents: 'auto',
          }}
        >
          {/* Radial menu items — each positioned relative to center of this box */}
          <AnimatePresence>
            {isMenuOpen && QUICK_ACTIONS.map((action, i) => {
              const { x, y } = getRadialPosition(i, QUICK_ACTIONS.length, RADIUS);
              return (
                <motion.button
                  key={action.path}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                  animate={{
                    scale: 1, x, y, opacity: 1,
                    transition: { delay: i * 0.02, type: 'spring', stiffness: 400, damping: 28 },
                  }}
                  exit={{ scale: 0, x: 0, y: 0, opacity: 0, transition: { duration: 0.15 } }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuickActionPath(action.path);
                    navigate(action.path);
                    setIsMenuOpen(false);
                  }}
                  className="absolute"
                  style={{
                    width: ITEM_SIZE,
                    height: ITEM_SIZE,
                    left: '50%',
                    top: '50%',
                    marginLeft: -(ITEM_SIZE / 2),
                    marginTop: -(ITEM_SIZE / 2),
                    pointerEvents: 'auto',
                  }}
                >
                  <div className={`w-full h-full rounded-full flex items-center justify-center shadow-lg border transition-colors ${
                    action.path === quickActionPath
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
                      : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700'
                  }`}>
                    <span className="material-symbols-outlined text-[22px]">{action.icon}</span>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>

          {/* Center action button */}
          <motion.button
            onPointerDown={handleStartPress}
            onPointerUp={handleEndPress}
            onPointerCancel={handleEndPress}
            onClick={handleButtonClick}
            animate={{ scale: isLongPressing ? 1.08 : 1 }}
            whileTap={{ scale: 0.95 }}
            className={`absolute inset-0 w-full h-full rounded-full flex items-center justify-center z-[130] transition-colors duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.3)] ${
              isCenterActive
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-100'
            }`}
          >
            {isCreatureMode && !isMenuOpen ? (
              <stage.icon size={26} color={stage.color} />
            ) : (
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                {isMenuOpen ? 'close' : (quickOption?.icon || 'add')}
              </span>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Bottom navigation bar */}
      <motion.nav
        animate={{ y: (path === '/track' || path === '/analytics') ? 150 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-10 inset-x-0 mx-auto w-[90%] max-w-[340px] z-[110] rounded-[36px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/5 py-3 px-4"
      >
        <div className="flex items-center justify-between">
          {/* Left nav items */}
          <div className="flex items-center gap-2">
            {leftNav.map(renderNavItem)}
          </div>

          {/* Center spacer + label */}
          <div className="flex flex-col items-center justify-center" style={{ width: CENTER_SIZE + 8 }}>
            {/* Spacer for the floating button */}
            <div style={{ height: 28 }} />
            <span className={`text-[8px] uppercase tracking-[0.15em] font-black transition-colors whitespace-nowrap ${isCenterActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
              {isMenuOpen ? 'Close' : (quickOption?.label || 'Action')}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full mt-1 transition-all ${isCenterActive ? 'bg-zinc-900 dark:bg-white opacity-100' : 'bg-transparent opacity-0'}`} />
          </div>

          {/* Right nav items */}
          <div className="flex items-center gap-2">
            {rightNav.map(renderNavItem)}
          </div>
        </div>
      </motion.nav>
    </>
  );
}
