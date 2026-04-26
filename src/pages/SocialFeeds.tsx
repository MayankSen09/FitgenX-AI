import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoryViewer, type Story } from '../components/StoryViewer';

interface Post {
  id: number;
  author: string;
  role: string;
  authorImg: string;
  time: string;
  content: string;
  image: string;
  metrics?: { label: string; value: string; unit: string }[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isFollowing: boolean;
}

const STORIES_DATA: Story[] = [
  {
    id: 'my-story',
    username: 'My Story',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTOQhgJZLgA3tmXjEVMPI3shCqR2vGzHAryFHKeJBhbxFszS5n0fK6cjvg9j1O-bQkuliaZjLVFBVHcTvw7x2B70sa2PRi9WiqQyGfVwkzAkixr4gTTdHsz_8pX0im7Xy248KqFSZZs2Rx9EKnNg_g4Xjm2h0Zb645LyDcYTPQgKZ-zmlWQga8nkwQ2J9yzaztLl-aGpS_d6rtymvxu8Z4Sz4Zli6kD58d56RPqb6bgzoYthibbfBLsf57UTW4-iAVRqwVnH85TiY',
    segments: [
      { id: 'seg1', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDfaLcIlnUV-J97K4IIcFtuCM4lf2Ov4A_qbN8OnJFiya1DJ912PsaLIjwT7dW4-od2Exb1AaGEyGDNaGAA-kB7-JVDXyuuLy_e1QUr2UhUNOZ8I1sMboJ2dyqBBgeZ-PHFH7vpZyTu1ICZaeLVDg1j6mQ0hxLrmcn-e_O84TLGzOalOEiQavriZ0ZYM8LdZYILHqNU9hgEdJN-ZwKGE_IdW9xDinqO8BHSqIiLFEaaDxK1V8f3OS9MN5ekBN0n9tISbQnq4KxH6Y', duration: 5 },
      { id: 'seg2', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWqfXUEv-8txuPw1P8JVLuGS2f7A71ZpMoZziwDH-9fbyrISbSyrvhGF1rwKD5QEnPaxo86LOClqIPaIxzsuLpntHymj0DrFjpapP9oQYZVc23_KjsGThf76CdVQ7y09rk0m1JTHcOzZOoZPus0wsNVcTaW9kRLFmtsJql_FPNv9qzEA-D4mAIxZOrqot0zwBFUaabuD92Gyp8KM0aougO4zot0V6qD3uW8IUcnUHWWjFSdDWgLnUNBVBk44-vAmEMQh5iBnIZppk', duration: 5 }
    ]
  },
  {
    id: 'marcus',
    username: 'Marcus',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkms0GqjrjNE46Zp_5Iy_n6L23EleWwbTuA9wKtxNZk6t7Yfjpev0nQbKOm5ius8FAkdwielryAjCvDEWtt0IPyWYGlqWjAw2Ncgt0x-rytBisWqTWbFWbCVMuCyu21b1BY5xwS71PLCto-ZLI1pY4XCoj0oywGOmQ_YNi6VXeZtmiHB-DtvI4dmnSDhNWg9ZkIs9wJ_1SdWnuNPOrWSdOcKxT3YzcTdJY82no-DitZGAXkhwT8KBWLfFmL-cCYMTfqZsoadrd-6k',
    segments: [
      { id: 'seg1', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAw8L7Ul5ZjALbPudX5LZuhj2wx-f5_bzl2rW3a8doCY1p2kI_19DPq7kr8hbN3mOdan506q5BOvVBoeSr603c3cST7teQxTK4ol0JLPbqr9jo5zmBJOCqAwHAxRoXzWDDL9esM_688ih4FO1pNyR6iZJWNxXFMrir5AMBEPYVvBIus5mVKpOgFlMdlhYu2BbGTv464Wk6cUt4J48WMJH6CR2xXP63_H1rY9WPLz2fk7aG9j08d7DB32pf6bNtEl3SyrJPC4RZT6aQ', duration: 4 },
      { id: 'seg2', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtH2-s_CP-vB1FPXqMtrWRKOAuzLe47iWhekpdefJUqgVpoTjlbmjVvUZPrteEWEr9lWUl7-AfGD-QmTPxB_yVOI22wpWdkdOaj_25CXgs_B2siuoku21zBWmCI48Mo00v_Xz_J5vyCN9Ej7Gs6TEBSp03EuzabBvy4-AuEUVRaHI8lTGry9PAAxh7vovjVtrtqZiZ8B7Hk1l37jhKeS3RcVuVPzBWcUVLW81p22JxIdjv7wlIqaa2ZdE4XpXmMsiX-iKR92dz9zA', duration: 5 },
      { id: 'seg3', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtH2-s_CP-vB1FPXqMtrWRKOAuzLe47iWhekpdefJUqgVpoTjlbmjVvUZPrteEWEr9lWUl7-AfGD-QmTPxB_yVOI22wpWdkdOaj_25CXgs_B2siuoku21zBWmCI48Mo00v_Xz_J5vyCN9Ej7Gs6TEBSp03EuzabBvy4-AuEUVRaHI8lTGry9PAAxh7vovjVtrtqZiZ8B7Hk1l37jhKeS3RcVuVPzBWcUVLW81p22JxIdjv7wlIqaa2ZdE4XpXmMsiX-iKR92dz9zA', duration: 4 }
    ]
  },
  {
    id: 'elena',
    username: 'Elena',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8VCtoVlWwR9rSWvrCjg-HqHScinDhair1Ir2DVCJusPBkYTCIftTDbd2fXfY-kImd82mBRqfJYPyi6AdIUzrkC482cYAmxEoTHtABlD2FPK4kcpTKFrgxhwqO4n5n5ijC6DDXBsT7GtRIVVELRO49IKgXHY_oCafgb1Y9FG5s_Ba5iUmowxs_IQMSmVZrAXjCywblRins3mi-6Imyi-Ih-4uOCOfnZh2wDQJn6TaheXzxKd8guEiF-BukEaHo7tSZ6q230438SEo',
    segments: [
      { id: 'seg1', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRc34txz8O7rOa8f8HrvKPD0Bi4-oor_IDI0FZ6DV_BG6-f6OheJ09T1i_x1GbY6WAns-DjR7nD8pTaT4h33YTlr_AakN3qMJ2S2gF8iEbIMdnHf3BPqIyFu10ysARCzXZj0T6zsSDotIWX7qNaEXfAQtwqbjRd4qdY9Kzkgl-9y0BsZjwxgJNoFOSE8eY5IA_oGtnLjmpIPj8KV10yhJJV9NGzX6g-bE7OCdjw9QMDiZu-wpR3zmwEPac3rvKucroqKFzGZHlf70', duration: 6 },
      { id: 'seg2', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWqfXUEv-8txuPw1P8JVLuGS2f7A71ZpMoZziwDH-9fbyrISbSyrvhGF1rwKD5QEnPaxo86LOClqIPaIxzsuLpntHymj0DrFjpapP9oQYZVc23_KjsGThf76CdVQ7y09rk0m1JTHcOzZOoZPus0wsNVcTaW9kRLFmtsJql_FPNv9qzEA-D4mAIxZOrqot0zwBFUaabuD92Gyp8KM0aougO4zot0V6qD3uW8IUcnUHWWjFSdDWgLnUNBVBk44-vAmEMQh5iBnIZppk', duration: 5 }
    ]
  },
  {
    id: 'sarah',
    username: 'Sarah',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvquJ5Snlnv4FXeE_PB1bKlx_4vpFF1eVATPdYHUeiu4zgZGCIpzV_C6UgIIdfJ03jBwEE2J6VDQlglwuWQBlYsZg58de1UJRBbPs_iTYf2NDoXNuPUkmOHC4y-_vYWNn8xQfMjM8EhDXUzS4f76C_-8dmxybeo33UQJaCWQWegJbuFSGbSB3POacoFoz9gAnQm0KI-WnRNTq7KroKe4WpXwGjMY9GqXGB8XTCXCgGKfcFrVBRfSYO9tATJDMVU3MhjJvGx1u7T34',
    segments: [
      { id: 'seg1', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRc34txz8O7rOa8f8HrvKPD0Bi4-oor_IDI0FZ6DV_BG6-f6OheJ09T1i_x1GbY6WAns-DjR7nD8pTaT4h33YTlr_AakN3qMJ2S2gF8iEbIMdnHf3BPqIyFu10ysARCzXZj0T6zsSDotIWX7qNaEXfAQtwqbjRd4qdY9Kzkgl-9y0BsZjwxgJNoFOSE8eY5IA_oGtnLjmpIPj8KV10yhJJV9NGzX6g-bE7OCdjw9QMDiZu-wpR3zmwEPac3rvKucroqKFzGZHlf70', duration: 5 }
    ]
  }
];

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: "Elena Rodriguez",
    role: "Marathon Athlete",
    authorImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRc34txz8O7rOa8f8HrvKPD0Bi4-oor_IDI0FZ6DV_BG6-f6OheJ09T1i_x1GbY6WAns-DjR7nD8pTaT4h33YTlr_AakN3qMJ2S2gF8iEbIMdnHf3BPqIyFu10ysARCzXZj0T6zsSDotIWX7qNaEXfAQtwqbjRd4qdY9Kzkgl-9y0BsZjwxgJNoFOSE8eY5IA_oGtnLjmpIPj8KV10yhJJV9NGzX6g-bE7OCdjw9QMDiZu-wpR3zmwEPac3rvKucroqKFzGZHlf70",
    time: "45m ago",
    content: "Chasing the sunrise at the lake today. Biological efficiency is peaking.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWqfXUEv-8txuPw1P8JVLuGS2f7A71ZpMoZziwDH-9fbyrISbSyrvhGF1rwKD5QEnPaxo86LOClqIPaIxzsuLpntHymj0DrFjpapP9oQYZVc23_KjsGThf76CdVQ7y09rk0m1JTHcOzZOoZPus0wsNVcTaW9kRLFmtsJql_FPNv9qzEA-D4mAIxZOrqot0zwBFUaabuD92Gyp8KM0aougO4zot0V6qD3uW8IUcnUHWWjFSdDWgLnUNBVBk44-vAmEMQh5iBnIZppk",
    metrics: [
      { label: "Distance", value: "10.2", unit: "km" },
      { label: "Avg Pace", value: "4'52", unit: "/km" },
      { label: "HR", value: "164", unit: "bpm" }
    ],
    likes: 124,
    comments: 18,
    isLiked: false,
    isFollowing: false
  },
  {
    id: 2,
    author: "Marcus Thorne",
    role: "Powerlifter",
    authorImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtH2-s_CP-vB1FPXqMtrWRKOAuzLe47iWhekpdefJUqgVpoTjlbmjVvUZPrteEWEr9lWUl7-AfGD-QmTPxB_yVOI22wpWdkdOaj_25CXgs_B2siuoku21zBWmCI48Mo00v_Xz_J5vyCN9Ej7Gs6TEBSp03EuzabBvy4-AuEUVRaHI8lTGry9PAAxh7vovjVtrtqZiZ8B7Hk1l37jhKeS3RcVuVPzBWcUVLW81p22JxIdjv7wlIqaa2ZdE4XpXmMsiX-iKR92dz9zA",
    time: "2h ago",
    content: "Upper body power session. Pushing the limits of 1RM today.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAw8L7Ul5ZjALbPudX5LZuhj2wx-f5_bzl2rW3a8doCY1p2kI_19DPq7kr8hbN3mOdan506q5BOvVBoeSr603c3cST7teQxTK4ol0JLPbqr9jo5zmBJOCqAwHAxRoXzWDDL9esM_688ih4FO1pNyR6iZJWNxXFMrir5AMBEPYVvBIus5mVKpOgFlMdlhYu2BbGTv464Wk6cUt4J48WMJH6CR2xXP63_H1rY9WPLz2fk7aG9j08d7DB32pf6bNtEl3SyrJPC4RZT6aQ",
    metrics: [
       { label: "Volume", value: "12,400", unit: "kg" },
       { label: "Intensity", value: "92", unit: "%" }
    ],
    likes: 89,
    comments: 5,
    isLiked: false,
    isFollowing: true
  }
];

export default function SocialFeeds() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  const toggleLike = (id: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  const toggleFollow = (author: string) => {
    setPosts(prev => prev.map(p => {
      if (p.author === author) {
        return { ...p, isFollowing: !p.isFollowing };
      }
      return p;
    }));
  };

  const handlePost = () => {
    if (!newPostText.trim()) return;
    setIsPosting(true);
    
    // Simulate natural posting delay
    setTimeout(() => {
      const newPost: Post = {
        id: Date.now(),
        author: "Alex Rivera", // From Profile.tsx
        role: "Level 14 Athlete",
        authorImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTOQhgJZLgA3tmXjEVMPI3shCqR2vGzHAryFHKeJBhbxFszS5n0fK6cjvg9j1O-bQkuliaZjLVFBVHcTvw7x2B70sa2PRi9WiqQyGfVwkzAkixr4gTTdHsz_8pX0im7Xy248KqFSZZs2Rx9EKnNg_g4Xjm2h0Zb645LyDcYTPQgKZ-zmlWQga8nkwQ2J9yzaztLl-aGpS_d6rtymvxu8Z4Sz4Zli6kD58d56RPqb6bgzoYthibbfBLsf57UTW4-iAVRqwVnH85TiY",
        time: "Just now",
        content: newPostText,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDfaLcIlnUV-J97K4IIcFtuCM4lf2Ov4A_qbN8OnJFiya1DJ912PsaLIjwT7dW4-od2Exb1AaGEyGDNaGAA-kB7-JVDXyuuLy_e1QUr2UhUNOZ8I1sMboJ2dyqBBgeZ-PHFH7vpZyTu1ICZaeLVDg1j6mQ0hxLrmcn-e_O84TLGzOalOEiQavriZ0ZYM8LdZYILHqNU9hgEdJN-ZwKGE_IdW9xDinqO8BHSqIiLFEaaDxK1V8f3OS9MN5ekBN0n9tISbQnq4KxH6Y",
        likes: 0,
        comments: 0,
        isLiked: false,
        isFollowing: true
      };
      setPosts([newPost, ...posts]);
      setNewPostText('');
      setIsPosting(false);
    }, 1200);
  };

  return (
    <div className="bg-bg-primary min-h-screen pb-32">
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex justify-between items-center px-6 py-4 border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 font-headline">Community</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity active:scale-95 duration-200 p-2 bg-surface-container-low rounded-full">notifications</button>
        </div>
      </header>

      <main className="pt-24 px-4 max-w-[430px] mx-auto space-y-8 overflow-x-hidden">
        
        {/* Athlete Stories Bar */}
        <section className="flex gap-4 overflow-x-auto no-scrollbar pb-2 pt-2 px-1">
           {STORIES_DATA.map((story, i) => (
             <button
               key={story.id}
               onClick={() => setActiveStoryIndex(i)}
               className="flex flex-col items-center gap-2 flex-shrink-0 bg-transparent border-none cursor-pointer p-0 outline-none group"
             >
               <div className={`w-20 h-20 rounded-full p-[3.5px] flex-shrink-0 relative transition-transform active:scale-90 duration-300 ${i > 0 ? 'vitality-gradient shadow-lg shadow-secondary/15' : 'bg-outline-variant/20'}`}>
                 <div className="w-full h-full rounded-full border-[3px] border-white dark:border-zinc-900 overflow-hidden relative">
                   <img src={story.avatarUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={story.username} />
                 </div>
                 {i === 0 && (
                   <div className="absolute bottom-0 right-0 w-6 h-6 bg-secondary rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center text-white">
                     <span className="material-symbols-outlined text-[16px]">add</span>
                   </div>
                 )}
               </div>
               <span className="text-[10px] font-bold font-label uppercase tracking-widest text-on-surface-variant/80">{story.username}</span>
             </button>
           ))}
        </section>

        {/* Compose Post */}
        <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/10">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTOQhgJZLgA3tmXjEVMPI3shCqR2vGzHAryFHKeJBhbxFszS5n0fK6cjvg9j1O-bQkuliaZjLVFBVHcTvw7x2B70sa2PRi9WiqQyGfVwkzAkixr4gTTdHsz_8pX0im7Xy248KqFSZZs2Rx9EKnNg_g4Xjm2h0Zb645LyDcYTPQgKZ-zmlWQga8nkwQ2J9yzaztLl-aGpS_d6rtymvxu8Z4Sz4Zli6kD58d56RPqb6bgzoYthibbfBLsf57UTW4-iAVRqwVnH85TiY" className="w-full h-full object-cover" alt="Me" />
            </div>
            <div className="flex-grow">
              <textarea 
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Share your biological breakthrough..."
                className="w-full bg-transparent border-none resize-none font-medium placeholder:text-outline-variant focus:ring-0 min-h-[60px]"
              />
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline-variant/5">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-secondary opacity-60">image</span>
                  <span className="material-symbols-outlined text-tertiary opacity-60">fitness_center</span>
                  <span className="material-symbols-outlined text-outline opacity-60">location_on</span>
                </div>
                <button 
                  onClick={handlePost}
                  disabled={isPosting || !newPostText.trim()}
                  className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-2 rounded-full font-bold text-xs active:scale-95 transition-all disabled:opacity-30"
                >
                  {isPosting ? 'Architecting...' : 'Broadcast'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Feed */}
        <div className="space-y-12">
          <AnimatePresence mode="popLayout">
            {posts.map(post => (
              <motion.article 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={post.id}
                className="bg-surface-container-lowest rounded-[2.5rem] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-outline-variant/5 transition-all duration-300"
              >
                <div className="flex items-center justify-between p-7">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden p-0.5 border-2 border-secondary/20">
                      <img className="w-full h-full object-cover rounded-full" src={post.authorImg} alt={post.author} />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-zinc-900 dark:text-zinc-50">{post.author}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-outline-variant">{post.role} • {post.time}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleFollow(post.author)}
                    className={`px-5 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95 ${post.isFollowing ? 'bg-surface-container-high text-on-surface-variant' : 'bg-secondary text-white'}`}
                  >
                    {post.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>

                <div className="relative aspect-[4/5] w-full px-5">
                  <img className="w-full h-full object-cover rounded-[2rem] shadow-md" src={post.image} alt="Workout Post" />
                  
                  {/* Metric Overlays */}
                  {post.metrics && (
                    <div className="absolute top-10 left-10 flex flex-col gap-2">
                      {post.metrics.map((m, i) => (
                        <div key={i} className="bg-black/20 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl">
                          <p className="text-[8px] uppercase font-bold tracking-widest text-white/60">{m.label}</p>
                          <p className="text-white font-headline font-bold text-lg">{m.value}<span className="text-[10px] ml-0.5 opacity-80">{m.unit}</span></p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="absolute bottom-10 right-10 vitality-gradient w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl shadow-secondary/30">
                     <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>bolt</span>
                  </div>
                </div>

                <div className="p-7">
                  <p className="text-sm font-medium leading-relaxed text-on-surface-variant mb-6">{post.content}</p>

                  <div className="flex items-center justify-between border-t border-outline-variant/10 pt-6">
                    <div className="flex gap-8">
                      <button onClick={() => toggleLike(post.id)} className="flex items-center gap-2 group transition-all active:scale-125">
                        <span className={`material-symbols-outlined text-2xl transition-colors ${post.isLiked ? 'text-red-500' : 'text-outline group-hover:text-red-500'}`} style={{ fontVariationSettings: post.isLiked ? '"FILL" 1' : '"FILL" 0' }}>favorite</span>
                        <span className="text-xs font-black tracking-tighter">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 group">
                        <span className="material-symbols-outlined text-2xl text-outline group-hover:text-secondary transition-colors">chat_bubble</span>
                        <span className="text-xs font-black tracking-tighter">{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 group">
                        <span className="material-symbols-outlined text-2xl text-outline group-hover:text-secondary transition-colors">share</span>
                      </button>
                    </div>
                    <button className="text-outline hover:text-on-surface transition-colors active:scale-110">
                      <span className="material-symbols-outlined text-2xl">bookmark</span>
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

      </main>

      <AnimatePresence>
        {activeStoryIndex !== null && (
          <StoryViewer
            stories={STORIES_DATA}
            initialIndex={activeStoryIndex}
            onClose={() => setActiveStoryIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
