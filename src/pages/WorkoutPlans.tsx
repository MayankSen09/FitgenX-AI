import { useNavigate } from 'react-router-dom';

export default function WorkoutPlans() {
  const navigate = useNavigate();
  return (
    <>
      

<header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex justify-between items-center w-full px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden">
<img alt="User Profile" className="w-full h-full object-cover" data-alt="Close up portrait of a fit young woman with athletic gear, natural lighting, professional fitness photography style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQf0_GtxUATyUintzit17pB72IWzdycPulhBYVln6IyH8_egzv0tlkZghjSXefNlb40nTZ_mBkazfyMX5-89tGmXo3Kg3zwFpyRq4La9pE4XhUMKZYEwAX3wW2eqlQGiyzfvdgzMrlZVcK-SEUTjtW-YpRSwPWMpuedaFnHXmYUjibiMOdNtxewEdg_ta_t_MNspdXJoFiPc4s9yxn35YVF98BsPrMfNSpz_ReWOSRjsJDkHNi69UR9KYxu48Alr5Tmx-pOCZz7Dg"/>
</div>
<h1 className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 font-headline">Goals</h1>
</div>
<div className="flex gap-4">
<button className="material-symbols-outlined text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity active:scale-95 duration-200" data-icon="notifications">notifications</button>
</div>
</header>
<main className="pt-24 pb-32 px-6 max-w-5xl mx-auto">

<section className="mb-12">
<h2 className="font-headline text-[1.75rem] font-bold leading-tight mb-6">Exercise Library</h2>
<div className="relative mb-8">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
<input className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-secondary/20 placeholder:text-outline-variant text-body-lg" placeholder="Search exercises..." type="text"/>
</div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
<div className="col-span-2 aspect-[2/1] bg-surface-container-low rounded-lg p-6 flex flex-col justify-between group cursor-pointer overflow-hidden relative">
<div className="z-10">
<span className="font-label text-xs font-bold tracking-widest uppercase text-secondary">FEATURED</span>
<h3 className="font-headline text-2xl font-bold mt-1">Chest</h3>
</div>
<img alt="Chest Workout" className="absolute right-0 bottom-0 w-2/3 h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-500" data-alt="Athletic male performing a heavy bench press in a modern industrial gym setting, dramatic side lighting, shadows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjP8dGtFBaqAUpLd98rqlJChsH1uOkJrtyQ-nqLvq5YH2eDGqF6fYEUz2HMhMGx8JB8TDRPr6yLFM7SZbqU55wKnoe7hrTjHH9mV20l7OC8euto5El1fZbog5Xk7KmzcOnR4uNftaHUvdAYVqQfW4IcIyqOBOQA5vOultUcBlsfa4LW-8EBLEoqzHkkckUZSLMAe8LxebasY4NDow27TWTq-qZIRtEg_ldr-M6gj37J1PcSP89AOA9zh3VfnECJ18mFtcpsUIvvdY"/>
<div className="z-10 text-on-surface-variant font-label text-sm">42 Exercises</div>
</div>
<div className="bg-surface-container-low rounded-lg p-6 flex flex-col justify-between hover:bg-surface-container-high transition-colors cursor-pointer">
<span className="material-symbols-outlined text-tertiary text-3xl">fitness_center</span>
<div>
<h3 className="font-headline text-xl font-bold">Back</h3>
<p className="text-on-surface-variant text-sm">38 Items</p>
</div>
</div>
<div className="bg-surface-container-low rounded-lg p-6 flex flex-col justify-between hover:bg-surface-container-high transition-colors cursor-pointer">
<span className="material-symbols-outlined text-secondary text-3xl">directions_run</span>
<div>
<h3 className="font-headline text-xl font-bold">Legs</h3>
<p className="text-on-surface-variant text-sm">54 Items</p>
</div>
</div>
<div className="bg-surface-container-low rounded-lg p-6 flex flex-col justify-between hover:bg-surface-container-high transition-colors cursor-pointer">
<span className="material-symbols-outlined text-primary text-3xl">accessibility_new</span>
<div>
<h3 className="font-headline text-xl font-bold">Core</h3>
<p className="text-on-surface-variant text-sm">29 Items</p>
</div>
</div>
<div className="bg-surface-container-low rounded-lg p-6 flex flex-col justify-between hover:bg-surface-container-high transition-colors cursor-pointer">
<span className="material-symbols-outlined text-on-secondary-fixed-variant text-3xl">exercise</span>
<div>
<h3 className="font-headline text-xl font-bold">Arms</h3>
<p className="text-on-surface-variant text-sm">41 Items</p>
</div>
</div>
<div className="col-span-2 bg-secondary text-on-secondary rounded-lg p-6 flex items-center justify-between cursor-pointer active:scale-95 transition-transform">
<div className="flex flex-col">
<h3 className="font-headline text-xl font-bold">Smart Filter</h3>
<p className="opacity-80 text-sm">Filter by equipment or time</p>
</div>
<span className="material-symbols-outlined text-3xl">tune</span>
</div>
</div>
</section>

<section className="mb-12">
<div className="flex justify-between items-end mb-6">
<div>
<h2 className="font-headline text-[1.75rem] font-bold leading-tight">Dumbbell Press</h2>
<p className="text-on-surface-variant">Focus: Pectoralis Major, Triceps</p>
</div>
<button className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold active:scale-95 transition-transform">Start Training</button>
</div>

<div className="relative w-full aspect-video md:aspect-[21/9] bg-zinc-950 rounded-lg overflow-hidden flex items-center justify-center">
<div className="absolute inset-0 opacity-40">
<img alt="Gym environment" className="w-full h-full object-cover grayscale" data-alt="Dark empty professional gym interior with soft glowing blue neon accents and high-end equipment, cinematic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4ra-5N5C_zZ-s2str8satpm5NFZKJ4fwLoUNkOPqhSrQa8GfSKRzNNykS96RjQ3HYYpFUe_LHta2NGnxOH2cAhWX0yRkUvwLPQuUej7wtZixp9wMkwo9hf0Qjd2ReZpNzivQMrhCK1gAeKz5uNn5ouX6_DkOWmaKCOYc92z2eAZEuW1xcpHcelPgksM84VZQiKJDJoh9qeAdecdYSE6o9H-OrO-3SgSr_aPJYOCiqITpeqynplx7i8TIRyiF2cUKimIFMEDoUkMU"/>
</div>

<div className="relative z-10 flex flex-col items-center">
<div className="w-64 h-64 relative">

<div className="absolute inset-0 vitality-gradient rounded-full blur-3xl opacity-20"></div>
<img alt="3D Muscle Model" className="w-full h-full object-contain relative z-20 drop-shadow-2xl" data-alt="Hyper-realistic 3D anatomical render of a human torso performing a dumbbell press, highlighted muscle groups in neon teal" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_4LOnvtfbaIKVbt3rZ-tKZu17AcdTdyOFjkwP0Et53YmqUuD1yMjGflS-EYdoI5p0hggTDt1t5zg7sLbd2G-nDpDG2AJODHK17TtJ0-2qHBPe9ttHUP1PNyEEGvj1QMBQQUUYoY-81TmXQu_RENFPaBcII-RVUJavKYT-SLuhIO_HuumLiIJTEDFUFJE2wquUPN5z0ddgHYogOzYrPy3NBoHFnYn3SJ5Ojv5dPCK11Zqgovu2qxhA6tsJoD0M9TEoSniS4DQVzNM"/>
</div>
</div>

<div className="absolute bottom-6 left-6 flex gap-4">
<button className="w-12 h-12 glass-panel-dark rounded-full flex items-center justify-center text-white">
<span className="material-symbols-outlined">rotate_right</span>
</button>
<button className="w-12 h-12 glass-panel-dark rounded-full flex items-center justify-center text-white">
<span className="material-symbols-outlined">zoom_in</span>
</button>
</div>
<div className="absolute top-6 right-6">
<div className="glass-panel-dark text-white px-4 py-2 rounded-full text-sm font-label flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
                        LIVE ANATOMY
                    </div>
</div>
</div>
</section>
</main>




<div className="fixed inset-0 z-[100] bg-zinc-950 text-white flex flex-col hidden" id="immersive-workout">

<button onClick={() => navigate(-1)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
<span className="material-symbols-outlined text-3xl">close</span>
</button>

<div className="p-8 pt-16 flex flex-col items-center">
<div className="w-full max-w-md h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
<div className="w-1/3 h-full vitality-gradient"></div>
</div>
<span className="font-label text-sm tracking-widest text-zinc-400 uppercase font-bold">Exercise 3 of 10</span>
<h2 className="font-headline text-4xl font-bold mt-4">Incline Dumbbell Press</h2>
</div>

<div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
<div className="relative mb-12">
<div className="w-64 h-64 rounded-full border-4 border-white/5 flex items-center justify-center relative">
<svg className="absolute inset-0 w-full h-full -rotate-90">
<circle cx="50%" cy="50%" fill="none" r="126" stroke="url(#vitality-grad)" stroke-dasharray="792" stroke-dashoffset="200" strokeLinecap="round" strokeWidth="8"></circle>
<defs>
<linearGradient id="vitality-grad" x1="0%" x2="100%" y1="0%" y2="100%">
<stop offset="0%" stopColor="#AAF0D1"></stop>
<stop offset="100%" stopColor="#007AFF"></stop>
</linearGradient>
</defs>
</svg>
<span className="text-7xl font-headline font-bold tabular-nums">20:00</span>
</div>
<div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-panel-dark px-4 py-2 rounded-full text-xs font-bold text-tertiary-fixed-dim">TIME REMAINING</div>
</div>
<div className="grid grid-cols-2 gap-8 w-full max-w-sm mb-12">
<div className="flex flex-col items-center">
<span className="text-zinc-500 font-label uppercase tracking-widest text-xs">Set</span>
<span className="text-3xl font-headline font-bold">2 / 4</span>
</div>
<div className="flex flex-col items-center">
<span className="text-zinc-500 font-label uppercase tracking-widest text-xs">Target Reps</span>
<span className="text-3xl font-headline font-bold">12</span>
</div>
</div>
</div>

<div className="p-12 pb-20 flex flex-col items-center bg-gradient-to-t from-zinc-950 to-transparent">
<button className="w-full max-w-md bg-white text-zinc-950 py-6 rounded-full font-bold text-xl active:scale-95 transition-transform flex items-center justify-center gap-3">
                Next Set
                <span className="material-symbols-outlined">arrow_forward</span>
</button>
<button className="mt-8 text-zinc-500 font-bold hover:text-white transition-colors">Pause Workout</button>
</div>
</div>

<button className="absolute bottom-32 right-6 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center z-[60] active:scale-90 transition-transform" >
<span className="material-symbols-outlined text-3xl">play_arrow</span>
</button>

    </>
  );
}
