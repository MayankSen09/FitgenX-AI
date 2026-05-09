import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocialStore, type SocialUser } from '../stores/socialStore';
import { useAppStore } from '../store/useAppStore';
import { StoryViewer, type Story } from '../components/StoryViewer';
import { toast } from '../components/common/Toast';

type Tab = 'feed' | 'friends' | 'leaderboard';

function LiveDot() {
  return (
    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900 animate-pulse shadow-[0_0_8px_rgb(16,185,129)]" />
  );
}

function SearchBar({ value, onChange, placeholder, inputRef }: { value: string; onChange: (v: string) => void; placeholder: string; inputRef?: React.RefObject<HTMLInputElement | null> }) {
  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xl">search</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-medium text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all shadow-sm"
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-4 top-1/2 -translate-y-1/2">
          <span className="material-symbols-outlined text-zinc-400 text-lg">close</span>
        </button>
      )}
    </div>
  );
}

function UserCard({ user, onFollow, onUnfollow, onChallenge }: {
  user: SocialUser;
  onFollow: () => void;
  onUnfollow: () => void;
  onChallenge?: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm"
    >
      <div className="relative flex-shrink-0">
        <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover border-2 border-zinc-50 dark:border-zinc-800" />
        {user.isOnline && <LiveDot />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 truncate">{user.name}</h3>
          {user.badges.slice(0, 2).map((b, i) => (
            <span key={i} className="material-symbols-outlined text-[12px] text-zinc-400" style={{ fontVariationSettings: '"FILL" 1' }}>{b}</span>
          ))}
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-0.5">{user.role}</p>
        {user.currentActivity && user.isOnline && (
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 truncate flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">sprint</span>
            {user.currentActivity}
          </p>
        )}
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xs font-bold text-zinc-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-orange-500" style={{ fontVariationSettings: '"FILL" 1' }}>local_fire_department</span>
            {user.streak} days
          </span>
          <span className="text-[10px] text-zinc-400 font-medium">{user.totalWorkouts} workouts</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
        {user.isFollowing ? (
          <button onClick={onUnfollow} className="px-4 py-1.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 active:scale-95 transition-all">
            Following
          </button>
        ) : (
          <button onClick={onFollow} className="px-4 py-1.5 rounded-full text-[10px] font-bold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 active:scale-95 transition-all">
            Follow
          </button>
        )}
        {user.isFollowing && onChallenge && (
          <button onClick={onChallenge} className="px-4 py-1.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 active:scale-95 transition-all flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[14px]">swords</span>
            Battle
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ════════════ PAGE TRANSITION CONFIG ════════════ */
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

const ITEM_VARIANTS = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
};

function ComposePost() {
  const [text, setText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [attachedStat, setAttachedStat] = useState<{label: string, value: string, unit: string} | null>(null);
  const addPost = useSocialStore(state => state.addPost);

  const handlePost = () => {
    if (!text.trim()) return;
    setIsPosting(true);
    setTimeout(() => {
      addPost({
        authorId: 'me',
        authorName: 'Alex Rivera',
        authorRole: 'Level 14 Athlete',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTOQhgJZLgA3tmXjEVMPI3shCqR2vGzHAryFHKeJBhbxFszS5n0fK6cjvg9j1O-bQkuliaZjLVFBVHcTvw7x2B70sa2PRi9WiqQyGfVwkzAkixr4gTTdHsz_8pX0im7Xy248KqFSZZs2Rx9EKnNg_g4Xjm2h0Zb645LyDcYTPQgKZ-zmlWQga8nkwQ2J9yzaztLl-aGpS_d6rtymvxu8Z4Sz4Zli6kD58d56RPqb6bgzoYthibbfBLsf57UTW4-iAVRqwVnH85TiY',
        content: text,
        time: 'Just now',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDfaLcIlnUV-J97K4IIcFtuCM4lf2Ov4A_qbN8OnJFiya1DJ912PsaLIjwT7dW4-od2Exb1AaGEyGDNaGAA-kB7-JVDXyuuLy_e1QUr2UhUNOZ8I1sMboJ2dyqBBgeZ-PHFH7vpZyTu1ICZaeLVDg1j6mQ0hxLrmcn-e_O84TLGzOalOEiQavriZ0ZYM8LdZYILHqNU9hgEdJN-ZwKGE_IdW9xDinqO8BHSqIiLFEaaDxK1V8f3OS9MN5ekBN0n9tISbQnq4KxH6Y',
        metrics: attachedStat ? [attachedStat] : undefined
      });
      setText('');
      setAttachedStat(null);
      setIsPosting(false);
      toast.success("Broadcast successful!");
    }, 1200);
  };

  const SUGGESTED_STATS = [
    { label: 'Distance', value: '5.2', unit: 'km', icon: 'directions_run' },
    { label: 'Volume', value: '8,400', unit: 'kg', icon: 'fitness_center' },
    { label: 'Intensity', value: '94', unit: '%', icon: 'bolt' },
  ];

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
      <div className="flex gap-4">
        <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTOQhgJZLgA3tmXjEVMPI3shCqR2vGzHAryFHKeJBhbxFszS5n0fK6cjvg9j1O-bQkuliaZjLVFBVHcTvw7x2B70sa2PRi9WiqQyGfVwkzAkixr4gTTdHsz_8pX0im7Xy248KqFSZZs2Rx9EKnNg_g4Xjm2h0Zb645LyDcYTPQgKZ-zmlWQga8nkwQ2J9yzaztLl-aGpS_d6rtymvxu8Z4Sz4Zli6kD58d56RPqb6bgzoYthibbfBLsf57UTW4-iAVRqwVnH85TiY" className="w-full h-full object-cover" alt="Me" />
        </div>
        <div className="flex-grow">
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your breakthrough..."
            className="w-full bg-transparent border-none resize-none font-medium placeholder:text-zinc-400 focus:ring-0 min-h-[50px] text-sm text-zinc-900 dark:text-zinc-50"
          />
          
          {attachedStat && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-1.5 rounded-xl mb-3 shadow-lg shadow-zinc-900/10"
            >
              <span className="text-[10px] font-bold uppercase tracking-tighter">{attachedStat.label}: {attachedStat.value}{attachedStat.unit}</span>
              <button onClick={() => setAttachedStat(null)} className="material-symbols-outlined text-[14px]">close</button>
            </motion.div>
          )}

          <div className="flex justify-between items-center mt-2 pt-4 border-t border-zinc-50 dark:border-zinc-800/50">
            <div className="flex gap-2">
              {SUGGESTED_STATS.map((stat, i) => (
                <button
                  key={i}
                  onClick={() => setAttachedStat(stat)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${attachedStat?.label === stat.label ? 'bg-zinc-900 text-white' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                >
                  <span className="material-symbols-outlined text-lg">{stat.icon}</span>
                </button>
              ))}
            </div>
            <button 
              onClick={handlePost}
              disabled={isPosting || !text.trim()}
              className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-2 rounded-full font-bold text-xs active:scale-95 transition-all disabled:opacity-30 shadow-md"
            >
              {isPosting ? 'Architecting...' : 'Broadcast'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PostCard({ post }: { post: any }) {
  const toggleLikePost = useSocialStore(state => state.toggleLikePost);

  return (
    <motion.article 
      variants={ITEM_VARIANTS}
      className="bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-800 group"
    >
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden p-0.5 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <img className="w-full h-full object-cover rounded-full" src={post.authorAvatar} alt={post.authorName} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">{post.authorName}</h3>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{post.authorRole} • {post.time}</p>
          </div>
        </div>
        <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
          <span className="material-symbols-outlined text-zinc-300">more_horiz</span>
        </button>
      </div>

      <div className="px-6 mb-4">
        <p className="text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-300">{post.content}</p>
      </div>

      {post.image && (
        <div className="relative aspect-[4/5] w-full px-4 pb-4">
          <img className="w-full h-full object-cover rounded-[1.5rem] shadow-sm transition-transform duration-700 group-hover:scale-[1.01]" src={post.image} alt="Workout Post" />
          
          {post.metrics && (
            <div className="absolute top-8 left-8 flex flex-col gap-2">
              {post.metrics.map((m: any, i: number) => (
                <motion.div 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  key={i} 
                  className="bg-white/10 backdrop-blur-2xl border border-white/20 px-3 py-2 rounded-xl shadow-xl"
                >
                  <p className="text-[8px] uppercase font-bold tracking-widest text-white/60 mb-0.5">{m.label}</p>
                  <p className="text-white font-bold text-lg leading-tight">{m.value}<span className="text-[9px] ml-0.5 font-bold opacity-60 uppercase">{m.unit}</span></p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="p-6 border-t border-zinc-50 dark:border-zinc-800/50">
        <div className="flex items-center justify-between">
          <div className="flex gap-8">
            <button onClick={() => toggleLikePost(post.id)} className="flex items-center gap-2 group/btn transition-all active:scale-125">
              <span className={`material-symbols-outlined text-2xl transition-all ${post.isLiked ? 'text-red-500 scale-110' : 'text-zinc-400 group-hover/btn:text-red-500'}`} style={{ fontVariationSettings: post.isLiked ? '"FILL" 1' : '"FILL" 0' }}>favorite</span>
              <span className="text-xs font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">{post.likes}</span>
            </button>
            <button onClick={() => toast.info("Opening comments...")} className="flex items-center gap-2 group/btn">
              <span className="material-symbols-outlined text-2xl text-zinc-400 group-hover/btn:text-zinc-900 dark:group-hover/btn:text-zinc-100 transition-colors">chat_bubble</span>
              <span className="text-xs font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">{post.comments}</span>
            </button>
            <button onClick={() => toast.info("Sharing options...")} className="flex items-center gap-2 group/btn">
              <span className="material-symbols-outlined text-2xl text-zinc-400 group-hover/btn:text-zinc-900 dark:group-hover/btn:text-zinc-100 transition-colors">share</span>
            </button>
          </div>
          <button onClick={() => toast.success("Saved to profile!")} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all active:scale-110">
            <span className="material-symbols-outlined text-2xl">bookmark</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* ════════════ FEED TAB ════════════ */
function FeedTab({ onOpenStories, searchInputRef }: { onOpenStories: (idx: number) => void, searchInputRef: React.RefObject<HTMLInputElement | null> }) {
  const { allUsers, followUser, unfollowUser, searchQuery, setSearchQuery, getFilteredUsers, posts } = useSocialStore();
  const liveUsers = allUsers.filter(u => u.isOnline && u.currentActivity);
  const searchResults = getFilteredUsers();
  const showSearch = searchQuery.trim().length > 0;

  return (
    <div className="space-y-6 pb-20">
      <SearchBar inputRef={searchInputRef} value={searchQuery} onChange={setSearchQuery} placeholder="Search athletes..." />

      {showSearch ? (
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Results</h2>
          <div className="space-y-3">
            {searchResults.map(user => (
              <UserCard key={user.id} user={user} onFollow={() => followUser(user.id)} onUnfollow={() => unfollowUser(user.id)} />
            ))}
          </div>
        </section>
      ) : (
        <>
          <ComposePost />

          {/* Stories Bar */}
          <section className="flex gap-4 overflow-x-auto no-scrollbar py-2 -mx-2 px-2">
            <button onClick={() => toast.info("Story creation opening...")} className="flex flex-col items-center gap-2 flex-shrink-0 group">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-1 flex items-center justify-center group-active:scale-90 transition-transform">
                <div className="w-full h-full rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-zinc-400">add</span>
                </div>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Your Story</span>
            </button>
            {allUsers.map((user, i) => (
              <button key={user.id} onClick={() => onOpenStories(i)} className="flex flex-col items-center gap-2 flex-shrink-0 group active:scale-90 transition-transform">
                <div className="w-16 h-16 rounded-full p-[2px] border-2 border-zinc-900 dark:border-zinc-100 shadow-md">
                  <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">{user.name.split(' ')[0]}</span>
              </button>
            ))}
          </section>

          {/* Live Now */}
          {liveUsers.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgb(16,185,129)]" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Training Now</h2>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {liveUsers.map(user => (
                  <div key={user.id} className="flex-shrink-0 w-36 p-5 bg-zinc-900 dark:bg-white rounded-[2rem] text-center shadow-md border border-white/5 dark:border-zinc-100">
                    <div className="relative inline-block mb-3">
                      <img src={user.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-lg shadow-emerald-500/20" alt="" />
                      <LiveDot />
                    </div>
                    <p className="text-xs font-bold text-white dark:text-zinc-900 truncate">{user.name.split(' ')[0]}</p>
                    <p className="text-[9px] text-emerald-400 dark:text-emerald-600 font-bold mt-1 uppercase tracking-tighter">{user.currentActivity}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Feed */}
          <div className="space-y-6">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ════════════ FRIENDS TAB ════════════ */
function FriendsTab({ searchInputRef }: { searchInputRef: React.RefObject<HTMLInputElement | null> }) {
  const { allUsers, searchQuery, setSearchQuery, followUser, unfollowUser, challengeUser, getFilteredUsers } = useSocialStore();
  const [challengeModal, setChallengeModal] = useState<string | null>(null);
  const following = allUsers.filter(u => u.isFollowing);
  const searchResults = getFilteredUsers();
  const showSearch = searchQuery.trim().length > 0;

  return (
    <div className="space-y-6">
      <SearchBar inputRef={searchInputRef} value={searchQuery} onChange={setSearchQuery} placeholder="Find athletes..." />

      {showSearch ? (
        <section>
          <div className="space-y-3">
            {searchResults.map(user => (
              <UserCard key={user.id} user={user} onFollow={() => followUser(user.id)} onUnfollow={() => unfollowUser(user.id)} onChallenge={() => setChallengeModal(user.id)} />
            ))}
          </div>
        </section>
      ) : (
        <>
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Your Network · {following.length}</h2>
            {following.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <span className="material-symbols-outlined text-5xl text-zinc-100 dark:text-zinc-800 mb-4 block">group_add</span>
                <p className="text-sm text-zinc-900 dark:text-zinc-50 font-bold">No athletes in your network</p>
                <p className="text-xs text-zinc-400 mt-2">Discover elite athletes below</p>
              </div>
            ) : (
              <div className="space-y-3">
                {following.map(user => (
                  <UserCard key={user.id} user={user} onFollow={() => followUser(user.id)} onUnfollow={() => unfollowUser(user.id)} onChallenge={() => setChallengeModal(user.id)} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Global Suggestions</h2>
            <div className="space-y-3">
              {allUsers.filter(u => !u.isFollowing).map(user => (
                <UserCard key={user.id} user={user} onFollow={() => followUser(user.id)} onUnfollow={() => unfollowUser(user.id)} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Challenge Modal */}
      <AnimatePresence>
        {challengeModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-md flex items-end justify-center px-4 pb-6"
            onClick={() => setChallengeModal(null)}
          >
            <motion.div
              initial={{ y: 200, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 200, scale: 0.95 }}
              className="w-full max-w-[400px] bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 shadow-lg">
                   <span className="material-symbols-outlined text-xl">swords</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Streak Battle</h3>
              </div>
              <p className="text-xs text-zinc-500 mb-8 leading-relaxed font-medium">Declare a battle. The first person to break their streak loses. Winner gains 500 XP.</p>
              
              <div className="space-y-2">
                {[7, 14, 30].map(days => (
                  <button
                    key={days}
                    onClick={() => { challengeUser(challengeModal, days); setChallengeModal(null); toast.success(`Challenge sent for ${days} days!`); }}
                    className="w-full py-4 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-2xl text-xs font-bold transition-all border border-zinc-100 dark:border-zinc-800 flex items-center justify-between px-6 group"
                  >
                    <span className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-orange-500" style={{ fontVariationSettings: '"FILL" 1' }}>local_fire_department</span>
                      {days}-Day Siege
                    </span>
                    <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity text-sm">arrow_forward</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setChallengeModal(null)} className="w-full py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Cancel Mission</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════ LEADERBOARD TAB ════════════ */
function LeaderboardTab() {
  const myStreak = useAppStore(s => s.getStreak)();
  const { getLeaderboard, challenges } = useSocialStore();
  const board = getLeaderboard(myStreak);
  const activeChallenges = challenges.filter(c => c.status === 'active');

  const rankIcon = (i: number) => {
    if (i === 0) return <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shadow-sm"><span className="material-symbols-outlined text-amber-600 text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>military_tech</span></div>;
    if (i === 1) return <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shadow-sm"><span className="material-symbols-outlined text-zinc-500 text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>military_tech</span></div>;
    if (i === 2) return <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shadow-sm"><span className="material-symbols-outlined text-orange-700 text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>military_tech</span></div>;
    return <span className="text-sm font-bold text-zinc-200 dark:text-zinc-700 w-10 text-center">{i + 1}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Active Battles */}
      {activeChallenges.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-zinc-400 text-lg">swords</span>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Ongoing Hostilities</h2>
          </div>
          <div className="space-y-3">
            {activeChallenges.map(c => {
              const daysElapsed = Math.floor((Date.now() - new Date(c.startDate).getTime()) / 86400000);
              const remaining = c.targetDays - daysElapsed;
              return (
                <div key={c.id} className="p-5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-[2rem] shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <span className="material-symbols-outlined text-5xl">swords</span>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <img src={c.challengerAvatar} className="w-12 h-12 rounded-xl object-cover border border-white/20 shadow-sm" alt="" />
                    <div className="flex-1">
                      <p className="text-sm font-bold">vs {c.challengerName}</p>
                      <p className="text-[9px] text-white/50 dark:text-zinc-400 font-bold uppercase tracking-widest">{remaining > 0 ? `${remaining} days left` : 'Final Day'}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mb-3 px-1">
                    <div className="text-center">
                      <p className="text-xl font-bold">{myStreak}</p>
                      <p className="text-[8px] text-white/40 dark:text-zinc-400 uppercase font-bold tracking-widest">You</p>
                    </div>
                    <div className="pb-1 text-white/20">
                      <span className="material-symbols-outlined text-lg">swords</span>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold">{c.challengerStreak}</p>
                      <p className="text-[8px] text-white/40 dark:text-zinc-400 uppercase font-bold tracking-widest">Them</p>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 dark:bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-white dark:bg-zinc-900 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (daysElapsed / c.targetDays) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Leaderboard */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">World Rankings</h2>
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-xs text-orange-500" style={{ fontVariationSettings: '"FILL" 1' }}>local_fire_department</span>
            <span className="text-[10px] font-bold uppercase text-zinc-500">Global</span>
          </div>
        </div>
        <div className="space-y-2">
          {board.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-[1.5rem] transition-all ${
                entry.isYou
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md scale-[1.01] z-10'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-50 dark:border-zinc-800'
              }`}
            >
              {rankIcon(i)}
              <img src={entry.avatar} className="w-11 h-11 rounded-xl object-cover flex-shrink-0 shadow-sm" alt="" />
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-bold truncate block ${entry.isYou ? '' : 'text-zinc-900 dark:text-zinc-50'}`}>
                  {entry.isYou ? 'You' : entry.name}
                </span>
                <div className="flex items-center gap-1.5 mt-1 opacity-50">
                  {entry.badges.map((b, j) => <span key={j} className="material-symbols-outlined text-[10px]">{b}</span>)}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-orange-500" style={{ fontVariationSettings: '"FILL" 1' }}>local_fire_department</span>
                  <span className={`text-xl font-bold tracking-tight ${entry.isYou ? '' : 'text-zinc-900 dark:text-zinc-50'}`}>{entry.streak}</span>
                </div>
                <p className={`text-[7px] font-bold uppercase tracking-widest opacity-40`}>Streak</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ════════════ TAB CONFIG ════════════ */
const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'feed', label: 'Feed', icon: 'dynamic_feed' },
  { key: 'friends', label: 'Friends', icon: 'group' },
  { key: 'leaderboard', label: 'Ranks', icon: 'leaderboard' },
];

/* ════════════ MAIN COMPONENT ════════════ */
export default function SocialFeeds() {
  const { activeTab, setActiveTab, allUsers } = useSocialStore();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const mockStories: Story[] = allUsers.map(user => ({
    id: user.id,
    username: user.name,
    avatarUrl: user.avatar,
    segments: [
      { id: `${user.id}-1`, imageUrl: user.avatar, duration: 5 },
      { id: `${user.id}-2`, imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkms0GqjrjNE46Zp_5Iy_n6L23EleWwbTuA9wKtxNZk6t7Yfjpev0nQbKOm5ius8FAkdwielryAjCvDEWtt0IPyWYGlqWjAw2Ncgt0x-rytBisWqTWbFWbCVMuCyu21b1BY5xwS71PLCto-ZLI1pY4XCoj0oywGOmQ_YNi6VXeZtmiHB-DtvI4dmnSDhNWg9ZkIs9wJ_1SdWnuNPOrWSdOcKxT3YzcTdJY82no-DitZGAXkhwT8KBWLfFmL-cCYMTfqZsoadrd-6k", duration: 5 }
    ]
  }));

  const handleOpenSearch = () => {
    setActiveTab('feed');
    setTimeout(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleNotifications = () => {
    toast.info("No new alerts. Your network is quiet.");
  };

  return (
    <motion.div 
      variants={PAGE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-zinc-50/50 dark:bg-zinc-950 min-h-screen pb-40 overflow-x-hidden"
    >
      {/* Header */}
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border-b border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="flex justify-between items-center px-8 py-5">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white uppercase leading-none">Network</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mt-1">Activity Hub</p>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={handleOpenSearch} className="w-11 h-11 flex items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-zinc-900 dark:text-white text-xl">search</span>
            </button>
            <button onClick={handleNotifications} className="w-11 h-11 flex items-center justify-center rounded-xl bg-zinc-900 dark:bg-white active:scale-90 transition-transform shadow-md">
              <span className="material-symbols-outlined text-white dark:text-zinc-900 text-xl">notifications</span>
            </button>
          </div>
        </div>
        
        {/* Tab Segmented Control */}
        <div className="flex mx-8 mb-5 p-1.5 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm scale-100'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              <span className={activeTab === tab.key ? 'block' : 'hidden'}>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="pt-[180px] px-6 max-w-[430px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, type: "spring", damping: 20 }}
          >
            {activeTab === 'feed' && <FeedTab searchInputRef={searchInputRef} onOpenStories={setActiveStoryIndex} />}
            {activeTab === 'friends' && <FriendsTab searchInputRef={searchInputRef} />}
            {activeTab === 'leaderboard' && <LeaderboardTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {activeStoryIndex !== null && (
          <StoryViewer 
            stories={mockStories} 
            initialIndex={activeStoryIndex} 
            onClose={() => setActiveStoryIndex(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
