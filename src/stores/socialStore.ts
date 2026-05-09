import { create } from 'zustand';

export interface SocialUser {
  id: string;
  name: string;
  username: string;
  role: string;
  avatar: string;
  streak: number;
  totalWorkouts: number;
  isFollowing: boolean;
  isOnline: boolean;
  lastActive: string;
  badges: string[];
  currentActivity?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  content: string;
  image?: string;
  time: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  metrics?: { label: string; value: string; unit: string }[];
}

export interface StreakChallenge {
  id: string;
  challengerId: string;
  challengerName: string;
  challengerAvatar: string;
  challengerStreak: number;
  targetDays: number;
  startDate: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

interface SocialState {
  allUsers: SocialUser[];
  challenges: StreakChallenge[];
  posts: Post[];
  activeTab: 'feed' | 'friends' | 'leaderboard';
  searchQuery: string;

  // Actions
  setActiveTab: (tab: 'feed' | 'friends' | 'leaderboard') => void;
  setSearchQuery: (query: string) => void;
  followUser: (id: string) => void;
  unfollowUser: (id: string) => void;
  challengeUser: (userId: string, targetDays: number) => void;
  acceptChallenge: (challengeId: string) => void;
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'isLiked'>) => void;
  toggleLikePost: (postId: string) => void;
  getFollowing: () => SocialUser[];
  getSuggestions: () => SocialUser[];
  getLeaderboard: (myStreak: number) => { id: string; name: string; avatar: string; streak: number; isYou: boolean; badges: string[] }[];
  getFilteredUsers: () => SocialUser[];
  getLiveUsers: () => SocialUser[];
}

// Simulated user pool with realistic data
const SIMULATED_USERS: SocialUser[] = [
  {
    id: 'elena',
    name: 'Elena Rodriguez',
    username: 'elena.fit',
    role: 'Marathon Athlete',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8VCtoVlWwR9rSWvrCjg-HqHScinDhair1Ir2DVCJusPBkYTCIftTDbd2fXfY-kImd82mBRqfJYPyi6AdIUzrkC482cYAmxEoTHtABlD2FPK4kcpTKFrgxhwqO4n5n5ijC6DDXBsT7GtRIVVELRO49IKgXHY_oCafgb1Y9FG5s_Ba5iUmowxs_IQMSmVZrAXjCywblRins3mi-6Imyi-Ih-4uOCOfnZh2wDQJn6TaheXzxKd8guEiF-BukEaHo7tSZ6q230438SEo',
    streak: 34,
    totalWorkouts: 289,
    isFollowing: false,
    isOnline: true,
    lastActive: '2m ago',
    badges: ['sprint', 'local_fire_department', 'diamond'],
    currentActivity: 'Running 10K',
  },
  {
    id: 'marcus',
    name: 'Marcus Thorne',
    username: 'marcus.lift',
    role: 'Powerlifter',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkms0GqjrjNE46Zp_5Iy_n6L23EleWwbTuA9wKtxNZk6t7Yfjpev0nQbKOm5ius8FAkdwielryAjCvDEWtt0IPyWYGlqWjAw2Ncgt0x-rytBisWqTWbFWbCVMuCyu21b1BY5xwS71PLCto-ZLI1pY4XCoj0oywGOmQ_YNi6VXeZtmiHB-DtvI4dmnSDhNWg9ZkIs9wJ_1SdWnuNPOrWSdOcKxT3YzcTdJY82no-DitZGAXkhwT8KBWLfFmL-cCYMTfqZsoadrd-6k',
    streak: 21,
    totalWorkouts: 412,
    isFollowing: true,
    isOnline: true,
    lastActive: 'now',
    badges: ['fitness_center', 'exercise', 'bolt'],
    currentActivity: 'Upper Body Power',
  },
  {
    id: 'sarah',
    name: 'Sarah Chen',
    username: 'sarah.zen',
    role: 'Yoga & HIIT',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvquJ5Snlnv4FXeE_PB1bKlx_4vpFF1eVATPdYHUeiu4zgZGCIpzV_C6UgIIdfJ03jBwEE2J6VDQlglwuWQBlYsZg58de1UJRBbPs_iTYf2NDoXNuPUkmOHC4y-_vYWNn8xQfMjM8EhDXUzS4f76C_-8dmxybeo33UQJaCWQWegJbuFSGbSB3POacoFoz9gAnQm0KI-WnRNTq7KroKe4WpXwGjMY9GqXGB8XTCXCgGKfcFrVBRfSYO9tATJDMVU3MhjJvGx1u7T34',
    streak: 45,
    totalWorkouts: 520,
    isFollowing: false,
    isOnline: false,
    lastActive: '1h ago',
    badges: ['self_improvement', 'local_fire_department', 'star'],
  },
  {
    id: 'jake',
    name: 'Jake Morrison',
    username: 'jake.beast',
    role: 'CrossFit Athlete',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAw8L7Ul5ZjALbPudX5LZuhj2wx-f5_bzl2rW3a8doCY1p2kI_19DPq7kr8hbN3mOdan506q5BOvVBoeSr603c3cST7teQxTK4ol0JLPbqr9jo5zmBJOCqAwHAxRoXzWDDL9esM_688ih4FO1pNyR6iZJWNxXFMrir5AMBEPYVvBIus5mVKpOgFlMdlhYu2BbGTv464Wk6cUt4J48WMJH6CR2xXP63_H1rY9WPLz2fk7aG9j08d7DB32pf6bNtEl3SyrJPC4RZT6aQ',
    streak: 12,
    totalWorkouts: 198,
    isFollowing: false,
    isOnline: true,
    lastActive: '5m ago',
    badges: ['bolt', 'trophy'],
    currentActivity: 'HIIT Blast',
  },
  {
    id: 'priya',
    name: 'Priya Sharma',
    username: 'priya.strong',
    role: 'Calisthenics',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRc34txz8O7rOa8f8HrvKPD0Bi4-oor_IDI0FZ6DV_BG6-f6OheJ09T1i_x1GbY6WAns-DjR7nD8pTaT4h33YTlr_AakN3qMJ2S2gF8iEbIMdnHf3BPqIyFu10ysARCzXZj0T6zsSDotIWX7qNaEXfAQtwqbjRd4qdY9Kzkgl-9y0BsZjwxgJNoFOSE8eY5IA_oGtnLjmpIPj8KV10yhJJV9NGzX6g-bE7OCdjw9QMDiZu-wpR3zmwEPac3rvKucroqKFzGZHlf70',
    streak: 67,
    totalWorkouts: 743,
    isFollowing: false,
    isOnline: false,
    lastActive: '3h ago',
    badges: ['star', 'local_fire_department', 'diamond', 'trophy'],
  },
  {
    id: 'alex-k',
    name: 'Alex Kim',
    username: 'alex.grind',
    role: 'Bodybuilder',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWqfXUEv-8txuPw1P8JVLuGS2f7A71ZpMoZziwDH-9fbyrISbSyrvhGF1rwKD5QEnPaxo86LOClqIPaIxzsuLpntHymj0DrFjpapP9oQYZVc23_KjsGThf76CdVQ7y09rk0m1JTHcOzZOoZPus0wsNVcTaW9kRLFmtsJql_FPNv9qzEA-D4mAIxZOrqot0zwBFUaabuD92Gyp8KM0aougO4zot0V6qD3uW8IUcnUHWWjFSdDWgLnUNBVBk44-vAmEMQh5iBnIZppk',
    streak: 28,
    totalWorkouts: 356,
    isFollowing: true,
    isOnline: false,
    lastActive: '30m ago',
    badges: ['fitness_center', 'exercise'],
  },
  {
    id: 'nina',
    name: 'Nina Volkov',
    username: 'nina.fire',
    role: 'Boxing & MMA',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDfaLcIlnUV-J97K4IIcFtuCM4lf2Ov4A_qbN8OnJFiya1DJ912PsaLIjwT7dW4-od2Exb1AaGEyGDNaGAA-kB7-JVDXyuuLy_e1QUr2UhUNOZ8I1sMboJ2dyqBBgeZ-PHFH7vpZyTu1ICZaeLVDg1j6mQ0hxLrmcn-e_O84TLGzOalOEiQavriZ0ZYM8LdZYILHqNU9hgEdJN-ZwKGE_IdW9xDinqO8BHSqIiLFEaaDxK1V8f3OS9MN5ekBN0n9tISbQnq4KxH6Y',
    streak: 52,
    totalWorkouts: 614,
    isFollowing: false,
    isOnline: true,
    lastActive: 'now',
    badges: ['sports_mma', 'local_fire_department', 'bolt', 'diamond'],
    currentActivity: 'Boxing Drills',
  },
  {
    id: 'omar',
    name: 'Omar Hassan',
    username: 'omar.pace',
    role: 'Sprinter',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtH2-s_CP-vB1FPXqMtrWRKOAuzLe47iWhekpdefJUqgVpoTjlbmjVvUZPrteEWEr9lWUl7-AfGD-QmTPxB_yVOI22wpWdkdOaj_25CXgs_B2siuoku21zBWmCI48Mo00v_Xz_J5vyCN9Ej7Gs6TEBSp03EuzabBvy4-AuEUVRaHI8lTGry9PAAxh7vovjVtrtqZiZ8B7Hk1l37jhKeS3RcVuVPzBWcUVLW81p22JxIdjv7wlIqaa2ZdE4XpXmMsiX-iKR92dz9zA',
    streak: 15,
    totalWorkouts: 187,
    isFollowing: false,
    isOnline: false,
    lastActive: '6h ago',
    badges: ['sprint', 'bolt'],
  },
];

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    authorId: 'elena',
    authorName: "Elena Rodriguez",
    authorRole: "Marathon Athlete",
    authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRc34txz8O7rOa8f8HrvKPD0Bi4-oor_IDI0FZ6DV_BG6-f6OheJ09T1i_x1GbY6WAns-DjR7nD8pTaT4h33YTlr_AakN3qMJ2S2gF8iEbIMdnHf3BPqIyFu10ysARCzXZj0T6zsSDotIWX7qNaEXfAQtwqbjRd4qdY9Kzkgl-9y0BsZjwxgJNoFOSE8eY5IA_oGtnLjmpIPj8KV10yhJJV9NGzX6g-bE7OCdjw9QMDiZu-wpR3zmwEPac3rvKucroqKFzGZHlf70",
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
    isLiked: false
  },
  {
    id: '2',
    authorId: 'marcus',
    authorName: "Marcus Thorne",
    authorRole: "Powerlifter",
    authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtH2-s_CP-vB1FPXqMtrWRKOAuzLe47iWhekpdefJUqgVpoTjlbmjVvUZPrteEWEr9lWUl7-AfGD-QmTPxB_yVOI22wpWdkdOaj_25CXgs_B2siuoku21zBWmCI48Mo00v_Xz_J5vyCN9Ej7Gs6TEBSp03EuzabBvy4-AuEUVRaHI8lTGry9PAAxh7vovjVtrtqZiZ8B7Hk1l37jhKeS3RcVuVPzBWcUVLW81p22JxIdjv7wlIqaa2ZdE4XpXmMsiX-iKR92dz9zA",
    time: "2h ago",
    content: "Upper body power session. Pushing the limits of 1RM today.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAw8L7Ul5ZjALbPudX5LZuhj2wx-f5_bzl2rW3a8doCY1p2kI_19DPq7kr8hbN3mOdan506q5BOvVBoeSr603c3cST7teQxTK4ol0JLPbqr9jo5zmBJOCqAwHAxRoXzWDDL9esM_688ih4FO1pNyR6iZJWNxXFMrir5AMBEPYVvBIus5mVKpOgFlMdlhYu2BbGTv464Wk6cUt4J48WMJH6CR2xXP63_H1rY9WPLz2fk7aG9j08d7DB32pf6bNtEl3SyrJPC4RZT6aQ",
    metrics: [
       { label: "Volume", value: "12,400", unit: "kg" },
       { label: "Intensity", value: "92", unit: "%" }
    ],
    likes: 89,
    comments: 5,
    isLiked: false
  }
];

function loadSocialState() {
  try {
    const saved = localStorage.getItem('fitgenx-social');
    if (saved) {
      const parsed = JSON.parse(saved);
      const users = SIMULATED_USERS.map(u => {
        const savedUser = parsed.allUsers?.find((s: any) => s.id === u.id);
        return savedUser ? { ...u, isFollowing: savedUser.isFollowing } : u;
      });
      return { 
        allUsers: users, 
        challenges: parsed.challenges || [],
        posts: parsed.posts || INITIAL_POSTS
      };
    }
  } catch { /* ignore */ }
  return { allUsers: SIMULATED_USERS, challenges: [], posts: INITIAL_POSTS };
}

function saveSocialState(users: SocialUser[], challenges: StreakChallenge[], posts: Post[]) {
  try {
    localStorage.setItem('fitgenx-social', JSON.stringify({
      allUsers: users.map(u => ({ id: u.id, isFollowing: u.isFollowing })),
      challenges,
      posts
    }));
  } catch { /* ignore */ }
}

const initial = loadSocialState();

export const useSocialStore = create<SocialState>((set, get) => ({
  allUsers: initial.allUsers,
  challenges: initial.challenges,
  posts: initial.posts,
  activeTab: 'feed',
  searchQuery: '',

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  followUser: (id) => {
    set(state => {
      const allUsers = state.allUsers.map(u =>
        u.id === id ? { ...u, isFollowing: true } : u
      );
      saveSocialState(allUsers, state.challenges, state.posts);
      return { allUsers };
    });
  },

  unfollowUser: (id) => {
    set(state => {
      const allUsers = state.allUsers.map(u =>
        u.id === id ? { ...u, isFollowing: false } : u
      );
      saveSocialState(allUsers, state.challenges, state.posts);
      return { allUsers };
    });
  },

  challengeUser: (userId, targetDays) => {
    set(state => {
      const user = state.allUsers.find(u => u.id === userId);
      if (!user) return state;
      const challenge: StreakChallenge = {
        id: `challenge-${Date.now()}`,
        challengerId: userId,
        challengerName: user.name,
        challengerAvatar: user.avatar,
        challengerStreak: user.streak,
        targetDays,
        startDate: new Date().toISOString(),
        status: 'active',
      };
      const challenges = [challenge, ...state.challenges];
      saveSocialState(state.allUsers, challenges, state.posts);
      return { challenges };
    });
  },

  acceptChallenge: (challengeId) => {
    set(state => {
      const challenges = state.challenges.map(c =>
        c.id === challengeId ? { ...c, status: 'active' as const } : c
      );
      saveSocialState(state.allUsers, challenges, state.posts);
      return { challenges };
    });
  },

  addPost: (postData) => {
    set(state => {
      const newPost: Post = {
        ...postData,
        id: `post-${Date.now()}`,
        likes: 0,
        comments: 0,
        isLiked: false
      };
      const posts = [newPost, ...state.posts];
      saveSocialState(state.allUsers, state.challenges, posts);
      return { posts };
    });
  },

  toggleLikePost: (postId) => {
    set(state => {
      const posts = state.posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isLiked: !p.isLiked,
            likes: p.isLiked ? p.likes - 1 : p.likes + 1
          };
        }
        return p;
      });
      saveSocialState(state.allUsers, state.challenges, posts);
      return { posts };
    });
  },

  getFollowing: () => get().allUsers.filter(u => u.isFollowing),

  getSuggestions: () => get().allUsers
    .filter(u => !u.isFollowing)
    .sort((a, b) => b.streak - a.streak),

  getLeaderboard: (myStreak) => {
    const friends = get().allUsers
      .filter(u => u.isFollowing)
      .map(u => ({ id: u.id, name: u.name, avatar: u.avatar, streak: u.streak, isYou: false, badges: u.badges }));

    const me = {
      id: 'me',
      name: 'You',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTOQhgJZLgA3tmXjEVMPI3shCqR2vGzHAryFHKeJBhbxFszS5n0fK6cjvg9j1O-bQkuliaZjLVFBVHcTvw7x2B70sa2PRi9WiqQyGfVwkzAkixr4gTTdHsz_8pX0im7Xy248KqFSZZs2Rx9EKnNg_g4Xjm2h0Zb645LyDcYTPQgKZ-zmlWQga8nkwQ2J9yzaztLl-aGpS_d6rtymvxu8Z4Sz4Zli6kD58d56RPqb6bgzoYthibbfBLsf57UTW4-iAVRqwVnH85TiY',
      streak: myStreak,
      isYou: true,
      badges: ['local_fire_department'],
    };

    return [...friends, me].sort((a, b) => b.streak - a.streak);
  },

  getFilteredUsers: () => {
    const { allUsers, searchQuery } = get();
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allUsers.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  },

  getLiveUsers: () => get().allUsers.filter(u => u.isOnline && u.currentActivity),
}));
