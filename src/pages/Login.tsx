import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 vitality-gradient opacity-20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-sm z-10 flex flex-col">
        <div className="mb-12 text-center stagger">
          <div className="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 mb-6">
            <span className="material-symbols-outlined text-white text-3xl">fitness_center</span>
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface mb-2">Goals</h1>
          <p className="text-on-surface-variant text-sm">Atmospheric precision. Your digital sanctuary.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5 stagger w-full">
          <div>
            <label className="block text-[0.6875rem] font-bold font-label uppercase tracking-widest text-on-surface-variant mb-2">Email Address</label>
            <input 
              type="email" 
              placeholder="alex@fitness.co"
              className="w-full bg-surface-container-low border-0 rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-secondary outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-[0.6875rem] font-bold font-label uppercase tracking-widest text-on-surface-variant mb-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-surface-container-low border-0 rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-secondary outline-none transition-all"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary text-white font-bold rounded-full py-4 mt-2 active:scale-95 transition-transform shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
          >
            Sign In
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-4 w-full">
          <div className="h-px bg-outline-variant/30 flex-1"></div>
          <span className="text-[0.6875rem] font-bold font-label uppercase tracking-widest text-on-surface-variant">or continue with</span>
          <div className="h-px bg-outline-variant/30 flex-1"></div>
        </div>

        <div className="mt-8 flex gap-4 w-full">
          <button onClick={() => navigate('/onboarding')} type="button" className="flex-1 bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-3 flex items-center justify-center active:scale-95 transition-transform shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </button>
          <button onClick={() => navigate('/onboarding')} type="button" className="flex-1 bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-3 flex items-center justify-center active:scale-95 transition-transform shadow-sm">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-zinc-900" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.29-.88 4-.84 1.33.17 2.37.52 3.05 1.5-2.64 1.62-2.18 5.14.4 6.18-.62 1.63-1.63 3.58-2.53 5.35M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
