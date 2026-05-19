import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RoadmapNode, Chapter } from '../types/roadmap';
import { initialChapters, initialNodes } from '../data/defaultRoadmap';

interface RoadmapStore {
  chapters: Chapter[];
  nodes: Record<string, RoadmapNode>;
  activeNodeId: string | null;
  currentChapterId: string;
  totalNodesCompleted: number;
  roadmapVersion: number;

  // actions
  initializeRoadmap: (force?: boolean) => void;
  completeNode: (nodeId: string) => { xp: number; tokens: number } | null;
  updateNodeProgress: (nodeId: string, progress: number) => void;
  getActiveNode: () => RoadmapNode | null;
  resetChapter: (chapterId: string) => void;
  setChapterTheme: (chapterId: string, route: string) => void;
  setCurrentChapterId: (chapterId: string) => void;
}

export const useRoadmapStore = create<RoadmapStore>()(
  persist(
    (set, get) => ({
      chapters: [],
      nodes: {},
      activeNodeId: null,
      currentChapterId: 'ch1',
      totalNodesCompleted: 0,
      roadmapVersion: 1,

      initializeRoadmap: (force = false) => {
        const { chapters } = get();
        if (chapters.length === 0 || force) {
          set({
            chapters: [...initialChapters],
            nodes: { ...initialNodes },
            activeNodeId: 'ch1_n1',
            currentChapterId: 'ch1',
            totalNodesCompleted: 0,
            roadmapVersion: 1,
          });
        }
      },

      completeNode: (nodeId) => {
        const state = get();
        const node = state.nodes[nodeId];
        if (!node || node.status === 'completed') return null;

        // Rewards logic
        let xpGained = 50;
        if (node.type === 'challenge') xpGained = 100;
        if (node.type === 'boss') xpGained = 300;
        if (node.type === 'sidequest') xpGained = 75;

        let tokensEarned = 0;
        node.rewards.forEach((r) => {
          if (r.type === 'momentum_tokens') {
            tokensEarned += Number(r.value) || 0;
          }
        });

        // 1. Update this node
        const updatedNodes = { ...state.nodes };
        updatedNodes[nodeId] = {
          ...node,
          status: 'completed',
          completedAt: new Date().toISOString(),
          requirement: {
            ...node.requirement,
            progress: node.requirement.value,
          },
        };

        // 2. Unlock the next connected nodes
        node.connections.forEach((connId) => {
          if (updatedNodes[connId] && updatedNodes[connId].status === 'locked') {
            updatedNodes[connId] = { ...updatedNodes[connId], status: 'active' };
          }
        });

        // 3. Increment chapter completed nodes and check if boss was cleared
        const updatedChapters = state.chapters.map((ch) => {
          if (ch.id === node.chapterId) {
            const completedInCh = Object.values(updatedNodes).filter(
              (n) => n.chapterId === ch.id && n.status === 'completed'
            ).length;

            const isBossCleared = ch.bossNodeId === nodeId;

            // Return chapter updates
            return {
              ...ch,
              completedNodes: completedInCh,
              status: isBossCleared ? 'completed' : ch.status,
              completedAt: isBossCleared ? new Date().toISOString() : ch.completedAt,
            } as Chapter;
          }
          return ch;
        });

        // Unlock next chapter if available
        if (node.type === 'boss') {
          const chNum = Number(node.chapterId.replace('ch', ''));
          const nextId = `ch${chNum + 1}`;
          const targetIndex = updatedChapters.findIndex((c) => c.id === nextId);
          if (targetIndex !== -1) {
            updatedChapters[targetIndex] = {
              ...updatedChapters[targetIndex],
              status: 'active',
              unlockedAt: new Date().toISOString(),
            };

            // Unlock the very first node of the newly opened chapter
            const firstNodeId = `${nextId}_n1`;
            if (updatedNodes[firstNodeId]) {
              updatedNodes[firstNodeId] = { ...updatedNodes[firstNodeId], status: 'active' };
            }
          }
        }

        // Add tokens to settingsStore if loaded in browser
        try {
          const savedTokens = Number(localStorage.getItem('fitgenx-tokens') || 2450);
          localStorage.setItem('fitgenx-tokens', (savedTokens + tokensEarned).toString());
        } catch (_) {}

        set({
          nodes: updatedNodes,
          chapters: updatedChapters,
          totalNodesCompleted: state.totalNodesCompleted + 1,
        });

        return { xp: xpGained, tokens: tokensEarned };
      },

      updateNodeProgress: (nodeId, progress) => {
        const state = get();
        const node = state.nodes[nodeId];
        if (!node || node.status === 'completed') return;

        const updatedNodes = { ...state.nodes };
        const newProgress = Math.min(progress, node.requirement.value);

        updatedNodes[nodeId] = {
          ...node,
          requirement: {
            ...node.requirement,
            progress: newProgress,
          },
        };

        set({ nodes: updatedNodes });

        // Auto complete if progress is fulfilled!
        if (newProgress >= node.requirement.value) {
          get().completeNode(nodeId);
        }
      },

      getActiveNode: () => {
        const { nodes, activeNodeId } = get();
        if (activeNodeId && nodes[activeNodeId]) {
          return nodes[activeNodeId];
        }
        // Fallback to the first active node
        const activeNodes = Object.values(nodes).filter((n) => n.status === 'active');
        return activeNodes.length > 0 ? activeNodes[0] : null;
      },

      resetChapter: (chapterId) => {
        const state = get();
        const updatedNodes = { ...state.nodes };
        const updatedChapters = [...state.chapters];

        // Reset the nodes of this chapter back to locked (except first one)
        const chapter = updatedChapters.find((c) => c.id === chapterId);
        if (!chapter) return;

        chapter.status = 'active';
        chapter.completedNodes = 0;

        Object.keys(updatedNodes).forEach((k) => {
          const n = updatedNodes[k];
          if (n.chapterId === chapterId) {
            n.status = k.endsWith('_n1') ? 'active' : 'locked';
            n.requirement.progress = 0;
            n.completedAt = undefined;
          }
        });

        set({ chapters: updatedChapters, nodes: updatedNodes });
      },

      setChapterTheme: (chapterId, route) => {
        const state = get();
        const updatedChapters = state.chapters.map((ch) => {
          if (ch.id === chapterId) {
            return {
              ...ch,
              theme: route as any,
            };
          }
          return ch;
        });
        set({ chapters: updatedChapters });
      },

      setCurrentChapterId: (chapterId) => set({ currentChapterId: chapterId }),
    }),
    {
      name: 'fitgenx-roadmap',
    }
  )
);
