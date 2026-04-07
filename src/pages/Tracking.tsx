import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import LiveMap from '../components/map/LiveMap';

export default function Tracking() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-zinc-900 overflow-hidden font-sans">
      {/* Interactive Map */}
      <LiveMap />
      
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-zinc-900/60 pointer-events-none z-0"></div>

      {/* Top Bar Navigation Area */}
      <header className="relative z-10 w-full px-6 pt-12 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high border-2 border-zinc-700">
            <img 
              alt="User profile" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgfoBemLwZbeIYHlbXnjyKMHqE-ACtroJgVrq_GF7hm4KHR133OKXb248APnZZ-gI58GLJeRu6IqOObfMr4Okxdm5aydVBNy24qQyw2V4ziy-c300gBKnq7ZHLsjCDHnDROsKfjeytLXlMI-ZqNBlqcFDAf_DQXhIXUPhe3gfUk7ekxuXTtQ-9bRYIMSjoIO533rIrglayQ5rQOwnzUjZZ-xN4bQGoOrPjgGbQC_4XowJ-VDzELItj7cWPtPOFOe5KpyKb2zKvMAw"
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-headline">Tracking</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors">
          <span className="material-symbols-outlined" data-icon="more_horiz">more_horiz</span>
        </button>
      </header>

      {/* Top Metrics Area */}
      <main className="relative z-10 px-4 pt-6 pb-40 flex flex-col h-full justify-between pointer-events-none">
        
        {/* Top Cards Loop */}
        <div className="space-y-3 pointer-events-auto">
          {/* Main Stats Card */}
          <div className="bg-white/70 dark:bg-zinc-800/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-lg border border-white/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-label text-[0.6875rem] uppercase tracking-widest font-bold text-zinc-600 dark:text-zinc-400 mb-1">Distance</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-headline font-extrabold text-zinc-900 dark:text-white tracking-tighter">4.28</span>
                  <span className="text-lg font-bold text-zinc-500">km</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-label text-[0.6875rem] uppercase tracking-widest font-bold text-zinc-600 dark:text-zinc-400 mb-1">Avg Pace</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-headline font-bold text-zinc-900 dark:text-white tracking-tight">5:12</span>
                  <span className="text-sm font-bold text-zinc-500">/km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats Row */}
          <div className="flex gap-3">
            <div className="flex-1 bg-white/70 dark:bg-zinc-800/60 backdrop-blur-xl rounded-[1.5rem] p-5 shadow-lg border border-white/20">
              <p className="font-label text-[0.6875rem] uppercase tracking-widest font-bold text-zinc-600 dark:text-zinc-400 mb-1">Energy Burned</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-headline font-bold text-zinc-900 dark:text-white tracking-tight">342</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">kcal</span>
              </div>
            </div>
            <div className="flex-1 bg-white/70 dark:bg-zinc-800/60 backdrop-blur-xl rounded-[1.5rem] p-5 shadow-lg border border-white/20">
              <p className="font-label text-[0.6875rem] uppercase tracking-widest font-bold text-zinc-600 dark:text-zinc-400 mb-1">Gain</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-headline font-bold text-zinc-900 dark:text-white tracking-tight">124</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">m</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Bottom Floating Interaction Area */}
      <div className="absolute top-1/2 left-0 w-full flex flex-col items-center gap-4 translate-y-16 pointer-events-auto">
        <button className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md px-5 py-2 rounded-full flex items-center gap-2 border border-white/30 shadow-sm active:scale-95 transition-transform">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Segment: <span className="text-primary font-bold">Hill Climb</span>
          </span>
          <span className="material-symbols-outlined text-[14px] text-zinc-400">chevron_right</span>
        </button>

        <div className="w-[85%] bg-white/70 dark:bg-zinc-800/60 backdrop-blur-xl p-4 flex items-center justify-between rounded-2xl border border-white/20 shadow-md active:scale-95 transition-transform cursor-pointer">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center backdrop-blur-md">
                 <span className="material-symbols-outlined text-lg" data-icon="trending_up">trending_up</span>
              </div>
              <div>
                 <p className="text-sm font-bold text-zinc-900 dark:text-white">Performance</p>
                 <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-semibold">+12% faster than last session</p>
              </div>
           </div>
           <span className="material-symbols-outlined text-zinc-400">chevron_right</span>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-28 left-0 w-full flex justify-center items-center gap-6 px-8 z-10 pointer-events-auto">
         {/* Stop Button routes to Analytics Summary */}
         <button 
           onClick={() => navigate('/analytics')}
           className="w-16 h-16 rounded-full bg-white/70 dark:bg-zinc-800/70 backdrop-blur-xl flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-red-500 border border-white/20 shadow-lg active:scale-90 transition-all"
         >
            <div className="w-4 h-4 bg-current rounded-sm"></div>
         </button>

         {/* Pause / Play Button */}
         <button className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(0,122,255,0.4)] border-4 border-white dark:border-zinc-900 active:scale-95 transition-all outline outline-offset-4 outline-primary/30">
            <span className="material-symbols-outlined text-white text-5xl font-bold select-none" data-icon="pause">pause</span>
         </button>

         {/* Lock Screen Button */}
         <button className="w-16 h-16 rounded-full bg-white/70 dark:bg-zinc-800/70 backdrop-blur-xl flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-white/20 shadow-lg active:scale-90 transition-all">
            <span className="material-symbols-outlined text-2xl" data-icon="lock">lock</span>
         </button>
      </div>

      <BottomNav />
    </div>
  );
}
