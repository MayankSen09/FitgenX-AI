import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2, Info, X } from 'lucide-react';
import { create } from 'zustand';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'achievement' | 'success' | 'info';
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 5000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-12 left-0 right-0 z-[200] flex flex-col items-center gap-3 px-6 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="glass-strong p-4 rounded-2xl border border-border-medium flex items-center gap-4 w-full max-w-[360px] pointer-events-auto shadow-glow-sm"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              toast.type === 'achievement' ? 'bg-gradient-hero text-white' :
              toast.type === 'success' ? 'bg-success/20 text-success' : 'bg-accent/20 text-accent'
            }`}>
              {toast.type === 'achievement' ? <Trophy size={20} /> : 
               toast.type === 'success' ? <CheckCircle2 size={20} /> : <Info size={20} />}
            </div>
            
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white leading-tight">{toast.title}</h4>
              <p className="text-xs text-text-secondary leading-tight mt-0.5">{toast.message}</p>
            </div>

            <button 
              onClick={() => removeToast(toast.id)}
              className="p-1.5 hover:bg-white/5 rounded-lg text-text-tertiary transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
