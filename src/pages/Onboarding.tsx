import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export default function Onboarding() {
  const navigate = useNavigate();
  const { setProfile } = useAppStore();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  
  // Form State
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [gender, setGender] = useState('Male');
  const [focus, setFocus] = useState('Gain muscle');
  const [level, setLevel] = useState('Intermediate');
  const [preferences, setPreferences] = useState<string[]>(['Gym']);
  const [age, setAge] = useState('24');
  const [height, setHeight] = useState('178');
  const [weight, setWeight] = useState('72.5');

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const togglePreference = (pref: string) => {
    setPreferences(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const nextStep = () => {
    if (step < 3) {
      setDirection(1);
      setStep(s => s + 1);
    } else if (step === 3) {
      startGeneration();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  };

  const startGeneration = () => {
    // Save profile to store
    setProfile({ name, college, age, gender, height, weight, focus, level, preferences });
    // Mark onboarding as complete
    localStorage.setItem('fitgenx-onboarding-complete', 'true');
    setStep(4);
    setIsGenerating(true);
  };

  useEffect(() => {
    if (step === 4 && isGenerating) {
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => navigate('/dashboard'), 1000);
            return 100;
          }
          return prev + 1.5;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step, isGenerating, navigate]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  const stepsData = [
    { title: "Personal Details", subtitle: "Step 1 of 4", progress: 25 },
    { title: "Physical Metrics", subtitle: "Step 2 of 4", progress: 50 },
    { title: "Performance & Goals", subtitle: "Step 3 of 4", progress: 75 },
    { title: "Generating Plan", subtitle: "Step 4 of 4", progress: 100 },
  ];

  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px] vitality-gradient"></div>
        <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full opacity-15 blur-[100px] vitality-gradient"></div>
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center px-6 pt-12 pb-24 max-w-2xl mx-auto overflow-hidden">
        {step < 4 && (
          <header className="w-full mb-12 text-center">
            <div className="flex justify-between items-end mb-8">
              <div className="text-left">
                <span className="font-label text-label-sm uppercase tracking-widest text-secondary font-bold">
                  {stepsData[step-1].subtitle}
                </span>
                <h1 className="font-headline text-[1.75rem] font-extrabold tracking-tight text-on-surface mt-1">
                  {stepsData[step-1].title}
                </h1>
              </div>
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle className="text-surface-container-high/40" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="6"></circle>
                  <circle 
                    cx="32" cy="32" fill="transparent" r="28" 
                    stroke="url(#vitality-gradient-svg)" 
                    strokeDasharray="175" 
                    strokeDashoffset={175 - (175 * stepsData[step-1].progress) / 100} 
                    strokeLinecap="round" strokeWidth="6"
                    className="transition-all duration-700 ease-in-out"
                  ></circle>
                  <defs>
                    <linearGradient id="vitality-gradient-svg" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#AAF0D1' }}></stop>
                      <stop offset="100%" style={{ stopColor: '#007AFF' }}></stop>
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute text-[0.6875rem] font-bold font-label">
                  {stepsData[step-1].progress}%
                </span>
              </div>
            </div>
          </header>
        )}

        <div className="w-full flex-grow relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="w-full"
            >
              {step === 1 && (
                <div className="space-y-6">
                  {/* Name & College */}
                  <section className="space-y-4">
                    <div className="bg-surface-container-lowest p-6 rounded-lg group hover:ring-2 ring-secondary/20 transition-all duration-300">
                      <label className="font-label text-label-sm uppercase tracking-widest text-outline font-bold block mb-3">Your Name</label>
                      <input 
                        className="w-full bg-transparent border-none p-0 font-headline text-2xl font-extrabold focus:ring-0 text-on-surface placeholder:text-outline-variant/40" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        type="text"
                      />
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-lg group hover:ring-2 ring-secondary/20 transition-all duration-300">
                      <label className="font-label text-label-sm uppercase tracking-widest text-outline font-bold block mb-3">College / University</label>
                      <input 
                        className="w-full bg-transparent border-none p-0 font-headline text-xl font-bold focus:ring-0 text-on-surface placeholder:text-outline-variant/40" 
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="e.g. MIT, Stanford"
                        type="text"
                      />
                    </div>
                  </section>
                  {/* Age & Gender */}
                  <section className="grid grid-cols-2 gap-4">
                    <div className="bg-surface-container-lowest p-6 rounded-lg flex flex-col justify-between h-36 group hover:ring-2 ring-secondary/20 transition-all duration-300">
                      <label className="font-label text-label-sm uppercase tracking-widest text-outline font-bold">Age</label>
                      <div className="flex items-baseline gap-2">
                        <input 
                          className="w-full bg-transparent border-none p-0 font-headline text-4xl font-extrabold focus:ring-0 text-on-surface" 
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          type="number"
                        />
                        <span className="text-outline font-medium">yrs</span>
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-lg flex flex-col justify-between h-36 group hover:ring-2 ring-secondary/20 transition-all duration-300">
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
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <section className="space-y-4">
                    <div className="bg-surface-container-low p-8 rounded-lg flex items-center justify-between group hover:bg-surface-container transition-colors">
                      <div>
                        <label className="font-label text-label-sm uppercase tracking-widest text-outline font-bold">Height</label>
                        <div className="flex items-baseline gap-2 mt-2">
                          <input 
                            className="bg-transparent border-none p-0 font-headline text-4xl font-extrabold focus:ring-0 text-on-surface w-24" 
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            type="number"
                          />
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
                          <input 
                            className="bg-transparent border-none p-0 font-headline text-4xl font-extrabold focus:ring-0 text-on-surface w-24" 
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            type="number"
                          />
                          <span className="text-on-surface-variant font-semibold">kg</span>
                        </div>
                      </div>
                      <div className="h-16 w-16 rounded-full bg-surface-container-lowest flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-3xl" data-icon="monitor_weight">monitor_weight</span>
                      </div>
                    </div>
                  </section>
                  <div className="mt-12 w-full rounded-lg overflow-hidden h-48 bg-surface-container-low relative group">
                    <img alt="Fitness Motivation" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
                    <div className="absolute bottom-6 left-8">
                       <h3 className="font-headline text-lg font-extrabold text-on-surface">Precision Metrics.</h3>
                       <p className="text-sm text-on-surface-variant italic">Accurate data ensures an optimized program.</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-12 pb-12">
                  <section className="space-y-6">
                    <div className="flex items-center gap-4">
                      <h2 className="font-headline text-xl font-bold tracking-tight">Main focus</h2>
                      <div className="h-px flex-1 bg-outline-variant/15"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button 
                        onClick={() => setFocus('Gain muscle')}
                        className={`p-6 rounded-lg text-left flex items-start gap-4 active:scale-95 transition-all ${focus === 'Gain muscle' ? 'bg-surface-container-lowest ring-2 ring-secondary' : 'bg-surface-container-low'}`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${focus === 'Gain muscle' ? 'vitality-gradient text-white' : 'bg-surface-container-highest'}`}>
                          <span className="material-symbols-outlined" data-icon="fitness_center">fitness_center</span>
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">Gain muscle</p>
                          <p className="text-xs text-on-surface-variant mt-1">Increase strength</p>
                        </div>
                      </button>
                      <button 
                        onClick={() => setFocus('Lose weight')}
                        className={`p-6 rounded-lg text-left flex items-start gap-4 active:scale-95 transition-all ${focus === 'Lose weight' ? 'bg-surface-container-lowest ring-2 ring-secondary' : 'bg-surface-container-low'}`}
                      >
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${focus === 'Lose weight' ? 'vitality-gradient text-white' : 'bg-surface-container-highest'}`}>
                          <span className="material-symbols-outlined" data-icon="water_drop">water_drop</span>
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">Lose weight</p>
                          <p className="text-xs text-on-surface-variant mt-1">Burn fat</p>
                        </div>
                      </button>
                    </div>
                  </section>

                  <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="font-label text-label-sm uppercase tracking-widest text-outline font-bold">Fitness Level</label>
                      <div className="flex flex-col gap-2">
                        {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                          <div key={l} onClick={() => setLevel(l)} className={`p-4 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${level === l ? 'bg-secondary-container/10 border-2 border-secondary' : 'bg-surface-container-low'}`}>
                            <span className={`font-medium ${level === l ? 'font-bold text-secondary' : ''}`}>{l}</span>
                            {level === l && <span className="material-symbols-outlined text-[12px] text-secondary font-bold" data-icon="check">check</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="font-label text-label-sm uppercase tracking-widest text-outline font-bold">Environment</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Home', 'Gym'].map((p) => (
                          <button 
                            key={p}
                            onClick={() => togglePreference(p)}
                            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-colors ${preferences.includes(p) ? 'bg-secondary-container border-2 border-secondary' : 'bg-surface-container-low'}`}
                          >
                            <span className="material-symbols-outlined" data-icon={p === 'Home' ? 'home' : 'apartment'}>{p === 'Home' ? 'home' : 'apartment'}</span>
                            <span className="text-xs font-bold uppercase tracking-wider">{p}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <div className="absolute inset-0 vitality-gradient opacity-20 blur-3xl rounded-full animate-pulse"></div>
                    <svg className="w-full h-full -rotate-90">
                      <circle className="text-zinc-200/20" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12"></circle>
                      <circle 
                        cx="96" cy="96" fill="transparent" r="80" 
                        stroke="url(#vitality-gradient-lg)" 
                        strokeDasharray="502.6" 
                        strokeDashoffset={502.6 - (502.6 * generationProgress) / 100} 
                        strokeLinecap="round" strokeWidth="12"
                        className="transition-all duration-300 ease-out"
                      ></circle>
                      <defs>
                        <linearGradient id="vitality-gradient-lg" x1="0%" x2="100%" y1="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#AAF0D1' }}></stop>
                          <stop offset="100%" style={{ stopColor: '#007AFF' }}></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="font-headline text-4xl font-extrabold">{Math.floor(generationProgress)}%</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-secondary -mt-1">OPTIMIZING</span>
                    </div>
                  </div>

                  <div className="space-y-4 max-w-sm">
                    <h2 className="text-2xl font-bold font-headline tracking-tight text-on-surface">Architecting Your Program</h2>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Our AI engine is currently analyzing your <span className="font-bold text-secondary">32 data points</span> to create a custom hypertrophy protocol.
                    </p>
                    <div className="flex flex-col gap-3 pt-6">
                       {generationProgress > 20 && <div className="flex items-center gap-3 text-left bg-surface-container-low p-4 rounded-xl border border-secondary/10 animate-fade-in">
                          <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                          <span className="text-xs font-bold">Biometric Data Validated</span>
                       </div>}
                       {generationProgress > 50 && <div className="flex items-center gap-3 text-left bg-surface-container-low p-4 rounded-xl border border-secondary/10 animate-fade-in">
                          <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                          <span className="text-xs font-bold">PPL Split Optimized</span>
                       </div>}
                       {generationProgress > 80 && <div className="flex items-center gap-3 text-left bg-surface-container-low p-4 rounded-xl border border-secondary/10 animate-fade-in">
                          <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                          <span className="text-xs font-bold">Nutrition Macros Synced</span>
                       </div>}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {step < 4 && (
          <footer className="fixed bottom-0 left-0 w-full p-6 pb-10 flex justify-center pointer-events-none">
            <div className="w-full max-w-lg pointer-events-auto flex gap-4">
              {step > 1 && (
                <button 
                  onClick={prevStep}
                  className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center active:scale-95 transition-all text-on-surface-variant"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
              )}
              <button 
                onClick={nextStep} 
                className="flex-1 py-5 rounded-full bg-primary text-on-primary font-headline font-extrabold text-lg flex items-center justify-center gap-3 shadow-[0_12px_40px_rgba(0,0,0,0.2)] active:scale-95 transition-all"
              >
                <span>{step === 3 ? 'Generate AI Plan' : 'Continue'}</span>
                <span className="material-symbols-outlined" data-icon="arrow_forward">{step === 3 ? 'bolt' : 'arrow_forward'}</span>
              </button>
            </div>
          </footer>
        )}
      </main>
    </>
  );
}
