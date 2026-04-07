import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <>
      

<header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex justify-between items-center px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high">
<img alt="User Profile Avatar" className="w-full h-full object-cover" data-alt="Close up portrait of a young man with athletic features in soft cinematic sunlight lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt4nHXSVQB2_KC0xGNVWAcqHwkY_ckUSTQTZF6rLF1Haxs3GqvSae9uqOpOOknxcfrJ7CjHUv7tk9ea1sIuAh8kAwuPGh-oM0NcZZQ-gSzQanrEU5vW7ptNblJQhYhIe0-uy6K-hjborR0m8eZXo4SutxE5dzeWd-eLitn4VCjR0kYxLuVvP6yoogcu9_FQJwUlIK97PjC3PjG6n0FTZW4EILe4ZfOlQxvuRLmhySjnuK4YngE6sx6zOLYTcJiSDFax3AZiOndS_Q"/>
</div>
<div>
<p className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary font-label">Good morning,</p>
<h1 className="text-xl font-extrabold tracking-tighter text-zinc-900 dark:text-zinc-50 font-headline">Alex</h1>
</div>
</div>
<div className="flex items-center gap-4">
<button className="material-symbols-outlined text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity p-2 bg-surface-container-low rounded-full">notifications</button>
</div>
</header>
<main className="mt-24 px-6 max-w-2xl mx-auto">

<section className="mb-10">
<div className="flex justify-between items-end mb-6">
<h2 className="font-headline text-lg font-extrabold tracking-tight">Activity Streak</h2>
<span className="text-tertiary font-bold font-label text-[0.6875rem] uppercase tracking-widest">October 2023</span>
</div>
<div className="grid grid-cols-7 gap-2">

<div className="flex flex-col items-center gap-2">
<span className="text-[0.6875rem] font-bold font-label text-on-surface-variant">M</span>
<div className="w-10 h-14 rounded-full bg-surface-container-low flex items-center justify-center border border-outline-variant/15">
<span className="text-sm font-bold">16</span>
</div>
</div>

<div className="flex flex-col items-center gap-2">
<span className="text-[0.6875rem] font-bold font-label text-on-surface-variant">T</span>
<div className="w-10 h-14 rounded-full vitality-gradient flex items-center justify-center shadow-lg shadow-secondary/20">
<span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
</div>
</div>

<div className="flex flex-col items-center gap-2">
<span className="text-[0.6875rem] font-bold font-label text-secondary">W</span>
<div className="w-10 h-14 rounded-full bg-secondary-container flex items-center justify-center ring-2 ring-secondary ring-offset-2 ring-offset-surface">
<span className="text-sm font-bold text-white">18</span>
</div>
</div>

<div className="flex flex-col items-center gap-2">
<span className="text-[0.6875rem] font-bold font-label text-on-surface-variant">T</span>
<div className="w-10 h-14 rounded-full bg-surface-container-low flex items-center justify-center">
<span className="text-sm font-bold">19</span>
</div>
</div>

<div className="flex flex-col items-center gap-2">
<span className="text-[0.6875rem] font-bold font-label text-on-surface-variant">F</span>
<div className="w-10 h-14 rounded-full bg-surface-container-low flex items-center justify-center">
<span className="text-sm font-bold">20</span>
</div>
</div>

<div className="flex flex-col items-center gap-2">
<span className="text-[0.6875rem] font-bold font-label text-on-surface-variant">S</span>
<div className="w-10 h-14 rounded-full bg-surface-container-low flex items-center justify-center">
<span className="text-sm font-bold">21</span>
</div>
</div>

<div className="flex flex-col items-center gap-2">
<span className="text-[0.6875rem] font-bold font-label text-on-surface-variant">S</span>
<div className="w-10 h-14 rounded-full bg-surface-container-low flex items-center justify-center">
<span className="text-sm font-bold">22</span>
</div>
</div>
</div>
</section>

<div className="grid grid-cols-2 gap-4 mb-10">

<button onClick={() => navigate('/ai-coach')} className="col-span-1 text-left p-6 rounded-lg bg-primary text-on-primary shadow-xl shadow-primary/10 relative overflow-hidden flex flex-col justify-between h-48 hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer">
<div className="z-10">
<p className="text-[0.6875rem] font-bold font-label uppercase tracking-widest opacity-80">Weekly Status</p>
<h3 className="font-headline text-lg font-bold">Performance</h3>
</div>
<div className="z-10">
<span className="font-headline text-6xl font-extrabold tracking-tighter">A+</span>
</div>

<div className="absolute -right-8 -bottom-8 w-32 h-32 vitality-gradient opacity-30 rounded-full blur-3xl pointer-events-none"></div>
</button>

<div className="col-span-1 flex flex-col gap-4">
<div className="p-4 rounded-lg bg-surface-container-low flex items-center justify-between">
<div>
<p className="text-[0.6875rem] font-bold font-label uppercase tracking-widest text-on-surface-variant">Steps</p>
<p className="font-headline font-bold text-lg leading-tight">12,430</p>
</div>
<span className="material-symbols-outlined text-secondary opacity-40">footprint</span>
</div>
<div className="p-4 rounded-lg bg-surface-container-low flex items-center justify-between">
<div>
<p className="text-[0.6875rem] font-bold font-label uppercase tracking-widest text-on-surface-variant">Streak</p>
<p className="font-headline font-bold text-lg leading-tight">14 Days</p>
</div>
<span className="material-symbols-outlined text-tertiary opacity-40">local_fire_department</span>
</div>
</div>

<div className="col-span-2 p-6 rounded-lg bg-tertiary-container/10 border border-tertiary/10 relative overflow-hidden">
<div className="flex items-start gap-4">
<div className="p-3 bg-tertiary/20 rounded-xl">
<span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: '"FILL" 1' }}>auto_awesome</span>
</div>
<div>
<p className="font-headline text-md font-bold text-on-surface">Endurance Insight</p>
<p className="text-on-surface-variant text-sm mt-1">Your endurance improved by <span className="text-tertiary font-bold">12%</span> this week. Your pace on morning runs is stabilizing.</p>
</div>
</div>

<div className="mt-6 h-12 w-full flex items-end gap-1 px-2">
<div className="flex-1 bg-tertiary/20 rounded-t-sm h-[30%]"></div>
<div className="flex-1 bg-tertiary/20 rounded-t-sm h-[45%]"></div>
<div className="flex-1 bg-tertiary/20 rounded-t-sm h-[40%]"></div>
<div className="flex-1 bg-tertiary/20 rounded-t-sm h-[60%]"></div>
<div className="flex-1 bg-tertiary/20 rounded-t-sm h-[55%]"></div>
<div className="flex-1 bg-tertiary/20 rounded-t-sm h-[85%]"></div>
<div className="flex-1 bg-tertiary rounded-t-sm h-[100%]"></div>
</div>
</div>
</div>

<section className="mb-10">
<div className="flex justify-between items-center mb-6">
<h2 className="font-headline text-lg font-extrabold tracking-tight">Today's Routine</h2>
<button onClick={() => navigate('/workouts')} className="text-secondary font-bold text-sm">View All</button>
</div>
<div className="flex flex-col gap-6">

<div className="group relative h-48 rounded-lg overflow-hidden flex flex-col justify-end p-6">
<img alt="Workout Background" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Interior of a high-end boutique fitness studio with heavy weights and moody overhead lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAof8PPPc41xWzCq0HdhSmpcr4a7F0HpjhiGb7X4NEX-KHirgCvOegkUbHZOhcq8l5K6aTtlZDS8noOonZcvMFbR0GbG_OoZ7W3_lrG7TAByNNkgJ5UjT7sdUr_dsHZ1js2wGVLAbcxINFDadKKj-LCmErlU4waw0IX13SVco93rIB7O_iazn9p7kh0e5Zf-KCBKWID-5_uthJuqDLC-mVnjjbxCYvY8vwBX5fUI7mWbl66WqMxiJvohX2acaa3i-Lt4HgPzAlNv5w"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
<div className="relative z-10 flex justify-between items-end">
<div>
<span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[0.6rem] font-bold uppercase tracking-widest mb-2">Strength</span>
<h3 className="text-white font-headline text-xl font-bold">Upper Body Power</h3>
<p className="text-white/70 text-xs mt-1">45 mins • Intermediate</p>
</div>
<button onClick={() => navigate('/workout-detail/1')} className="w-12 h-12 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>play_arrow</span>
</button>
</div>
</div>

<div className="group relative h-48 rounded-lg overflow-hidden flex flex-col justify-end p-6">
<img alt="Running Background" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Young athlete running on a paved trail through a lush urban park at dawn with morning mist" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcij6wSOUlVX9lk-5NvSOtw_p7_yiLk0HvFdaV_4-pqjLozMCEEQNs69Ee71_CAdBmSOLy-pwf2QW4q4-RAn_5IZlRUoD7st9NlIeb6_C8eW53ja5nWVryic0QMNg9fiLIvOSxjv2cqL1UNuwZe55jBmEzGFOx5NzQ531OMiH9jIH7IJVq2AWDOUGKOw3fVTax7hto8IcD3yyW6MT9w-nv9NrStMvwg7d4DYzX7K6t-96VVm27_GMRYM6xJGJ8_aZeUACP_QnXqPU"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
<div className="relative z-10 flex justify-between items-end">
<div>
<span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[0.6rem] font-bold uppercase tracking-widest mb-2">Cardio</span>
<h3 className="text-white font-headline text-xl font-bold">Morning Tempo Run</h3>
<p className="text-white/70 text-xs mt-1">5.2 km • 32 mins</p>
</div>
<button onClick={() => navigate('/workout-detail/2')} className="w-12 h-12 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>play_arrow</span>
</button>
</div>
</div>

<div className="group relative h-48 rounded-lg overflow-hidden flex flex-col justify-end p-6">
<img alt="Yoga Background" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Serene yoga studio with warm wood floors and large windows looking out to greenery in soft morning light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZayTTWyf-bhhs_4dC5AzJPjVsA7IgV-lBgO0YCdeEr9ecGAoFEUP9yUo6E_hV63ngiLOTka-gQGJbqQjX0la-Gc0QTvnuJzSrWwtsxQk-i5M1hY_zP8NRXf68GmiH_-KN5KIUdcmUWRXq9OIuVvRdqye6-INqs5Tq7VnhZKS0klXWrdHZ-OJQ_Xz1QDxRMuGeOLQnGAgoSu1_5o_qpbMzh_T1niJtPTTQvyYRYiU9_QmYij88Brrs5oomuNxQyy9pHq9uNS8BvdA"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
<div className="relative z-10 flex justify-between items-end">
<div>
<span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[0.6rem] font-bold uppercase tracking-widest mb-2">Recovery</span>
<h3 className="text-white font-headline text-xl font-bold">Deep Flow Stretch</h3>
<p className="text-white/70 text-xs mt-1">20 mins • All levels</p>
</div>
<button onClick={() => navigate('/workout-detail/3')} className="w-12 h-12 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>play_arrow</span>
</button>
</div>
</div>
</div>
</section>
</main>

<button className="absolute right-6 bottom-32 w-14 h-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center z-50 active:scale-90 transition-transform duration-200" style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}>
<span className="material-symbols-outlined text-3xl">add</span>
</button>



    </>
  );
}
