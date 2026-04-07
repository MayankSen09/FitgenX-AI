
export default function AIAssistant() {
  return (
    <>
      

<header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex justify-between items-center w-full px-6 py-4 shadow-none">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full overflow-hidden">
<img alt="User Profile Avatar" className="w-full h-full object-cover" data-alt="Close up portrait of a fit woman athlete with athletic headband, focused expression, outdoor morning sunlight lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNrzwzHCl7acrq1jEp7xQZwlilFbooGXO4CC3YRVZRFPz1v0D4KG_-8ndv8dN2ypKbj5mhkfHGtO5BlLA2X5rpMdcb3qL7CESHcXBohBwncJos50wqVNNSBTEWeBKZmFRA4SWpfd5ucTk0oCZtx3OGojJa2XsNre9yulpoe8fClnRiTE2saOMYFAtOOEK7r_CZrft8jiWolYdRjxkDCXnj9K-eKX5Bk7zTQwykX7s5AriWiRca8vwydKFaMDGPH6S2JRDT6kb_C2Q"/>
</div>
<h1 className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 Manrope">Goals</h1>
</div>
<button className="material-symbols-outlined text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity active:scale-95 duration-200" data-icon="notifications">
            notifications
        </button>
</header>
<main className="pt-24 pb-32 px-6 max-w-5xl mx-auto space-y-8">

<section className="relative overflow-hidden rounded-lg p-8 vitality-gradient min-h-[280px] flex flex-col justify-end">
<div className="absolute top-0 right-0 p-8 opacity-20">
<span className="material-symbols-outlined text-[120px]" data-icon="neurology">neurology</span>
</div>
<div className="relative z-10 space-y-2">
<span className="Inter label-sm uppercase tracking-widest font-bold text-white/80">Athlete Intelligence</span>
<h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">Peak Performance<br/>Reached.</h2>
<p className="text-white/90 max-w-md font-medium">Your AI Coach has analyzed 48 metric points from your last 7 days.</p>
</div>
</section>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<div className="md:col-span-1 bg-surface-container-low rounded-lg p-8 flex flex-col justify-between items-start">
<div className="space-y-4">
<span className="material-symbols-outlined text-secondary" data-icon="vitals">vitals</span>
<h3 className="font-bold text-lg text-on-surface-variant">Recovery Time</h3>
<div className="text-[3.5rem] font-extrabold font-headline leading-none text-on-surface">18<span className="text-2xl font-bold text-on-surface-variant ml-1">h</span></div>
</div>
<div className="mt-6 w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
<div className="h-full vitality-gradient w-3/4 rounded-full"></div>
</div>
</div>

<div className="md:col-span-2 glass-card rounded-lg p-8 border border-white/20 shadow-sm relative overflow-hidden">
<div className="flex justify-between items-start relative z-10">
<div className="space-y-2">
<span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Smart Insight</span>
<h3 className="text-2xl font-bold text-on-surface">Evening Efficiency</h3>
<p className="text-on-surface-variant leading-relaxed max-w-md">You run 12% faster in evening sessions compared to morning ones. Your core temperature and heart rate variability align best at 6:30 PM.</p>
</div>
<div className="w-32 h-32 opacity-10 absolute -right-4 -bottom-4">
<span className="material-symbols-outlined text-[120px]" data-icon="speed">speed</span>
</div>
</div>
<div className="mt-8 flex gap-4 overflow-x-auto pb-2">
<div className="flex-shrink-0 bg-white/40 p-4 rounded-xl flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-white">
<span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
</div>
<div>
<p className="text-xs font-bold text-on-surface-variant uppercase">Pace Delta</p>
<p className="text-lg font-bold">+1.2 km/h</p>
</div>
</div>
</div>
</div>

<div className="md:col-span-2 bg-primary p-8 rounded-lg text-white flex flex-col justify-between">
<div className="flex justify-between items-center mb-12">
<h3 className="text-2xl font-bold tracking-tight">Workout Optimization</h3>
<span className="material-symbols-outlined" data-icon="settings_suggest">settings_suggest</span>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="space-y-1">
<p className="text-white/60 text-xs font-bold uppercase tracking-widest">Target Zone</p>
<p className="text-xl font-bold">Hypertrophy</p>
</div>
<div className="space-y-1">
<p className="text-white/60 text-xs font-bold uppercase tracking-widest">Intensity</p>
<p className="text-xl font-bold">85% Max HR</p>
</div>
</div>
<button className="mt-8 bg-white text-primary px-8 py-4 rounded-full font-bold w-fit hover:opacity-90 active:scale-95 transition-all">
                    Adjust Plan
                </button>
</div>

<div className="md:col-span-1 bg-surface-container-low rounded-lg p-8 flex flex-col">
<div className="mb-auto">
<div className="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mb-6">
<span className="material-symbols-outlined" data-icon="shield_health">shield</span>
</div>
<h3 className="text-xl font-bold text-on-surface mb-2">Injury Prevention</h3>
<p className="text-on-surface-variant text-sm leading-relaxed">Slight asymmetry detected in left ankle gait. Recommend 10min stability drills.</p>
</div>
<div className="mt-6 pt-6 border-t border-outline-variant/20">
<a className="text-secondary font-bold text-sm flex items-center gap-2" href="#">
                        View Drills <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
</a>
</div>
</div>
</div>

<section className="space-y-6">
<div className="flex justify-between items-center px-2">
<h2 className="text-2xl font-bold tracking-tight text-on-surface">Athlete Intelligence Chat</h2>
<button className="text-secondary font-bold text-sm">View History</button>
</div>
<div className="bg-surface-container rounded-lg p-6 min-h-[300px] flex flex-col">
<div className="flex-grow space-y-6 mb-6">

<div className="flex gap-4 max-w-[85%]">
<div className="w-8 h-8 rounded-full vitality-gradient flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-white text-xs" data-icon="smart_toy">smart_toy</span>
</div>
<div className="bg-white p-5 rounded-2xl rounded-tl-none shadow-sm">
<p className="text-on-surface-variant leading-relaxed">Based on your sleep quality last night (84%) and recovery score, today is an ideal day for a high-intensity threshold run. Should I update your targets?</p>
</div>
</div>

<div className="flex flex-wrap gap-2 pl-12">
<button className="bg-surface-container-highest px-4 py-2 rounded-full text-sm font-semibold text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container transition-colors">Yes, update targets</button>
<button className="bg-surface-container-highest px-4 py-2 rounded-full text-sm font-semibold text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container transition-colors">What's my HRV?</button>
<button className="bg-surface-container-highest px-4 py-2 rounded-full text-sm font-semibold text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container transition-colors">Suggest a warm-up</button>
</div>
</div>

<div className="relative">
<input className="w-full bg-white border-none rounded-full py-4 pl-6 pr-14 shadow-sm focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-outline" placeholder="Ask your coach anything..." type="text"/>
<button className="absolute right-2 top-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center active:scale-90 transition-transform">
<span className="material-symbols-outlined text-xl" data-icon="send">send</span>
</button>
</div>
</div>
</section>

<section className="bg-surface-container-lowest rounded-lg p-8 space-y-6">
<div className="flex justify-between items-end">
<div>
<span className="Inter label-sm uppercase tracking-widest font-bold text-secondary">Performance Curve</span>
<h2 className="text-2xl font-bold tracking-tight text-on-surface">Weekly Progression</h2>
</div>
<div className="flex gap-2">
<span className="w-3 h-3 rounded-full bg-secondary"></span>
<span className="w-3 h-3 rounded-full bg-tertiary-fixed-dim"></span>
</div>
</div>

<div className="h-48 flex items-end justify-between gap-2 pt-8">
<div className="w-full bg-surface-container-high rounded-t-lg h-[40%] transition-all hover:bg-secondary/40 relative group">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] py-1 px-2 rounded">Mon</div>
</div>
<div className="w-full bg-surface-container-high rounded-t-lg h-[55%] transition-all hover:bg-secondary/40"></div>
<div className="w-full bg-surface-container-high rounded-t-lg h-[45%] transition-all hover:bg-secondary/40"></div>
<div className="w-full vitality-gradient rounded-t-lg h-[85%] transition-all shadow-lg relative group">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] py-1 px-2 rounded">Today</div>
</div>
<div className="w-full bg-surface-container-high rounded-t-lg h-[65%] transition-all hover:bg-secondary/40"></div>
<div className="w-full bg-surface-container-high rounded-t-lg h-[75%] transition-all hover:bg-secondary/40"></div>
<div className="w-full bg-surface-container-high rounded-t-lg h-[90%] transition-all hover:bg-secondary/40"></div>
</div>
<div className="flex justify-between text-[10px] font-bold text-outline uppercase tracking-widest pt-2">
<span>Mon</span>
<span>Tue</span>
<span>Wed</span>
<span>Thu</span>
<span>Fri</span>
<span>Sat</span>
<span>Sun</span>
</div>
</section>
</main>



    </>
  );
}
