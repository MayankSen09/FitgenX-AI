import { useState } from 'react';
import { ArrowLeft, Sparkles, Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface Coach {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  ratePerSession: number;
  monthlyRate: number;
  bio: string;
  avatar: string;
}

const coaches: Coach[] = [
  {
    id: 'coach-01',
    name: 'Marcus Vance',
    specialization: 'HIIT & Functional Strength',
    rating: 4.9,
    ratePerSession: 45,
    monthlyRate: 149,
    bio: 'Certified master of biomechanics and bodyweight functional performance.',
    avatar: '🧔',
  },
  {
    id: 'coach-02',
    name: 'Elena Rostova',
    specialization: 'Run Performance & Endurance',
    rating: 4.8,
    ratePerSession: 40,
    monthlyRate: 129,
    bio: 'Ex-triathlon runner specializing in low-impact technique refinement.',
    avatar: '👩‍🏫',
  },
];

export default function CoachMarketplace() {
  const navigate = useNavigate();
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);

  const handleBook = () => {
    alert(`Thank you for booking with ${selectedCoach?.name}! Platform fee of 20% applied. Your coach will get in touch shortly.`);
    setSelectedCoach(null);
  };

  return (
    <div className="bg-bg-primary min-h-screen text-white pb-24 flex flex-col items-stretch max-w-[430px] mx-auto select-none">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between border-b border-white/5 bg-zinc-950/40 backdrop-blur-xl fixed top-0 w-full max-w-[430px] z-[100]">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-all">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-black uppercase tracking-widest text-zinc-400">Coach Marketplace</h1>
        <div className="w-8" />
      </header>

      <main className="mt-24 px-6 flex-1 space-y-6 flex flex-col">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-1.5 leading-none">
            <Sparkles size={12} /> Personalized Coaching
          </span>
          <p className="text-xs font-semibold text-zinc-400">Level up your fitness with certified human experts.</p>
        </div>

        <div className="space-y-4">
          {coaches.map((coach) => (
            <div key={coach.id} className="p-5 bg-zinc-900/40 border border-white/5 rounded-3xl space-y-4 select-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5">
                    {coach.avatar}
                  </span>
                  <div>
                    <p className="text-sm font-black text-white leading-tight">{coach.name}</p>
                    <p className="text-[10px] font-semibold text-zinc-500 mt-0.5">{coach.specialization}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-black tracking-tight text-amber-400">{coach.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-white tracking-tight">${coach.ratePerSession} <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-widest">/hr</span></p>
                </div>
              </div>

              <p className="text-xs font-semibold text-zinc-300 leading-relaxed bg-zinc-900/40 p-3 rounded-2xl border border-white/5">
                {coach.bio}
              </p>

              <button
                onClick={() => setSelectedCoach(coach)}
                className="w-full py-3 bg-white text-zinc-950 font-black uppercase tracking-wider text-xs rounded-2xl hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
              >
                Book Session
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Confirmation modal overlay */}
      {selectedCoach && (
        <div className="fixed inset-0 z-[200] bg-zinc-950/90 backdrop-blur-xl flex flex-col justify-center items-center p-6 text-white">
          <div className="w-full max-w-sm bg-zinc-900/60 p-6 rounded-3xl border border-white/5 text-center space-y-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Session Reservation</p>
              <h3 className="text-lg font-black font-headline text-white mt-1">Confirm Session</h3>
            </div>
            <p className="text-xs font-semibold text-zinc-300 leading-relaxed">
              Confirm your video session with <strong>{selectedCoach.name}</strong> for ${selectedCoach.ratePerSession} (including 20% platform fee).
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleBook}
                className="w-full py-3.5 bg-primary text-zinc-950 font-black uppercase tracking-wider text-xs rounded-2xl hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Check size={16} />
                <span>Confirm Payment</span>
              </button>
              <button
                onClick={() => setSelectedCoach(null)}
                className="text-xs font-black uppercase tracking-wider text-zinc-500 hover:text-white transition-colors py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
