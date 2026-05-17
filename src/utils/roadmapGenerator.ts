import { Chapter, RoadmapNode } from '../types/roadmap';

export function generateCustomRoadmap(
  goal: string,
  weeks: number,
  fitnessLevel: string
): { chapters: Chapter[]; nodes: Record<string, RoadmapNode> } {
  // Simple deterministic generation for the requested Custom Roadmap Builder
  const chapterId = `ch_custom_${Date.now()}`;
  
  const chapters: Chapter[] = [
    {
      id: chapterId,
      chapterNumber: 1,
      theme: 'custom',
      title: `${goal} Custom Roadmap`,
      subtitle: `${weeks}-Week Plan (${fitnessLevel})`,
      description: `Tailored custom progression for the ${goal} journey over ${weeks} weeks.`,
      loreText: `This roadmap is uniquely generated for your ultimate objective: ${goal}. Keep pushing forward.`,
      completionQuote: `You completed your custom goal! You are in absolute peak form.`,
      nodes: [`${chapterId}_n1`, `${chapterId}_n2`, `${chapterId}_boss`],
      bossNodeId: `${chapterId}_boss`,
      status: 'active',
      backgroundColor: 'bg-emerald-500/10 border-emerald-500/30',
      totalNodes: 3,
      completedNodes: 0,
    },
  ];

  const nodes: Record<string, RoadmapNode> = {
    [`${chapterId}_n1`]: {
      id: `${chapterId}_n1`,
      chapterId: chapterId,
      type: 'workout',
      title: 'Foundation Step',
      description: `Execute 1 full session to begin your customized ${weeks}-Week journey.`,
      position: { x: 50, y: 100 },
      connections: [`${chapterId}_n2`],
      status: 'active',
      requirement: {
        type: 'complete_sessions',
        value: 1,
        unit: 'sessions',
        description: 'First custom session',
        progress: 0,
      },
      rewards: [
        { type: 'momentum_tokens', value: 100, label: '+100 tokens' },
        { type: 'badge', value: 'Custom Catalyst', label: 'Badge: Custom Catalyst' },
      ],
      icon: 'directions_run',
      color: 'teal',
    },
    [`${chapterId}_n2`]: {
      id: `${chapterId}_n2`,
      chapterId: chapterId,
      type: 'milestone',
      title: 'Momentum Builder',
      description: `Complete 3 sessions as part of your custom training objectives.`,
      position: { x: 30, y: 220 },
      connections: [`${chapterId}_boss`],
      status: 'locked',
      requirement: {
        type: 'complete_sessions',
        value: 3,
        unit: 'sessions',
        description: '3 custom sessions',
        progress: 0,
      },
      rewards: [{ type: 'momentum_tokens', value: 150, label: '+150 tokens' }],
      icon: 'timer',
      color: 'blue',
    },
    [`${chapterId}_boss`]: {
      id: `${chapterId}_boss`,
      chapterId: chapterId,
      type: 'boss',
      title: 'Summit Peak',
      description: `The final step on your custom path. Deliver max intensity!`,
      position: { x: 50, y: 340 },
      connections: [],
      status: 'locked',
      requirement: {
        type: 'complete_sessions',
        value: 5,
        unit: 'sessions',
        description: '5 peak custom sessions',
        progress: 0,
      },
      rewards: [
        { type: 'momentum_tokens', value: 800, label: '+800 tokens' },
        { type: 'badge', value: 'Custom Champion', label: 'Badge: Custom Champion' },
      ],
      icon: 'stars',
      color: 'amber',
      bossData: {
        name: 'The Elite Summit',
        backstory: `The culmination of your custom ${goal} training plan!`,
        completionCriteria: `Reach max potential`,
        failureConsequence: `Success is inevitable, breathe and continue.`,
        bossReward: [{ type: 'chapter_unlock', value: 'ch_custom_boss', label: 'Champion Unlock' }],
      },
    },
  };

  return { chapters, nodes };
}
