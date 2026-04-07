import { motion } from 'framer-motion';
import { Trophy, Users, ArrowLeft, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Challenges() {
  const navigate = useNavigate();

  const activeChallenges = [
    { 
       id: 1, 
       title: '7-Day Cardio Blast', 
       participants: 1240, 
       progress: 65, 
       daysLeft: 3, 
       reward: '500 Pts', 
       color: 'var(--secondary)',
       image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop'
    },
    { 
       id: 2, 
       title: 'Morning Mobility Flow', 
       participants: 850, 
       progress: 40, 
       daysLeft: 5, 
       reward: '300 Pts', 
       color: 'var(--tertiary)',
       image: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=1469&auto=format&fit=crop'
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Foster', points: '12,430', avatar: 'bg-primary' },
    { rank: 2, name: 'Sarah Miller', points: '11,850', avatar: 'bg-accent' },
    { rank: 3, name: 'Marcus Chen', points: '10,920', avatar: 'bg-accent2' },
    { rank: 4, name: 'Elena Rodriguez', points: '9,450', avatar: 'bg-accent3' },
  ];

  return (
    <motion.div 
      className="screen pt-safe bg-bg-primary min-h-screen"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-full text-text-secondary shadow-sm">
          <ArrowLeft size={24} />
        </button>
        <h2 className="headline-md text-primary italic uppercase tracking-tighter">Arena Challenges</h2>
        <div className="w-12"></div>
      </div>

      <section className="section">
         <div className="section-header">
            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-widest">Active Community Goals</h3>
            <span className="text-xs font-bold text-secondary">Join Now</span>
         </div>
         
         <div className="flex flex-col gap-6">
            {activeChallenges.map((challenge) => (
               <div key={challenge.id} className="card p-0 overflow-hidden group shadow-lg">
                  <div className="relative h-48">
                     <img src={challenge.image} className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110" alt={challenge.title} />
                     <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent"></div>
                     <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                        <div>
                           <h4 className="text-xl font-extrabold text-white mb-0.5 italic uppercase">{challenge.title}</h4>
                           <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                                 <Users size={12} />
                                 {challenge.participants} Joined
                              </div>
                              <div className="flex items-center gap-1 text-tertiary text-[10px] font-black uppercase tracking-widest">
                                 <Zap size={12} className="fill-current" />
                                 {challenge.reward}
                              </div>
                           </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[10px] font-black tracking-widest">
                           {challenge.daysLeft}D LEFT
                        </div>
                     </div>
                  </div>
                  <div className="p-6">
                     <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-widest">Community Progress</span>
                        <span className="text-xs font-black text-primary italic uppercase">{challenge.progress}%</span>
                     </div>
                     <div className="progress-bar scale-y-[1.5]">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${challenge.progress}%` }}
                           className="progress-bar-fill"
                           style={{ backgroundColor: challenge.color }}
                        />
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      <section className="section pb-32">
         <div className="section-header">
            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-widest">Hall of Fame</h3>
            <span className="text-xs font-bold text-secondary">Global</span>
         </div>
         
         <div className="bg-bg-elevated p-2 rounded-[2.5rem]">
            {leaderboard.map((user, i) => (
               <div 
                  key={i}
                  className="p-5 flex items-center justify-between hover:bg-white rounded-[2rem] transition-all group cursor-pointer"
               >
                  <div className="flex items-center gap-5">
                     <div className={`w-10 h-10 flex items-center justify-center text-xs font-black italic rounded-xl ${
                        i === 0 ? 'bg-primary text-white' : 'text-text-tertiary'
                     }`}>
                        {user.rank}
                     </div>
                     <div className={`w-12 h-12 ${user.avatar} rounded-full overflow-hidden flex items-center justify-center p-1.5 text-white/50 shadow-sm transition-transform group-hover:scale-110`}>
                        <Users size={20} />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-primary mb-0.5">{user.name}</h4>
                        <p className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-tighter">{user.points} Momentum Points</p>
                     </div>
                  </div>
                  <ChevronRight size={18} className="text-text-tertiary group-hover:text-primary transition-transform group-hover:translate-x-1" />
               </div>
            ))}
         </div>
      </section>

      <div className="fixed bottom-24 left-6 right-6 z-50">
         <button className="btn btn-primary w-full py-6 text-xl shadow-2xl flex items-center justify-center gap-4 group uppercase">
           <Trophy size={28} className="fill-current" />
           CLAIM MY REWARD
         </button>
      </div>
    </motion.div>
  );
}
