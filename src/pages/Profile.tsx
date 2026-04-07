
export default function Profile() {
  return (
    <>
      

<header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex justify-between items-center px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high">
<img className="w-full h-full object-cover" data-alt="Close up portrait of a confident young woman with athletic attire, soft natural lighting, high-end editorial photography style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTOQhgJZLgA3tmXjEVMPI3shCqR2vGzHAryFHKeJBhbxFszS5n0fK6cjvg9j1O-bQkuliaZjLVFBVHcTvw7x2B70sa2PRi9WiqQyGfVwkzAkixr4gTTdHsz_8pX0im7Xy248KqFSZZs2Rx9EKnNg_g4Xjm2h0Zb645LyDcYTPQgKZ-zmlWQga8nkwQ2J9yzaztLl-aGpS_d6rtymvxu8Z4Sz4Zli6kD58d56RPqb6bgzoYthibbfBLsf57UTW4-iAVRqwVnH85TiY"/>
</div>
<h1 className="text-xl font-headline font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">Goals</h1>
</div>
<div className="flex items-center gap-4">
<button className="hover:opacity-80 transition-opacity active:scale-95 duration-200">
<span className="material-symbols-outlined text-zinc-500">settings</span>
</button>
<button className="hover:opacity-80 transition-opacity active:scale-95 duration-200">
<span className="material-symbols-outlined text-zinc-500">notifications</span>
</button>
</div>
</header>
<main className="pt-24 px-6 max-w-2xl mx-auto space-y-8">

<section className="space-y-6">
<div className="space-y-2">
<h2 className="font-headline text-3xl font-extrabold tracking-tight">Level 14 Athlete</h2>
<p className="text-on-surface-variant font-medium">Alex Rivera</p>
</div>

<div className="bg-surface-container-low p-6 rounded-lg space-y-4">
<div className="flex justify-between items-end">
<span className="font-label text-[0.6875rem] uppercase tracking-widest font-bold text-secondary">Current Momentum</span>
<span className="font-headline text-xl font-bold">2450 <span className="text-on-surface-variant text-sm font-normal">/ 3000 XP</span></span>
</div>
<div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
<div className="h-full vitality-gradient w-[81%] rounded-full"></div>
</div>
</div>
</section>

<section className="grid grid-cols-1 md:grid-cols-2 gap-4">

<div className="bg-surface-container-lowest rounded-lg p-6 flex flex-col items-center justify-center space-y-4 relative overflow-hidden group">
<div className="absolute inset-0 vitality-gradient opacity-5"></div>
<div className="relative z-10 w-32 h-32 flex items-center justify-center">

<img className="w-full h-full object-contain drop-shadow-2xl" data-alt="A sleek minimalist 3D character design, glowing neon accents, abstract geometric form, soft volumetric lighting, cinematic presentation" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjc1HpffUxium00jm36P-q4sKC6jQ3edT-GgkNRpVAmtCIV4nQYcJHbOuEi54_FPL3HlAxSmHGZ9kCXzIXGy3MwZbPkJruZuB3GTapCp4FIFKFzBG4CMMQMd4PQLSIzb1SAIE3V1gOs_CitDtkIF6jpryHuCOhChe3id0LVqjrbZcqyRPWeaM_1l90NT1APZ5h4Gg5QktGTmQwPkmZk5u2KQCgucFltlcAvtkFVmAt-Z3iAOu1Z8boBD1F0oVYZEUhIUdMRY0vTXw"/>
</div>
<div className="text-center z-10">
<h3 className="font-headline font-bold text-lg">Nova</h3>
<p className="text-sm text-on-surface-variant">Evolved 2 days ago</p>
</div>
</div>

<div className="space-y-4">

<div className="bg-surface-container-low p-5 rounded-lg flex items-center justify-between">
<div>
<p className="font-label text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Weekly Workouts</p>
<p className="font-headline text-2xl font-extrabold">6</p>
</div>
<span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: '"FILL" 1' }}>exercise</span>
</div>

<div className="bg-surface-container-low p-5 rounded-lg flex items-center justify-between">
<div>
<p className="font-label text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Global Rank</p>
<p className="font-headline text-2xl font-extrabold">#128</p>
</div>
<span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>leaderboard</span>
</div>
</div>
</section>

<section className="space-y-4">
<div className="flex justify-between items-center">
<h3 className="font-headline text-xl font-bold">My Badges</h3>
<button className="text-secondary font-semibold text-sm hover:opacity-70 transition-opacity">View All</button>
</div>
<div className="grid grid-cols-4 gap-4">
<div className="aspect-square bg-surface-container-low rounded-lg flex items-center justify-center group">
<span className="material-symbols-outlined text-3xl text-primary-container group-hover:scale-110 transition-transform" data-weight="fill" style={{ fontVariationSettings: '"FILL" 1' }}>wb_sunny</span>
</div>
<div className="aspect-square bg-surface-container-low rounded-lg flex items-center justify-center group">
<span className="material-symbols-outlined text-3xl text-secondary group-hover:scale-110 transition-transform" data-weight="fill" style={{ fontVariationSettings: '"FILL" 1' }}>route</span>
</div>
<div className="aspect-square bg-surface-container-low rounded-lg flex items-center justify-center group">
<span className="material-symbols-outlined text-3xl text-tertiary group-hover:scale-110 transition-transform" data-weight="fill" style={{ fontVariationSettings: '"FILL" 1' }}>bolt</span>
</div>
<div className="aspect-square bg-surface-container-high/50 rounded-lg flex items-center justify-center border-2 border-dashed border-outline-variant/30">
<span className="material-symbols-outlined text-on-surface-variant/40">lock</span>
</div>
</div>
</section>

<section className="space-y-4">
<h3 className="font-headline text-xl font-bold">Friends Activity</h3>
<div className="space-y-3">
<div className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-lg">
<div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high flex-shrink-0">
<img className="w-full h-full object-cover" data-alt="Portrait of a smiling athletic man in outdoor setting, vibrant natural colors, professional lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_3Fn_FuDVKok-uVsEE3iFFR-Fw3h04jyFQSOxscBO9E_MY-if0F5TpBWWcshlVJpb12BQExnjZhzCb1uKnjtvVYn0Y-C2ganNPeIkx4s0OfVmRGxBXEZGeepQSRlA1Y41kmByN79dZFcT_-Wh4cFsRSffWqEVNwU4wwvav61mFfWNYow64CaYJbLekIvA2lgKj2NE74V5b2ZpDp2q6Ym4Dco3nfpyFU227jfQ8ojnF_nTJgXq7NUJeGfQuDumOkww2wrcZE1a7aY"/>
</div>
<div className="flex-grow">
<p className="font-bold">Marcus Chen</p>
<p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">5km Morning Run</p>
</div>
<div className="flex items-center gap-1 text-tertiary">
<span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>favorite</span>
<span className="text-sm font-bold">12</span>
</div>
</div>
<div className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-lg">
<div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high flex-shrink-0">
<img className="w-full h-full object-cover" data-alt="Candid lifestyle portrait of a young woman laughing, soft dusk lighting, premium aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvquJ5Snlnv4FXeE_PB1bKlx_4vpFF1eVATPdYHUeiu4zgZGCIpzV_C6UgIIdfJ03jBwEE2J6VDQlglwuWQBlYsZg58de1UJRBbPs_iTYf2NDoXNuPUkmOHC4y-_vYWNn8xQfMjM8EhDXUzS4f76C_-8dmxybeo33UQJaCWQWegJbuFSGbSB3POacoFoz9gAnQm0KI-WnRNTq7KroKe4WpXwGjMY9GqXGB8XTCXCgGKfcFrVBRfSYO9tATJDMVU3MhjJvGx1u7T34"/>
</div>
<div className="flex-grow">
<p className="font-bold">Sarah Jenkins</p>
<p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">New Badge: Early Bird</p>
</div>
<div className="flex items-center gap-1 text-tertiary">
<span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>favorite</span>
<span className="text-sm font-bold">8</span>
</div>
</div>
</div>
</section>

<div className="pb-8">
<button className="w-full py-4 bg-primary text-on-primary rounded-full font-bold shadow-lg shadow-on-surface/5 active:scale-[0.98] transition-transform">
                Find Friends
            </button>
</div>
</main>



    </>
  );
}
