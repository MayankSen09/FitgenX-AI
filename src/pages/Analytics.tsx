import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Bell } from 'lucide-react';
import { toast } from '../components/common/Toast';

export default function Analytics() {
  const navigate = useNavigate();

  const handleShare = () => {
    navigator.clipboard.writeText("My FitGenX Performance Today: 43:15 Duration | 5'02\" Pace | 640 kcal Burned!");
    toast.success("Achievement copied to clipboard!", "Shared successfully");
  };

  return (
    <motion.div 
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-36"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 hover:opacity-80 transition-opacity active:scale-90"
          >
            <ArrowLeft size={20} className="text-zinc-900 dark:text-zinc-50" />
          </button>
          <span className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 font-display">Analytics</span>
        </div>
        <button 
          onClick={() => toast.info("No new notifications")}
          className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800 hover:opacity-80 transition-opacity"
        >
          <Bell size={20} />
        </button>
      </nav>

      {/* Main Content */}
      <main className="pt-24 px-6 max-w-[430px] mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="font-display text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">Performance Comparison</h1>
          <p className="text-xs text-zinc-500 font-bold tracking-wider uppercase">Last Run vs. Today</p>
        </header>

        {/* Path Comparison Image Cards */}
        <section className="grid grid-cols-2 gap-4">
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-zinc-900 rounded-[2rem] p-4 overflow-hidden relative border border-zinc-100 dark:border-zinc-800 shadow-sm"
          >
            <p className="text-[10px] uppercase tracking-widest font-black mb-3 text-zinc-400">Last Run Path</p>
            <div className="h-40 rounded-3xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
              <img 
                className="w-full h-full object-cover grayscale opacity-60" 
                alt="Winding path map" 
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop"
              />
              <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-wider shadow-sm text-zinc-900 dark:text-white">
                MAY 12
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-zinc-900 rounded-[2rem] p-4 overflow-hidden relative border-2 border-emerald-500/20 shadow-lg"
          >
            <p className="text-[10px] uppercase tracking-widest font-black mb-3 text-emerald-500">Today's Path</p>
            <div className="h-40 rounded-3xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
              <div className="absolute inset-0 vitality-gradient opacity-10" />
              <img 
                className="w-full h-full object-cover" 
                alt="Glowing path map" 
                src="https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=1469&auto=format&fit=crop"
              />
              <div className="absolute bottom-4 right-4 bg-emerald-500/95 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-wider shadow-sm">
                TODAY
              </div>
            </div>
          </motion.div>
        </section>

        {/* Comparison Details Grid */}
        <section className="space-y-4">
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-zinc-900 rounded-[2.25rem] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-[10px] font-black uppercase tracking-widest">Duration</span>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-wider">
                -2:15 FAST
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase text-zinc-400 tracking-wider">Previous</p>
                <p className="font-display text-2xl font-black text-zinc-500">45:30</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">Today</p>
                <p className="font-display text-4xl font-black tracking-tight text-zinc-900 dark:text-white">43:15</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-zinc-900 rounded-[2.25rem] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-[10px] font-black uppercase tracking-widest">Avg Pace</span>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-wider">
                +12% PACE
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase text-zinc-400 tracking-wider">Previous</p>
                <p className="font-display text-2xl font-black text-zinc-500">5'45"</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">Today</p>
                <p className="font-display text-4xl font-black tracking-tight text-zinc-900 dark:text-white">5'02"</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-zinc-900 rounded-[2.25rem] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm"
            >
              <div className="flex items-center gap-2 text-zinc-400 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest truncate">Elev. Gain</span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-display text-3xl font-black text-zinc-900 dark:text-white leading-none">142<span className="text-sm font-normal ml-1">m</span></p>
                <span className="text-rose-500 font-black text-[9px] uppercase tracking-wider">-4% regression</span>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-zinc-900 rounded-[2.25rem] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm"
            >
              <div className="flex items-center gap-2 text-zinc-400 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest truncate">Calories</span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-display text-3xl font-black text-zinc-900 dark:text-white leading-none">640<span className="text-sm font-normal ml-1">kcal</span></p>
                <span className="text-emerald-500 font-black text-[9px] uppercase tracking-wider">+8% burn</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Actions */}
        <section className="space-y-4 pt-4">
          <motion.button 
            onClick={handleShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-display font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl hover:opacity-90 active:scale-95 transition-all duration-200"
          >
            <Share2 size={20} />
            <span className="text-xs uppercase tracking-wider">Share Achievement</span>
          </motion.button>
          
          <motion.button 
            onClick={() => navigate('/dashboard')} 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-display font-black py-4 rounded-[2rem] text-zinc-900 dark:text-white active:scale-95 transition-all duration-200 uppercase tracking-wider text-xs"
          >
            Done
          </motion.button>
        </section>
      </main>
    </motion.div>
  );
}
