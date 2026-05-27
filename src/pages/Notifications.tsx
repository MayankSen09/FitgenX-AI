import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, RefreshCw } from 'lucide-react';
import { toast } from '../components/common/Toast';

const CRAZY_NOTIFICATIONS = [
  {
    id: 1,
    title: '🚨 THE FITNESS COACH SAYS...',
    body: "Your workout streak is waiting. Break a sweat or break your streak: the choice is yours.",
    time: '2m ago',
    icon: '🏃‍♂️',
    type: 'coach',
    read: false,
  },
  {
    id: 2,
    title: '💪 GYM HERO ALERT',
    body: "It's time to set a new personal record! Run 5km right now to conquer your goals.",
    time: '12m ago',
    icon: '⚡',
    type: 'Gym',
    read: false,
  },
  {
    id: 3,
    title: '🔥 STREAK DANGER ZONE',
    body: "Don't let your streak expire! A quick 10-minute jog can save your progress.",
    time: '45m ago',
    icon: '🔥',
    type: 'streak',
    read: true,
  },
  {
    id: 4,
    title: '💔 CREATURE FEELINGS',
    body: "Your FitGenX creature has been waiting by the gym gear for 4 hours. Take it out for a run!",
    time: '1h ago',
    icon: '🥺',
    type: 'creature',
    read: true,
  },
  {
    id: 5,
    title: '🏃‍♂️ SOMEONE PASSED YOU!',
    body: "A rival runner just crushed their daily goal. Are you just going to let them take the lead?",
    time: '3h ago',
    icon: '😈',
    type: 'social',
    read: true,
  },
];

const NEW_CRAZY_ALERTS = [
  {
    title: '⚡ POWER ALERT',
    body: "Consistency is key. Don't stop moving now; push through your workout!",
    icon: '🔥',
    type: 'coach',
  },
  {
    title: '👟 TRAINING TIME',
    body: "Excellence is temporary, discipline is permanent. Hit the track right away!",
    icon: '👟',
    type: 'Gym',
  },
  {
    title: '🚨 FOMO EMERGENCY',
    body: "7 of your friends just smashed their fitness goals. Meanwhile, you are looking at this notification.",
    icon: '👀',
    type: 'streak',
  },
  {
    title: '😭 THE CREATURE HAS WEPT',
    body: "Your companion misses your steps. Let's head out and run together!",
    icon: '😢',
    type: 'creature',
  }
];

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(CRAZY_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [popAlert, setPopAlert] = useState<{ title: string; body: string; icon: string; type: string } | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications caught up!", "Read successfully");
  };

  const triggerCrazyPush = () => {
    const alert = NEW_CRAZY_ALERTS[Math.floor(Math.random() * NEW_CRAZY_ALERTS.length)];
    setPopAlert(alert);

    // Also insert into feed
    const newNotification = {
      id: Date.now(),
      title: alert.title,
      body: alert.body,
      time: 'Just now',
      icon: alert.icon,
      type: alert.type,
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);

    // Toast also
    toast.success(`${alert.title}: ${alert.body}`);

    // Autohide top flying card after 4 seconds
    setTimeout(() => {
      setPopAlert(null);
    }, 4000);
  };

  const filtered = notifications.filter(n => activeTab === 'all' || !n.read);

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans flex flex-col relative pb-32">
      {/* Dynamic Push Notification Overlay Card - Flies in from top */}
      <AnimatePresence>
        {popAlert && (
          <motion.div
            initial={{ y: -120, opacity: 0, scale: 0.9 }}
            animate={{ y: 20, opacity: 1, scale: 1 }}
            exit={{ y: -120, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 14, stiffness: 120 }}
            className="fixed top-0 left-4 right-4 z-[100] bg-zinc-900/95 backdrop-blur-xl p-4 rounded-3xl border border-white/10 flex items-start gap-4 shadow-[0_30px_90px_rgba(0,0,0,0.8)] cursor-pointer select-none ring-1 ring-white/10"
            onClick={() => setPopAlert(null)}
          >
            <div className="text-3xl leading-none bg-zinc-950 p-2.5 rounded-2xl border border-white/5 shadow-inner select-none flex-shrink-0">
              {popAlert.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="font-display font-black text-xs text-primary uppercase tracking-wider">{popAlert.title}</span>
                <span className="text-[9px] font-bold text-white/30 uppercase">Just now</span>
              </div>
              <p className="text-xs font-semibold text-white leading-relaxed">{popAlert.body}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="px-6 pt-12 pb-6 border-b border-white/5 flex flex-col gap-4 bg-zinc-900/30 backdrop-blur-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white/60 active:scale-95 font-bold text-lg leading-none"
            >
              ✕
            </button>
            <div>
              <h1 className="font-display font-black tracking-tight text-xl leading-tight">Emergency Center</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Engagement Alerts</p>
            </div>
          </div>

          <button 
            onClick={triggerCrazyPush}
            className="px-4 py-2 bg-white text-zinc-950 rounded-full font-display font-black text-[10px] uppercase tracking-wider flex items-center gap-2 hover:bg-white/90 active:scale-95 transition-all shadow-xl"
          >
            <RefreshCw size={12} className="animate-spin-slow" />
            <span>Test Push</span>
          </button>
        </div>

        {/* Tab Filters and Clear controls */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-full font-display font-black uppercase tracking-wider text-[10px] transition-all border ${activeTab === 'all' ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'}`}
            >
              All Alerts ({notifications.length})
            </button>
            <button 
              onClick={() => setActiveTab('unread')}
              className={`px-4 py-1.5 rounded-full font-display font-black uppercase tracking-wider text-[10px] transition-all border ${activeTab === 'unread' ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'}`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-[10px] font-black uppercase tracking-wider text-white/40 hover:text-white transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </header>

      {/* Real-time Crazy Notification Inbox/Stream */}
      <main className="flex-1 p-6 space-y-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/5 text-white/20 mb-4 select-none animate-pulse">
              <Bell size={28} />
            </div>
            <h3 className="font-display font-black tracking-tight text-lg mb-1">No crazy alerts right now</h3>
            <p className="text-xs text-white/30 max-w-xs leading-relaxed">Relax for now. Your AI Coach and your companion creature are keeping an eye on you.</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                onClick={() => markAsRead(item.id)}
                className={`p-4 rounded-[2rem] border transition-all flex items-start gap-4 cursor-pointer select-none relative overflow-hidden ${
                  item.read ? 'bg-zinc-900/20 border-white/5 opacity-60' : 'bg-zinc-900/60 border-white/10 shadow-lg'
                }`}
              >
                {/* Visual Unread dot */}
                {!item.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}

                <div className="text-3xl leading-none bg-zinc-950 p-3 rounded-2xl border border-white/5 shadow-inner">
                  {item.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className={`font-display font-black uppercase tracking-wide text-xs ${
                      item.type === 'coach' ? 'text-green-400' :
                      item.type === 'Gym' ? 'text-red-400' :
                      item.type === 'streak' ? 'text-amber-400' : 'text-primary'
                    }`}>
                      {item.title}
                    </span>
                    <span className="text-[9px] font-bold text-white/30 uppercase ml-2 flex-shrink-0">{item.time}</span>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed text-white/80">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
