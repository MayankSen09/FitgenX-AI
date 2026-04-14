import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGeminiResponse } from '../services/aiService';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AIAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Based on your sleep quality last night (84%) and recovery score, today is an ideal day for a high-intensity threshold run. Should I update your targets?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

    // Format history for Gemini (Ensure it starts with 'user' role)
    let history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    if (history.length > 0 && history[0].role === 'model') {
      history = history.slice(1);
    }

    const response = await getGeminiResponse(messageText, history);
    
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* ─── Header ─── */}
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high transition-transform active:scale-95 cursor-pointer border-none p-0 outline-none"
          >
            <img
              alt="User Profile Avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNrzwzHCl7acrq1jEp7xQZwlilFbooGXO4CC3YRVZRFPz1v0D4KG_-8ndv8dN2ypKbj5mhkfHGtO5BlLA2X5rpMdcb3qL7CESHcXBohBwncJos50wqVNNSBTEWeBKZmFRA4SWpfd5ucTk0oCZtx3OGojJa2XsNre9yulpoe8fClnRiTE2saOMYFAtOOEK7r_CZrft8jiWolYdRjxkDCXnj9K-eKX5Bk7zTQwykX7s5AriWiRca8vwydKFaMDGPH6S2JRDT6kb_C2Q"
            />
          </button>
          <h1 className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 font-headline">
            Goals
          </h1>
        </div>
        <button className="material-symbols-outlined text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity active:scale-95 duration-200 p-2 bg-surface-container-low rounded-full">
          notifications
        </button>
      </header>

      {/* ─── Main Content ─── */}
      <main className="pt-24 pb-32 px-5 mx-auto space-y-6 overflow-x-hidden max-w-[430px]">

        {/* ─── Hero: Athlete Intelligence ─── */}
        <section className="relative overflow-hidden rounded-2xl p-6 vitality-gradient min-h-[180px] flex flex-col justify-end shadow-lg shadow-secondary/20">
          <div className="absolute top-0 right-0 p-6 opacity-20">
            <span className="material-symbols-outlined text-[100px]" data-icon="neurology">neurology</span>
          </div>
          <div className="relative z-10 space-y-2">
            <span className="font-label text-[0.6rem] uppercase tracking-widest font-bold text-white/80">
              Athlete Intelligence
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight font-headline">
              Peak Performance<br />Analysis.
            </h2>
          </div>
        </section>

        {/* ─── Athlete Intelligence Chat ─── */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold tracking-tight text-on-surface font-headline">AI Coach Chat</h2>
            <button className="text-secondary font-bold text-xs" onClick={() => setMessages([messages[0]])}>Clear History</button>
          </div>
          
          <div className="bg-surface-container rounded-2xl flex flex-col h-[400px]">
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-5 space-y-5 scroll-smooth no-scrollbar"
            >
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'max-w-[90%]'}`}
                  >
                    {msg.role === 'model' && (
                      <div className="w-8 h-8 rounded-full vitality-gradient flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-white text-xs" data-icon="smart_toy">smart_toy</span>
                      </div>
                    )}
                    <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white text-on-surface-variant rounded-tl-none'
                    }`}>
                      <p>{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 max-w-[90%]"
                  >
                    <div className="w-8 h-8 rounded-full vitality-gradient flex items-center justify-center flex-shrink-0 animate-pulse">
                      <span className="material-symbols-outlined text-white text-xs">smart_toy</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                       <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                       <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                       <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce"></span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && (
               <div className="flex flex-wrap gap-2 px-5 p-3 border-t border-outline-variant/5">
                {[ "Yes, update targets", "What's my HRV?", "Suggest a warm-up"].map(suggestion => (
                   <button 
                    key={suggestion}
                    onClick={() => handleSend(suggestion)}
                    className="bg-white/50 border border-outline-variant/10 px-3 py-2 rounded-full text-[10px] font-bold text-on-surface-variant hover:bg-secondary-container transition-colors active:scale-95"
                   >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 pt-2">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-white border-none rounded-full py-4 pl-6 pr-14 shadow-md focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-outline text-sm"
                  placeholder="Ask your coach anything..."
                  type="text"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center active:scale-90 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  <span className="material-symbols-outlined text-lg" data-icon="send">send</span>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ─── Recovery & Smart Insight (Compact) ─── */}
        <div className="grid grid-cols-2 gap-4">
           <section className="bg-surface-container-low rounded-2xl p-5 space-y-2">
              <span className="material-symbols-outlined text-secondary text-xl">vitals</span>
              <p className="text-[10px] uppercase tracking-widest font-bold text-outline">Recovery</p>
              <div className="text-3xl font-extrabold font-headline text-on-surface line-clamp-1">18<span className="text-xs ml-1">h</span></div>
           </section>
           <section className="bg-surface-container-low rounded-2xl p-5 space-y-2">
              <span className="material-symbols-outlined text-tertiary text-xl">bolt</span>
              <p className="text-[10px] uppercase tracking-widest font-bold text-outline">Efficiency</p>
              <div className="text-3xl font-extrabold font-headline text-on-surface">+12<span className="text-xs ml-1">%</span></div>
           </section>
        </div>

      </main>
    </>
  );
}
