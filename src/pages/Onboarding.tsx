import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();
  const [gender, setGender] = useState('Male');
  const [focus, setFocus] = useState('Gain muscle');
  const [level, setLevel] = useState('Intermediate');
  const [preferences, setPreferences] = useState<string[]>(['Gym']);

  const togglePreference = (pref: string) => {
    setPreferences(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px] vitality-gradient"></div>
        <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full opacity-15 blur-[100px] vitality-gradient"></div>
      </div>
      <main className="relative z-10 min-h-screen flex flex-col items-center px-6 pt-12 pb-24 max-w-2xl mx-auto">
        <header className="w-full mb-12 text-center">
          <div className="flex justify-between items-end mb-8">
            <div className="text-left">
              <span className="font-label text-label-sm uppercase tracking-widest text-secondary font-bold">Step 2 of 4</span>
              <h1 className="font-headline text-[1.75rem] font-extrabold tracking-tight text-on-surface mt-1">Personal Metrics</h1>
            </div>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle className="text-surface-container-high/40" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="6"></circle>
                <circle cx="32" cy="32" fill="transparent" r="28" stroke="url(#vitality-gradient-svg)" strokeDasharray="175" strokeDashoffset="87" strokeLinecap="round" strokeWidth="6"></circle>
                <defs>
                  <linearGradient id="vitality-gradient-svg" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#AAF0D1' }}></stop>
                    <stop offset="100%" style={{ stopColor: '#007AFF' }}></stop>
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute text-[0.6875rem] font-bold font-label">50%</span>
            </div>
          </div>
        </header>

        <div className="w-full space-y-12">
          <section className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-8 rounded-lg flex flex-col justify-between h-44 group hover:ring-2 ring-secondary/20 transition-all duration-300">
              <label className="font-label text-label-sm uppercase tracking-widest text-outline font-bold">Age</label>
              <div className="flex items-baseline gap-2">
                <input className="w-full bg-transparent border-none p-0 font-headline text-5xl font-extrabold focus:ring-0 text-on-surface" placeholder="24" type="number"/>
                <span className="text-outline font-medium">yrs</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-lg flex flex-col justify-between h-44 group hover:ring-2 ring-secondary/20 transition-all duration-300">
              <label className="font-label text-label-sm uppercase tracking-widest text-outline font-bold">Gender</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setGender('Male')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all ${gender === 'Male' ? 'bg-secondary-container text-on-secondary-container ring-2 ring-secondary' : 'bg-surface-container-high text-on-surface-variant'}`}
                >Male</button>
                <button 
                  onClick={() => setGender('Female')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all ${gender === 'Female' ? 'bg-secondary-container text-on-secondary-container ring-2 ring-secondary' : 'bg-surface-container-high text-on-surface-variant'}`}
                >Female</button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="bg-surface-container-low p-8 rounded-lg flex items-center justify-between group hover:bg-surface-container transition-colors">
              <div>
                <label className="font-label text-label-sm uppercase tracking-widest text-outline font-bold">Height</label>
                <div className="flex items-baseline gap-2 mt-2">
                  <input className="bg-transparent border-none p-0 font-headline text-4xl font-extrabold focus:ring-0 text-on-surface w-24" placeholder="178" type="number"/>
                  <span className="text-on-surface-variant font-semibold">cm</span>
                </div>
              </div>
              <div className="h-16 w-16 rounded-full bg-surface-container-lowest flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-3xl" data-icon="straighten">straighten</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-8 rounded-lg flex items-center justify-between group hover:bg-surface-container transition-colors">
              <div>
                <label className="font-label text-label-sm uppercase tracking-widest text-outline font-bold">Weight</label>
                <div className="flex items-baseline gap-2 mt-2">
                  <input className="bg-transparent border-none p-0 font-headline text-4xl font-extrabold focus:ring-0 text-on-surface w-24" placeholder="72.5" type="number"/>
                  <span className="text-on-surface-variant font-semibold">kg</span>
                </div>
              </div>
              <div className="h-16 w-16 rounded-full bg-surface-container-lowest flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-3xl" data-icon="monitor_weight">monitor_weight</span>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="font-headline text-xl font-bold tracking-tight">Select your main focus</h2>
              <div className="h-px flex-1 bg-outline-variant/15"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <button 
                onClick={() => setFocus('Gain muscle')}
                className={`p-6 rounded-lg text-left flex items-start gap-4 active:scale-95 transition-all ${focus === 'Gain muscle' ? 'bg-surface-container-lowest ring-2 ring-secondary' : 'bg-surface-container-low hover:bg-surface-container-high'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${focus === 'Gain muscle' ? 'vitality-gradient text-white' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined" data-icon="fitness_center">fitness_center</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">Gain muscle</p>
                  <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">Increase strength and hypertrophy</p>
                </div>
              </button>

              <button 
                onClick={() => setFocus('Lose weight')}
                className={`p-6 rounded-lg text-left flex items-start gap-4 active:scale-95 transition-all ${focus === 'Lose weight' ? 'bg-surface-container-lowest ring-2 ring-secondary' : 'bg-surface-container-low hover:bg-surface-container-high'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${focus === 'Lose weight' ? 'vitality-gradient text-white' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined" data-icon="water_drop">water_drop</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">Lose weight</p>
                  <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">Burn fat and improve metabolism</p>
                </div>
              </button>

              <button 
                onClick={() => setFocus('Endurance')}
                className={`p-6 rounded-lg text-left flex items-start gap-4 active:scale-95 transition-all ${focus === 'Endurance' ? 'bg-surface-container-lowest ring-2 ring-secondary' : 'bg-surface-container-low hover:bg-surface-container-high'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${focus === 'Endurance' ? 'vitality-gradient text-white' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined" data-icon="directions_run">directions_run</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">Endurance</p>
                  <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">Increase cardiovascular health</p>
                </div>
              </button>

              <button 
                onClick={() => setFocus('Maintain')}
                className={`p-6 rounded-lg text-left flex items-start gap-4 active:scale-95 transition-all ${focus === 'Maintain' ? 'bg-surface-container-lowest ring-2 ring-secondary' : 'bg-surface-container-low hover:bg-surface-container-high'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${focus === 'Maintain' ? 'vitality-gradient text-white' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined" data-icon="balance">balance</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">Maintain</p>
                  <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">Keep current fitness level</p>
                </div>
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="font-label text-label-sm uppercase tracking-widest text-outline font-bold">Fitness Level</label>
              <div className="flex flex-col gap-2">
                <div onClick={() => setLevel('Beginner')} className={`p-4 rounded-xl flex items-center justify-between group cursor-pointer transition-colors ${level === 'Beginner' ? 'bg-secondary-container/10 border-2 border-secondary' : 'bg-surface-container-low hover:bg-surface-container'}`}>
                  <span className={`font-medium ${level === 'Beginner' ? 'font-bold text-secondary' : ''}`}>Beginner</span>
                  {level === 'Beginner' ? (
                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[12px] text-white font-bold" data-icon="check">check</span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-outline-variant"></div>
                  )}
                </div>
                
                <div onClick={() => setLevel('Intermediate')} className={`p-4 rounded-xl flex items-center justify-between group cursor-pointer transition-colors ${level === 'Intermediate' ? 'bg-secondary-container/10 border-2 border-secondary' : 'bg-surface-container-low hover:bg-surface-container'}`}>
                  <span className={`font-medium ${level === 'Intermediate' ? 'font-bold text-secondary' : ''}`}>Intermediate</span>
                  {level === 'Intermediate' ? (
                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[12px] text-white font-bold" data-icon="check">check</span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-outline-variant"></div>
                  )}
                </div>

                <div onClick={() => setLevel('Advanced')} className={`p-4 rounded-xl flex items-center justify-between group cursor-pointer transition-colors ${level === 'Advanced' ? 'bg-secondary-container/10 border-2 border-secondary' : 'bg-surface-container-low hover:bg-surface-container'}`}>
                  <span className={`font-medium ${level === 'Advanced' ? 'font-bold text-secondary' : ''}`}>Advanced</span>
                  {level === 'Advanced' ? (
                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[12px] text-white font-bold" data-icon="check">check</span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-outline-variant"></div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="font-label text-label-sm uppercase tracking-widest text-outline font-bold">Preferences</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => togglePreference('Home')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-colors ${preferences.includes('Home') ? 'bg-secondary-container text-on-secondary-container border-2 border-secondary' : 'bg-surface-container-low hover:bg-surface-container'}`}
                >
                  <span className="material-symbols-outlined" data-icon="home">home</span>
                  <span className="text-xs font-bold uppercase tracking-wider">Home</span>
                </button>
                <button 
                  onClick={() => togglePreference('Gym')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-colors ${preferences.includes('Gym') ? 'bg-secondary-container text-on-secondary-container border-2 border-secondary' : 'bg-surface-container-low hover:bg-surface-container'}`}
                >
                  <span className="material-symbols-outlined" data-icon="apartment">apartment</span>
                  <span className="text-xs font-bold uppercase tracking-wider">Gym</span>
                </button>
                <button 
                  onClick={() => togglePreference('Outdoor')}
                  className={`col-span-2 flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-colors ${preferences.includes('Outdoor') ? 'bg-secondary-container text-on-secondary-container border-2 border-secondary' : 'bg-surface-container-low hover:bg-surface-container'}`}
                >
                  <span className="material-symbols-outlined" data-icon="park">park</span>
                  <span className="text-xs font-bold uppercase tracking-wider">Outdoor</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        <footer className="fixed bottom-0 left-0 w-full p-6 pb-10 flex justify-center pointer-events-none">
          <div className="w-full max-w-lg pointer-events-auto">
            <button onClick={() => navigate('/dashboard')} className="w-full py-5 rounded-full bg-primary text-on-primary font-headline font-extrabold text-lg flex items-center justify-center gap-3 shadow-[0_12px_40px_rgba(0,0,0,0.2)] active:scale-95 transition-all">
              <span>Generate AI Plan</span>
              <span className="material-symbols-outlined" data-icon="bolt">bolt</span>
            </button>
            <p className="text-center mt-4 text-outline font-label text-[0.6875rem] uppercase tracking-widest font-bold">
              AI engine creates your custom program instantly
            </p>
          </div>
        </footer>

        <div className="fixed top-24 -right-12 hidden lg:block w-64 p-6 glass-panel rounded-lg shadow-xl border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full vitality-gradient flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white text-xl" data-icon="auto_awesome">auto_awesome</span>
            </div>
            <div>
              <p className="font-bold text-sm">Goals AI</p>
              <p className="text-[10px] text-tertiary uppercase tracking-tighter">Analyzing input...</p>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Based on your <span className="text-secondary font-bold">{level}</span> level and <span className="text-secondary font-bold">{focus}</span> goal, I'm already calculating an optimal PPL split for you.
          </p>
        </div>

        <div className="mt-12 mb-32 w-full rounded-lg overflow-hidden h-48 bg-surface-container-low relative group">
          <img alt="Fitness Motivation" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" data-alt="abstract minimalist fitness photography with soft cool tones and dramatic shadows of athletic gear in a clean studio" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCa2yMHsDdEOFgCAHdqBC9l9Bxz3rtdeF1zclHd1pDxGWiuOZbGVvWE893_4ZgFDRWCTtbwKRJl2y0upD-he7D7FhVrdGP88OnIf5_uaTOomoV1HhYjBRTtR5QINLPA_xEJhvChHmbxRqsoLX_917_ArgA3OiiFEYPYWZrZ4v2jtAgaRA5O7vOcno7aBrLtWtNu0-GqgNl02YNv4-EfeRZikE9PO5BgHwEG5qimkmSykYH88SMLiuFGbKSD35FrYNkkNAyYQp_U2ro"/>
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
          <div className="absolute bottom-6 left-8">
            <h3 className="font-headline text-lg font-extrabold text-on-surface">Almost there, Michael.</h3>
            <p className="text-sm text-on-surface-variant italic">"The only bad workout is the one that didn't happen."</p>
          </div>
        </div>
      </main>
    </>
  );
}
