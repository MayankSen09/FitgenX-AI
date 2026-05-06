import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGeminiResponse } from '../services/aiService';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { toast } from '../components/common/Toast';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const PAGE_VARIANTS = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "spring",
      damping: 25,
      stiffness: 200,
      staggerChildren: 0.05
    }
  },
  exit: { opacity: 0, scale: 1.02, y: -10, transition: { duration: 0.2 } }
};

export default function AIAssistant() {
  const navigate = useNavigate();
  const { profile } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'chat' | 'plan'>('chat');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile && messages.length === 0) {
      setMessages([
        { 
          role: 'model', 
          content: `Hello ${profile.name}! I'm ready to help you with your fitness journey. Would you like to chat about your progress, or should we create a new personalized plan?` 
        }
      ]);
    } else if (!profile && messages.length === 0) {
      setMessages([
        { role: 'model', content: "Hello! I'm your FitGenX AI Coach. Please complete your profile so I can create a personalized plan for you." }
      ]);
    }
  }, [profile, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: messageText }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    let history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    let contextPrompt = messageText;
    if (mode === 'plan') {
       contextPrompt = `GENERATE A STRUCTURED WORKOUT PLAN. User Profile: Name: ${profile?.name}, Age: ${profile?.age}, Goal: ${profile?.focus}, Level: ${profile?.level}, Activity: ${profile?.activityLevel}, Frequency: ${profile?.workoutFrequency}. \n\nUser Request: ${messageText}. Please provide a detailed week-by-week or day-by-day plan with exercises, sets, and reps. REMIND THE USER THAT THEY CAN MANUALLY EDIT THEIR WEEKLY SCHEDULE IN THE PLANNING SECTION.`;
    } else if (messages.length === 1 && profile) {
      contextPrompt = `User Profile: Name: ${profile.name}, Age: ${profile.age}, Gender: ${profile.gender}, Height: ${profile.height}cm, Weight: ${profile.weight}kg, Goal: ${profile.focus}, Level: ${profile.level}, Preferences: ${profile.preferences.join(', ')}, Activity: ${profile.activityLevel}, History: ${profile.fitnessHistory}, Frequency: ${profile.workoutFrequency} days/week, Medical: ${profile.medicalConditions}. \n\nUser Message: ${messageText}`;
    }

    try {
      const response = await getGeminiResponse(contextPrompt, history);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      toast.error("Signal lost. Re-establishing link...");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      variants={PAGE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-zinc-50/50 dark:bg-zinc-950 min-h-screen pb-40 overflow-x-hidden"
    >
      {/* Header Upgrade */}
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border-b border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="flex justify-between items-center px-8 py-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="w-11 h-11 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-transform active:scale-95"
            >
              <img
                alt="User Profile Avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNrzwzHCl7acrq1jEp7xQZwlilFbooGXO4CC3YRVZRFPz1v0D4KG_-8ndv8dN2ypKbj5mhkfHGtO5BlLA2X5rpMdcb3qL7CESHcXBohBwncJos50wqVNNSBTEWeBKZmFRA4SWpfd5ucTk0oCZtx3OGojJa2XsNre9yulpoe8fClnRiTE2saOMYFAtOOEK7r_CZrft8jiWolYdRjxkDCXnj9K-eKX5Bk7zTQwykX7s5AriWiRca8vwydKFaMDGPH6S2JRDT6kb_C2Q"
              />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white uppercase leading-none">Coach</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mt-1">AI Assistant</p>
            </div>
          </div>
          <button onClick={() => toast.info("No active alerts.")} className="w-11 h-11 flex items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-zinc-900 dark:text-white text-xl">notifications</span>
          </button>
        </div>

        {/* Tab Segmented Control */}
        <div className="flex mx-8 mb-5 p-1.5 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl">
          <button 
            onClick={() => setMode('chat')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${mode === 'chat' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400'}`}
          >
            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
            Assistant
          </button>
          <button 
            onClick={() => setMode('plan')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${mode === 'plan' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400'}`}
          >
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            Planning
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-[180px] px-6 max-w-[430px] mx-auto space-y-8">
        
        {/* Banner Card */}
        <section className="relative overflow-hidden rounded-[2.5rem] p-8 bg-zinc-900 text-white shadow-2xl shadow-zinc-900/20 group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <span className="material-symbols-outlined text-[120px]">neurology</span>
          </div>
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/80">Biological Intelligence</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter leading-tight font-display">
              Peak Performance<br />Analysis.
            </h2>
          </div>
        </section>

        {/* Chat Interface */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Neural Link Chat</h2>
            <button 
              onClick={() => { setMessages([messages[0]]); toast.info("History purged."); }}
              className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 uppercase tracking-widest transition-colors"
            >
              Clear History
            </button>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 flex flex-col shadow-sm overflow-hidden h-[450px]">
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-6 space-y-6 scroll-smooth no-scrollbar"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {msg.role === 'model' && (
                      <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="material-symbols-outlined text-white dark:text-zinc-900 text-lg">smart_toy</span>
                      </div>
                    )}
                    <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-sm font-medium leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-zinc-900 text-white rounded-tr-none' 
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-tl-none border border-zinc-100 dark:border-zinc-800'
                    }`}>
                      <p>{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center flex-shrink-0 animate-pulse shadow-lg">
                      <span className="material-symbols-outlined text-white dark:text-zinc-900 text-lg">smart_toy</span>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-[1.5rem] rounded-tl-none border border-zinc-100 dark:border-zinc-800 flex gap-1.5 items-center">
                       <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                       <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                       <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {(mode === 'chat' 
                    ? ["What's my HRV?", "Suggest warm-up", "Recovery status"] 
                    : ["4-week strength", "HIIT routine", "Mobility plan"]
                  ).map(suggestion => (
                    <button 
                      key={suggestion}
                      onClick={() => handleSend(suggestion)}
                      className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 px-4 py-2 rounded-full text-[10px] font-bold text-zinc-500 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all active:scale-95 shadow-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-800 border-none rounded-2xl py-4 pl-6 pr-14 shadow-sm focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/5 transition-all placeholder:text-zinc-400 text-sm font-medium"
                  placeholder={mode === 'chat' ? "Consult your coach..." : "Define your objectives..."}
                  type="text"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl flex items-center justify-center active:scale-90 transition-all disabled:opacity-30 shadow-lg"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4 pb-10">
          <button onClick={() => navigate('/planning')} className="col-span-2 p-5 bg-zinc-900 dark:bg-white rounded-[2rem] flex items-center justify-between group active:scale-[0.98] transition-all shadow-xl shadow-zinc-900/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 dark:bg-zinc-900/10 flex items-center justify-center text-white dark:text-zinc-900">
                <span className="material-symbols-outlined">edit_calendar</span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 dark:text-zinc-400">Weekly Schedule</p>
                <p className="text-sm font-bold text-white dark:text-zinc-900">Manage Training Plan</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-white/30 dark:text-zinc-300 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>

          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-2">
            <span className="material-symbols-outlined text-zinc-400 text-xl">vitals</span>
            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-400">Recovery</p>
            <div className="text-3xl font-bold font-display text-zinc-900 dark:text-white">18<span className="text-xs ml-1 opacity-40">h</span></div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-2">
            <span className="material-symbols-outlined text-zinc-400 text-xl">bolt</span>
            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-400">Efficiency</p>
            <div className="text-3xl font-bold font-display text-zinc-900 dark:text-white">+12<span className="text-xs ml-1 opacity-40">%</span></div>
          </div>
        </div>

      </main>
    </motion.div>
  );
}
