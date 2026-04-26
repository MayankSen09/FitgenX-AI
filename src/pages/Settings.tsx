import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import { useSettingsStore, QUICK_ACTION_OPTIONS } from '../stores/settingsStore';

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

        {/* App Info Section */}
        <section className="space-y-3">
          <h2 className="font-headline text-lg font-bold text-zinc-900 dark:text-zinc-50">About</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">App Version</span>
              <span className="text-sm text-zinc-500">1.0.0</span>
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
