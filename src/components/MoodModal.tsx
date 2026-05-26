import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { useMoodStore } from '../stores/moodStore';

interface MoodModalProps {
  onComplete: () => void;
  onDismiss: () => void;
}

export default function MoodModal({ onComplete, onDismiss }: MoodModalProps) {
  const { addMoodLog } = useMoodStore();
  const [mood, setMood] = useState<1|2|3|4|5>(4);
  const [effort, setEffort] = useState<1|2|3>(2);
  const [notes, setNotes] = useState('');

  const moodEmojis = {
    1: '😢',
    2: '😐',
    3: '🙂',
    4: '😊',
    5: '🔥',
  };

  const handleSave = () => {
    addMoodLog({
      moodRating: mood,
      perceivedEffort: effort,
      notes,
    });
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-zinc-950/95 backdrop-blur-xl flex flex-col justify-center items-center p-6 text-white"
    >
      <div className="w-full max-w-sm space-y-8 flex flex-col items-stretch text-center select-none">
        <div className="space-y-3">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-primary">
            <Sparkles size={24} className="text-amber-400" />
          </div>
          <h2 className="font-display font-black tracking-tight text-2xl leading-tight">How did that feel?</h2>
          <p className="text-xs font-semibold text-white/40">Your mood and effort help recommend your prime times.</p>
        </div>

        {/* Mood Selection */}
        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block">Workout Mood</span>
          <div className="flex justify-between items-center bg-zinc-900/40 p-3 rounded-2xl border border-white/5">
            {([1, 2, 3, 4, 5] as const).map((level) => (
              <button
                key={level}
                onClick={() => setMood(level)}
                className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all active:scale-95 ${
                  mood === level
                    ? 'bg-primary border-primary border text-zinc-950 scale-105 shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                }`}
              >
                {moodEmojis[level]}
              </button>
            ))}
          </div>
        </div>

        {/* Perceived Effort Selection */}
        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block">Perceived Effort</span>
          <div className="grid grid-cols-3 gap-2 bg-zinc-900/40 p-3 rounded-2xl border border-white/5">
            {([1, 2, 3] as const).map((level) => (
              <button
                key={level}
                onClick={() => setEffort(level)}
                className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 border ${
                  effort === level
                    ? 'bg-primary border-primary text-zinc-950 font-bold'
                    : 'bg-white/5 hover:bg-white/10 border-transparent text-white/50'
                }`}
              >
                {level === 1 ? 'Easy' : level === 2 ? 'Moderate' : 'Tough'}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area Note */}
        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block">Quick Note</span>
          <textarea
            placeholder="Add a quick note about your run (optional)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl p-3 text-xs text-white/80 placeholder:text-white/20 focus:outline-none focus:border-white/10 resize-none font-semibold leading-relaxed"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-white text-zinc-950 rounded-2xl font-display font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-white/90 active:scale-[0.98] transition-all"
          >
            <Check size={16} />
            <span>Save & Complete</span>
          </button>

          <button
            onClick={onDismiss}
            className="text-xs font-black uppercase tracking-wider text-white/30 hover:text-white transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
