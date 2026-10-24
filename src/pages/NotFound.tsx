import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col items-center justify-center p-6 text-center select-none"
    >
      <div className="max-w-[380px] w-full space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-zinc-900 dark:bg-zinc-800 text-white flex items-center justify-center shadow-xl">
          <span className="material-symbols-outlined text-4xl">radar</span>
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
            Navigation Error 404
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1 font-headline">
            Signal Lost.
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium leading-relaxed">
            The telemetry coordinate you requested does not exist or has been relocated in the athletic grid.
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-4 px-6 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-2xl text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">home</span>
          Return to Dashboard
        </button>
      </div>
    </motion.div>
  );
}
