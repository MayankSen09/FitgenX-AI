import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Timer, Activity, Heart, Trophy } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useToastStore } from '../common/Toast';

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogActivityModal({ isOpen, onClose }: LogActivityModalProps) {
  const updateStats = useAppStore((state) => state.updateStats);
  const addToast = useToastStore((state) => state.addToast);
  
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [duration, setDuration] = useState('30');

  const activities = [
    { id: 'swimming', title: 'Swimming', icon: <Activity size={20} />, calPerMin: 12 },
    { id: 'yoga', title: 'Yoga', icon: <Heart size={20} />, calPerMin: 4 },
    { id: 'cycling', title: 'Cycling', icon: <Flame size={20} />, calPerMin: 10 },
    { id: 'running', title: 'Running', icon: <Timer size={20} />, calPerMin: 15 },
  ];

  const handleLog = () => {
    if (!selectedActivity) return;
    
    const activity = activities.find(a => a.id === selectedActivity);
    if (activity) {
      const mins = parseInt(duration);
      const cals = mins * activity.calPerMin;
      
      updateStats({
        calories: 840 + cals, // Mock baseline + new
        activeMinutes: 45 + mins
      });

      addToast({
        title: 'Activity Logged!',
        message: `You earned ${cals} kcal for ${mins} mins of ${activity.title}.`,
        type: 'achievement'
      });
      
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md flex items-end justify-center p-4"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="glass-strong w-full max-w-[480px] rounded-t-[32px] p-8 pb-12 shadow-2xl border-t border-white/10"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-display font-bold text-white mb-1">Log Activity</h3>
                <p className="text-sm text-text-tertiary">Track your extra movement</p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 glass rounded-full text-text-secondary hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {activities.map((act) => (
                <button
                  key={act.id}
                  onClick={() => setSelectedActivity(act.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                    selectedActivity === act.id 
                      ? 'border-accent bg-accent/5' 
                      : 'border-white/5 bg-white/5'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedActivity === act.id ? 'bg-accent text-bg-primary' : 'bg-bg-elevated text-text-tertiary'
                  }`}>
                    {act.icon}
                  </div>
                  <span className={`text-sm font-bold ${selectedActivity === act.id ? 'text-white' : 'text-text-secondary'}`}>
                    {act.title}
                  </span>
                </button>
              ))}
            </div>

            <div className="mb-8">
              <label className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-3 block">Duration (minutes)</label>
              <div className="flex items-center gap-4">
                 <input 
                  type="range" 
                  min="5" 
                  max="120" 
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="flex-1 accent-accent"
                 />
                 <div className="w-16 h-12 glass rounded-xl flex items-center justify-center font-display font-bold text-accent">
                    {duration}
                 </div>
              </div>
            </div>

            <button
              disabled={!selectedActivity}
              onClick={handleLog}
              className={`btn w-full h-14 text-lg ${
                selectedActivity ? 'btn-primary shadow-glow' : 'bg-bg-elevated text-text-tertiary'
              }`}
            >
              Log Session
              <Trophy size={20} className="ml-2" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
