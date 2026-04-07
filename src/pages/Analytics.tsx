import { useNavigate } from 'react-router-dom';

export default function Analytics() {
  const navigate = useNavigate();
  return (
    <>
      

<nav className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex justify-between items-center px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high">
<img alt="User profile" data-alt="Close-up portrait of a professional female athlete with a determined expression, natural lighting, soft outdoor background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgfoBemLwZbeIYHlbXnjyKMHqE-ACtroJgVrq_GF7hm4KHR133OKXb248APnZZ-gI58GLJeRu6IqOObfMr4Okxdm5aydVBNy24qQyw2V4ziy-c300gBKnq7ZHLsjCDHnDROsKfjeytLXlMI-ZqNBlqcFDAf_DQXhIXUPhe3gfUk7ekxuXTtQ-9bRYIMSjoIO533rIrglayQ5rQOwnzUjZZ-xN4bQGoOrPjgGbQC_4XowJ-VDzELItj7cWPtPOFOe5KpyKb2zKvMAw"/>
</div>
<span className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 font-headline">Goals</span>
</div>
<button className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
</nav>
<main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">

<header className="mb-10">
<h1 className="font-headline text-[1.75rem] font-extrabold tracking-tight leading-none mb-2">Performance Comparison</h1>
<p className="text-secondary font-medium tracking-tight">Last Run vs. Today</p>
</header>

<section className="grid grid-cols-2 gap-4 mb-8">
<div className="bg-surface-container-lowest rounded-lg p-4 overflow-hidden relative group">
<p className="font-label text-[0.6875rem] uppercase tracking-widest font-bold mb-3 opacity-60">Last Run path</p>
<div className="h-40 rounded-xl bg-surface-container-low overflow-hidden">
<img className="w-full h-full object-cover grayscale opacity-60" data-alt="Minimalist top-down satellite view of a winding city park trail with clean blue path overlay" data-location="San Francisco" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGoQtplKjuIxuV7_BxjTIkBvSU1cyNkhLcuwUjX5uu3RevcsPDIOQjE22LMIYOL5OU_oKgqOBNJ4ghdIv6ENUUy62OmRLUMvRKD4prwWy6rQM6SsOoIQJtMyKavqivHyDCGoGwoDBgu2Eo-JMgW06zCxPCno-8E5xnGFYZhVlwzLR1KWXe4-DYCLHNqjDoEM8GOHxUhnPRx2eLQUKYXj9XPG0B9v_y_olb23hpvuZVDMm6UnBnc7KKGe4Tjmd7hyZKyDnJymx0dy4"/>
</div>
<div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold">MAY 12</div>
</div>
<div className="bg-surface-container-lowest rounded-lg p-4 overflow-hidden relative ring-2 ring-secondary/10">
<p className="font-label text-[0.6875rem] uppercase tracking-widest font-bold mb-3 text-secondary">Today's path</p>
<div className="h-40 rounded-xl bg-surface-container-low overflow-hidden relative">
<div className="absolute inset-0 vitality-gradient opacity-10"></div>
<img className="w-full h-full object-cover" data-alt="Dynamic top-down map of a marathon route through urban streets with a glowing mint green performance line" data-location="San Francisco" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbH5TLNralUHExC8tlT857WBvhKsnekOtliQToUhoMt2lga6K4nKCBrM3Ub0bABN6OX8FreKTbgaQKP2FDp6xmT_L2Vk6AeWGXY966vzaNzN_NyNeLnIopQLBrSt6ynH49A4LnedQwv1kQzCK2ZD9-3fa6PNgJT7pVgNofmvthbk0FSKY0TWM8SyfuwgfbZnVwIkVyd0CIaJYLKL600FOoroNDCnd46CO6Reo4y3HR_h6P4ySQannEIMU2FKBFY7wRsM0dd5xGxBU"/>
</div>
<div className="absolute bottom-6 right-6 vitality-gradient text-white px-3 py-1 rounded-full text-[10px] font-bold">TODAY</div>
</div>
</section>

<section className="space-y-4">

<div className="bg-surface-container-low rounded-lg p-6">
<div className="flex items-center justify-between mb-4">
<div className="flex items-center gap-2 text-outline">
<span className="material-symbols-outlined text-sm" data-icon="schedule">schedule</span>
<span className="font-label text-[0.6875rem] uppercase tracking-widest font-bold">Duration</span>
</div>
<div className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-[0.6875rem] font-bold uppercase tracking-wider">
                        -2:15 Fast
                    </div>
</div>
<div className="flex justify-between items-end">
<div className="space-y-1">
<p className="text-sm opacity-40">Previous</p>
<p className="font-headline text-2xl font-bold">45:30</p>
</div>
<div className="text-right space-y-1">
<p className="text-sm text-secondary font-semibold">Today</p>
<p className="font-headline text-4xl font-extrabold tracking-tighter">43:15</p>
</div>
</div>
</div>

<div className="bg-surface-container-low rounded-lg p-6">
<div className="flex items-center justify-between mb-4">
<div className="flex items-center gap-2 text-outline">
<span className="material-symbols-outlined text-sm" data-icon="speed">speed</span>
<span className="font-label text-[0.6875rem] uppercase tracking-widest font-bold">Avg Pace</span>
</div>
<div className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-[0.6875rem] font-bold uppercase tracking-wider">
                        +12% Pace
                    </div>
</div>
<div className="flex justify-between items-end">
<div className="space-y-1">
<p className="text-sm opacity-40">Previous</p>
<p className="font-headline text-2xl font-bold">5'45"</p>
</div>
<div className="text-right space-y-1">
<p className="text-sm text-secondary font-semibold">Today</p>
<p className="font-headline text-4xl font-extrabold tracking-tighter">5'02"</p>
</div>
</div>
</div>

<div className="grid grid-cols-2 gap-4">
<div className="bg-surface-container-low rounded-lg p-6">
<div className="flex items-center gap-2 text-outline mb-4">
<span className="material-symbols-outlined text-sm" data-icon="landscape">landscape</span>
<span className="font-label text-[0.6875rem] uppercase tracking-widest font-bold text-nowrap">Elev. Gain</span>
</div>
<div className="flex flex-col gap-1">
<p className="font-headline text-2xl font-extrabold">142<span className="text-sm font-normal ml-1">m</span></p>
<span className="text-error font-bold text-[0.6875rem]">-4% regression</span>
</div>
</div>
<div className="bg-surface-container-low rounded-lg p-6">
<div className="flex items-center gap-2 text-outline mb-4">
<span className="material-symbols-outlined text-sm" data-icon="local_fire_department">local_fire_department</span>
<span className="font-label text-[0.6875rem] uppercase tracking-widest font-bold text-nowrap">Calories</span>
</div>
<div className="flex flex-col gap-1">
<p className="font-headline text-2xl font-extrabold">640<span className="text-sm font-normal ml-1">kcal</span></p>
<span className="text-tertiary font-bold text-[0.6875rem]">+8% Burn</span>
</div>
</div>
</div>
</section>

<section className="mt-12 flex flex-col gap-4">
<button className="bg-primary text-on-primary font-headline font-bold py-5 rounded-full flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform duration-200">
<span className="material-symbols-outlined" data-icon="share">share</span>
                Share Achievement
            </button>
<button onClick={() => navigate('/dashboard')} className="bg-surface-variant/40 backdrop-blur-md text-on-surface font-semibold py-4 rounded-full active:scale-95 transition-transform duration-200">
                Done
            </button>
</section>
</main>


    </>
  );
}
