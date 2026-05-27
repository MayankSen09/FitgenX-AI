import { useState } from 'react';
import { useBuddyStore, BuddyProfile } from '../stores/buddyStore';
import { ArrowLeft, UserPlus, Send, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sampleBuddies: BuddyProfile[] = [
  {
    userId: 'user-001',
    name: 'Sarah Chen',
    avatar: '👩‍🎤',
    timezone: 'UTC+5:30',
    workoutDays: [1, 3, 5],
    primaryGoal: 'Strength Building',
    matchScore: 94,
    lastActive: '10 minutes ago',
  },
  {
    userId: 'user-002',
    name: 'Michael Torres',
    avatar: '👨‍🚀',
    timezone: 'UTC+5:30',
    workoutDays: [2, 4, 6],
    primaryGoal: 'Cardio endurance',
    matchScore: 88,
    lastActive: '1 hour ago',
  },
  {
    userId: 'user-003',
    name: 'David Kim',
    avatar: '👨‍🎨',
    timezone: 'UTC+5:30',
    workoutDays: [1, 2, 3, 4, 5],
    primaryGoal: 'General Vitality & Fat Loss',
    matchScore: 85,
    lastActive: '4 hours ago',
  }
];

export default function BuddyMatch() {
  const navigate = useNavigate();
  const { myBuddy, messages, setBuddy, sendMessage } = useBuddyStore();
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(text);
      setText('');
    }
  };

  return (
    <div className="bg-bg-primary min-h-screen text-white pb-24 flex flex-col items-stretch max-w-[430px] mx-auto select-none">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between border-b border-white/5 bg-zinc-950/40 backdrop-blur-xl fixed top-0 w-full max-w-[430px] z-[100]">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-all">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-black uppercase tracking-widest text-zinc-400">Accountability Partner</h1>
        <div className="w-8" />
      </header>

      {/* Main Content Area */}
      <main className="mt-24 px-6 flex-1 flex flex-col">
        {!myBuddy ? (
          <div className="flex flex-col flex-1 space-y-6 py-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-1.5">
                <Sparkles size={12} /> Partner matching
              </span>
              <h2 className="text-xl font-black font-headline tracking-tight">Suggested Buddies</h2>
              <p className="text-xs font-semibold text-zinc-400">Match with a buddy with similar goals to build long-term consistency.</p>
            </div>

            <div className="space-y-3">
              {sampleBuddies.map((buddy) => (
                <div key={buddy.userId} className="p-4 bg-zinc-900/40 border border-white/5 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5">{buddy.avatar}</span>
                    <div>
                      <p className="text-xs font-black text-zinc-100">{buddy.name}</p>
                      <p className="text-[10px] font-semibold text-zinc-500 mt-0.5">{buddy.primaryGoal}</p>
                      <p className="text-[9px] font-black uppercase tracking-wider text-primary mt-1">{buddy.matchScore}% Match Score</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setBuddy(buddy)}
                    className="p-3 bg-primary hover:bg-primary/90 text-zinc-950 rounded-2xl active:scale-95 transition-all"
                  >
                    <UserPlus size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 space-y-6 py-4">
            {/* Active Buddy Card */}
            <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center">{myBuddy.avatar}</span>
                <div>
                  <p className="text-xs font-black text-zinc-100">{myBuddy.name}</p>
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">Matched Partner</p>
                  <p className="text-[10px] font-semibold text-zinc-500 mt-0.5">Last active {myBuddy.lastActive}</p>
                </div>
              </div>
              <button
                onClick={() => setBuddy(null)}
                className="text-[10px] font-black uppercase tracking-wider bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-3 py-2 rounded-xl border border-rose-500/10 active:scale-95 transition-all"
              >
                Unmatch
              </button>
            </div>

            {/* Chat Thread */}
            <div className="flex flex-col flex-1 bg-zinc-900/20 border border-white/5 rounded-3xl p-4 max-h-[360px] overflow-y-auto space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-zinc-500 my-auto text-xs font-semibold py-8">
                  No messages yet. Send a quick nudge to your buddy!
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] space-y-1 ${
                      msg.senderId === 'me' ? 'self-end items-end' : 'self-start items-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed ${
                        msg.senderId === 'me'
                          ? 'bg-primary text-zinc-950 font-bold rounded-tr-none'
                          : 'bg-white/5 text-zinc-100 rounded-tl-none border border-white/5'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat controls */}
            <div className="flex items-center gap-2 bg-zinc-900/40 border border-white/5 rounded-2xl p-2">
              <input
                type="text"
                maxLength={160}
                placeholder="Message buddy (max 160 chars)..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent px-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
              />
              <button
                onClick={handleSend}
                className="p-3 bg-white text-zinc-950 rounded-xl hover:bg-white/90 active:scale-95 transition-all"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
