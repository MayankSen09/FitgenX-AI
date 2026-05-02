import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, ArrowLeft, ChevronRight, Zap, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../components/common/Toast';

export default function Challenges() {
  const navigate = useNavigate();
  const [isClaimed, setIsClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const activeChallenges = [
    { 
       id: 1, 
       title: '7-Day Cardio Blast', 
       participants: 1240, 
       progress: 65, 
       daysLeft: 3, 
       reward: '500 Pts', 
       color: '#0ea5e9',
       image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop'
    },
    { 
       id: 2, 
       title: 'Morning Mobility Flow', 
       participants: 850, 
       progress: 40, 
       daysLeft: 5, 
       reward: '300 Pts', 
       color: '#8b5cf6',
       image: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=1469&auto=format&fit=crop'
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Foster', points: '12,430', avatar: 'bg-zinc-900' },
    { rank: 2, name: 'Sarah Miller', points: '11,850', avatar: 'bg-zinc-800' },
    { rank: 3, name: 'Marcus Chen', points: '10,920', avatar: 'bg-zinc-700' },
    { rank: 4, name: 'Elena Rodriguez', points: '9,450', avatar: 'bg-zinc-600' },
  ];

  const handleClaim = () => {
    if (isClaimed) return;
    setIsClaiming(true);
    setTimeout(() => {
      setIsClaiming(false);
      setIsClaimed(true);
      toast.achievement("800 Momentum Points added to your vault!", "Reward Claimed");
      // Add logic to persistent store if needed
    }, 1500);
  };

  return (
    <motion.div 
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800 px-6 py-5">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 active:scale-90 transition-transform">
            <ArrowLeft size={20} className="text-zinc-900 dark:text-white" />
          </button>
          <div className="text-center">
             <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white uppercase leading-none">Challenges</h1>
             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">Arena Mode</p>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="pt-24 px-6 space-y-8 max-w-[430px] mx-auto">
        
        {/* Active Challenges */}
        <section className="space-y-4">
           <div className="flex justify-between items-center px-1">
              <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Active Goals</h2>
              <button className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">Browse All</button>
           </div>
           
           <div className="space-y-6">
              {activeChallenges.map((challenge) => (
                 <div key={challenge.id} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm group">
                    <div className="relative h-48 overflow-hidden">
                       <img src={challenge.image} className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110" alt={challenge.title} />
                       <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent"></div>
                       <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                          <div className="space-y-1">
                             <h4 className="text-lg font-bold text-white tracking-tight leading-none">{challenge.title}</h4>
                             <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 text-white/60 text-[9px] font-black uppercase tracking-widest">
                                   <Users size={12} /> {challenge.participants}
                                </span>
                                <span className="flex items-center gap-1 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                                   <Zap size={12} className="fill-current" /> {challenge.reward}
                                </span>
                             </div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[8px] font-black tracking-[0.2em]">
                             {challenge.daysLeft}D LEFT
                          </div>
                       </div>
                    </div>
                    <div className="p-6">
                       <div className="flex justify-between items-center mb-3">
                          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Progress</span>
                          <span className="text-xs font-bold text-zinc-900 dark:text-white">{challenge.progress}%</span>
                       </div>
                       <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${challenge.progress}%` }}
                             className="h-full rounded-full"
                             style={{ backgroundColor: challenge.color }}
                          />
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* Leaderboard */}
        <section className="space-y-4">
           <div className="flex justify-between items-center px-1">
              <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Hall of Fame</h2>
              <div className="flex gap-1 items-center bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Global</span>
              </div>
           </div>
           
           <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
              {leaderboard.map((user, i) => (
                 <div 
                    key={i}
                    className="p-5 flex items-center justify-between border-b border-zinc-50 dark:border-zinc-800 last:border-none"
                 >
                    <div className="flex items-center gap-4">
                       <div className={`w-8 h-8 flex items-center justify-center text-[10px] font-black rounded-xl ${
                          i === 0 ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'text-zinc-400'
                       }`}>
                          {user.rank}
                       </div>
                       <div className={`w-10 h-10 ${user.avatar} rounded-xl overflow-hidden flex items-center justify-center text-white/20 shadow-sm`}>
                          <Users size={16} />
                       </div>
                       <div>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{user.name}</h4>
                          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">{user.points} Points</p>
                       </div>
                    </div>
                    <ChevronRight size={16} className="text-zinc-300" />
                 </div>
              ))}
           </div>
        </section>
      </main>

      {/* Fixed Claim Reward Button - Redesigned */}
      <div className="fixed bottom-32 left-8 right-8 z-50">
         <motion.button 
            onClick={handleClaim}
            disabled={isClaiming || isClaimed}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-5 rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 transition-all duration-300 ${
              isClaimed 
                ? 'bg-emerald-500 text-white cursor-default' 
                : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
            } ${isClaiming ? 'opacity-80' : ''}`}
         >
           {isClaiming ? (
             <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
           ) : isClaimed ? (
             <>
               <CheckCircle2 size={24} />
               <span className="text-xs font-black uppercase tracking-[0.2em]">Vault Updated</span>
             </>
           ) : (
             <>
               <Trophy size={24} />
               <span className="text-xs font-black uppercase tracking-[0.2em]">Claim Milestone Reward</span>
             </>
           )}
         </motion.button>
      </div>
    </motion.div>
  );
}
