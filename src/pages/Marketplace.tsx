import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Zap, Tag, Gift, ChevronRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../components/common/Toast';
import { useSettingsStore } from '../stores/settingsStore';

export default function Marketplace() {
  const navigate = useNavigate();
  const { tokens, setTokens, inventory, addReward } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<'deals' | 'inventory'>('deals');

  const deals = [
    { id: 1, title: '20% Off Gymshark', cost: 500, type: 'Discount', color: 'bg-zinc-900', icon: Tag, brand: 'Gymshark' },
    { id: 2, title: 'Free Protein Bar', cost: 300, type: 'Reward', color: 'bg-blue-500', icon: Gift, brand: 'FitGenX' },
    { id: 3, title: 'FitGenX Pro (1 Month)', cost: 1500, type: 'Subscription', color: 'bg-emerald-500', icon: Zap, brand: 'FitGenX' },
    { id: 4, title: 'Personal Coach Audit', cost: 2000, type: 'Service', color: 'bg-purple-500', icon: ShoppingBag, brand: 'Partner' },
  ];

  const handlePurchase = (item: any) => {
    if (tokens < item.cost) {
      toast.info("Insufficient Momentum Points. Keep training!");
      return;
    }
    setTokens(tokens - item.cost);
    addReward(item);
    toast.success(`Redeemed ${item.title}! Check your email for instructions.`, "Success");
  };

  return (
    <motion.div 
      className="min-h-screen bg-white dark:bg-zinc-950 pb-32 font-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl px-6 py-6 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 active:scale-90 transition-transform">
            <ArrowLeft size={22} className="text-zinc-900 dark:text-white" />
          </button>
          <div className="text-center">
             <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-none">Marketplace</h1>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mt-1">Token Store</p>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 px-4 py-2.5 rounded-2xl shadow-xl shadow-zinc-900/20 dark:shadow-none border border-white/10">
             <Zap size={14} className="text-emerald-400 fill-current" />
             <span className="text-sm font-black text-white dark:text-zinc-900">{tokens}</span>
          </div>
        </div>
      </header>

      <main className="pt-28 px-6 space-y-8 max-w-[430px] mx-auto">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[2.5rem] p-8 bg-zinc-900 dark:bg-zinc-900 text-white shadow-2xl shadow-zinc-900/40">
           <div className="absolute top-0 right-0 p-8 opacity-10 -mr-4 -mt-4">
              <ShoppingBag size={140} />
           </div>
           <div className="relative z-10 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Exclusive Rewards</span>
              <h2 className="text-3xl font-black tracking-tight leading-[1.1]">Trade your hard work<br />for real results.</h2>
           </div>
        </section>

        {/* Category Tabs */}
        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('deals')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'deals' ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-400'}`}
          >
            Curated Deals
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-400'}`}
          >
            My Rewards {inventory.length > 0 && `(${inventory.length})`}
          </button>
        </div>

        <section className="space-y-4">
           <div className="space-y-4">
              {activeTab === 'deals' ? (
                deals.map(item => (
                  <div key={item.id} className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 flex items-center justify-between shadow-sm group active:scale-[0.98] transition-all">
                     <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform`}>
                           <item.icon size={28} />
                        </div>
                        <div>
                           <h4 className="text-base font-black text-zinc-900 dark:text-white">{item.title}</h4>
                           <div className="flex items-center gap-2 mt-1">
                             <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{item.type}</span>
                             <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                             <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Available</span>
                           </div>
                        </div>
                     </div>
                     <button 
                        onClick={() => handlePurchase(item)}
                        className="flex flex-col items-center gap-0.5 bg-white dark:bg-zinc-800 px-5 py-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-700 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all shadow-sm"
                     >
                        <span className="text-sm font-black tracking-tight">{item.cost}</span>
                        <span className="text-[8px] font-black uppercase opacity-50 tracking-widest">Points</span>
                     </button>
                  </div>
                ))
              ) : (
                <div className="space-y-4">
                  {inventory.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag className="text-zinc-300" size={32} />
                      </div>
                      <p className="text-sm font-black text-zinc-400 uppercase tracking-widest">No rewards redeemed yet</p>
                    </div>
                  ) : (
                    inventory.map((item, idx) => (
                      <div key={idx} className="bg-emerald-500/5 dark:bg-emerald-500/10 p-6 rounded-[2rem] border border-emerald-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                           <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                              <Check size={28} />
                           </div>
                           <div>
                              <h4 className="text-base font-black text-zinc-900 dark:text-white">{item.title}</h4>
                              <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-1">Redeemed on {item.redeemedAt}</p>
                           </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                           <ChevronRight size={20} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
           </div>
        </section>

        <section className="p-8 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] space-y-3">
           <div className="flex items-center gap-2 text-emerald-500">
              <Check size={18} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Verified Partner</span>
           </div>
           <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 leading-relaxed">
              All discounts are provided by our direct partners and are exclusive to the FitGenX elite community. Keep training to unlock more!
           </p>
        </section>
      </main>
    </motion.div>
  );
}
