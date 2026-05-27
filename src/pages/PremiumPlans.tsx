import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Shield, Zap, Sparkles } from 'lucide-react';
import { toast } from '../components/common/Toast';

const REVENUE_PLANS = [
  {
    id: 'free',
    name: 'Basic Tier',
    price: '$0',
    frequency: 'Forever Free',
    badge: 'Standard',
    features: [
      'Standard Run Tracking',
      'Basic Performance History',
      'Single Creature Companion Slot',
      'General Community Access',
    ],
    color: 'from-zinc-800 to-zinc-900',
    accent: 'bg-zinc-800',
    button: 'Current Tier',
  },
  {
    id: 'pro',
    name: 'FitGenX Pro',
    price: '$9.99',
    frequency: 'per month',
    badge: 'Popular',
    features: [
      'Premium Real-Time Map Layers',
      'Advanced Performance Heatmaps',
      'Advanced Creature Evolution Paths',
      'AI Fitness Coach Personal Audits',
      '500 Bonus Tokens every month',
    ],
    color: 'from-blue-600 via-blue-500 to-indigo-600',
    accent: 'bg-blue-600',
    button: 'Upgrade to Pro',
  },
  {
    id: 'ultimate',
    name: 'FitGenX Ultimate',
    price: '$24.99',
    frequency: 'per month',
    badge: 'Enterprise',
    features: [
      '1-on-1 Dedicated AI Coach Audits',
      'Advanced Team Performance Challenges',
      'Unlimited Tokens & Full Store Rewards',
      'Exclusive Creature Custom Skin Upgrades',
      'Priority Customer Service Support',
    ],
    color: 'from-emerald-500 via-teal-500 to-cyan-500',
    accent: 'bg-emerald-500',
    button: 'Go Ultimate',
  }
];

export default function PremiumPlans() {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string>('free');

  const handleSubscribe = (tier: any) => {
    if (tier.id === 'free') return;
    toast.success(`Subscribed to ${tier.name}! Enjoy premium tracking.`, "Subscription activated");
    setSelectedTier(tier.id);
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans flex flex-col relative pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-zinc-900/60 backdrop-blur-xl px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white/60 active:scale-95"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="text-center">
          <h1 className="font-display font-black tracking-tight text-base leading-none">FitGenX Elite</h1>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">Pricing & Revenue Model</p>
        </div>
        <div className="w-10 h-10 flex items-center justify-center">
          <Shield size={18} className="text-emerald-400" />
        </div>
      </header>

      <main className="pt-24 px-6 space-y-8 max-w-[430px] mx-auto">
        {/* Top Hero Card */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-tr from-zinc-900/90 to-zinc-800/80 p-8 border border-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 right-0 p-8 opacity-5 -mr-4 -mt-4">
            <Sparkles size={160} />
          </div>
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="text-primary animate-pulse" size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Tier Up Your Fitness</span>
            </div>
            <h2 className="text-2xl font-black font-headline tracking-tight leading-[1.1]">Elite Value Subscription</h2>
            <p className="text-xs font-semibold text-white/50 leading-relaxed">Upgrade your tracking platform experience with advanced routing, AI coaching, and full premium tokens.</p>
          </div>
        </section>

        {/* Subscription Plan Cards */}
        <section className="space-y-6">
          {REVENUE_PLANS.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.35, type: 'spring' }}
              className={`p-6 rounded-[2.2rem] border relative overflow-hidden flex flex-col justify-between h-auto shadow-[0_15px_40px_rgba(0,0,0,0.4)] ${
                selectedTier === tier.id ? 'border-primary bg-zinc-900/50' : 'border-white/5 bg-zinc-900/20'
              }`}
            >
              {selectedTier === tier.id && (
                <div className="absolute top-4 right-4 bg-primary text-black px-3 py-1 rounded-full font-display font-black tracking-wider uppercase text-[8px] flex items-center gap-1">
                  <Check size={10} />
                  Active
                </div>
              )}

              {/* Tier Pricing Heading */}
              <div className="mb-6">
                <span className={`text-[9px] font-black uppercase tracking-[0.25em] ${selectedTier === tier.id ? 'text-primary' : 'text-white/40'}`}>
                  {tier.badge} Tier
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="font-display font-black text-3xl tracking-tight leading-none">{tier.price}</h3>
                  <span className="text-xs font-bold text-white/30 uppercase tracking-widest">{tier.frequency}</span>
                </div>
                <h4 className="font-display font-black text-lg tracking-tight mt-2 text-white/90">{tier.name}</h4>
              </div>

              {/* Feature Items */}
              <div className="space-y-3 mb-8">
                {tier.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/5">
                      <Check size={10} className="text-white/60" />
                    </div>
                    <span className="text-xs font-semibold text-white/70 leading-normal">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSubscribe(tier)}
                disabled={selectedTier === tier.id}
                className={`w-full py-4 rounded-2xl font-display font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                  selectedTier === tier.id 
                    ? 'bg-zinc-800 text-white/40 cursor-default border border-white/5' 
                    : `bg-gradient-to-r ${tier.color} text-white hover:opacity-95 shadow-[0_12px_45px_rgba(0,122,255,0.2)]`
                }`}
              >
                <span>{tier.button}</span>
              </button>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  );
}
