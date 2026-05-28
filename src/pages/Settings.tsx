import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import { useSettingsStore, QUICK_ACTION_OPTIONS } from '../stores/settingsStore';

/**
 * Settings component allowing users to customize app preferences,
 * such as the Quick Action floating button destination.
 */
export default function Settings() {
  const navigate = useNavigate();
  const { quickActionPath, setQuickActionPath } = useSettingsStore();

  return (
    <div className="min-h-screen bg-surface dark:bg-zinc-950 font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex items-center gap-3 px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-zinc-600 dark:text-zinc-300">arrow_back</span>
        </button>
        <h1 className="text-xl font-headline font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">Settings</h1>
      </header>

      <main className="pt-24 px-6 pb-32 max-w-2xl mx-auto space-y-8">
        
        {/* Quick Action Button Section */}
        <section className="space-y-4">
          <div>
            <h2 className="font-headline text-lg font-bold text-zinc-900 dark:text-zinc-50">Quick Action Button</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Choose which page the floating button takes you to. This button appears on every screen for fast access.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTION_OPTIONS.map((option) => {
              const isSelected = quickActionPath === option.path;
              return (
                <button
                  key={option.path}
                  onClick={() => setQuickActionPath(option.path)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? 'border-primary bg-primary/10 dark:bg-primary/20 shadow-md shadow-primary/10'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-xl"
                      style={{ fontVariationSettings: isSelected ? '"FILL" 1' : '"FILL" 0' }}
                    >
                      {option.icon}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-zinc-700 dark:text-zinc-300'}`}>
                      {option.label}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-primary text-lg ml-auto" style={{ fontVariationSettings: '"FILL" 1' }}>
                      check_circle
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Premium Upgrade & Rewards */}
        <section className="space-y-4">
          <h2 className="font-headline text-lg font-bold text-zinc-900 dark:text-zinc-50">Premium & Rewards</h2>
          <button 
            onClick={() => navigate('/plans')}
            className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-6 rounded-3xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20 mb-3"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                <span className="material-symbols-outlined">workspace_premium</span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Elite Tier</p>
                <p className="text-sm font-bold text-white">Upgrade to Premium</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-white/50 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>

          <button 
            onClick={() => navigate('/store')}
            className="w-full bg-zinc-900 dark:bg-white p-6 rounded-3xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-xl shadow-zinc-900/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-zinc-900/10 flex items-center justify-center text-white dark:text-zinc-900">
                <span className="material-symbols-outlined">shopping_bag</span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 dark:text-zinc-400">Momentum Store</p>
                <p className="text-sm font-bold text-white dark:text-zinc-900">Redeem Points & Discounts</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-white/30 dark:text-zinc-300 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </section>

        {/* App Info Section */}
        <section className="space-y-3">
          <h2 className="font-headline text-lg font-bold text-zinc-900 dark:text-zinc-50">About</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">App Version</span>
              <span className="text-sm text-zinc-500">1.0.1</span>
            </div>
            <div className="p-4 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Build</span>
              <span className="text-sm text-zinc-500">Production</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">AI Backend</span>
              <span className="text-sm text-emerald-500 font-semibold">● Connected</span>
            </div>
          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  );
}
