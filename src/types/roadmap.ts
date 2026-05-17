export type NodeStatus = 'completed' | 'active' | 'locked';
export type NodeType = 'workout' | 'milestone' | 'challenge' | 'boss' | 'rest' | 'sidequest';
export type ChapterTheme = 'beginner' | 'endurance' | 'strength' | 'speed' | 'elite' | 'custom';

export interface RoadmapNode {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  chapterId: string;
  position: { x: number; y: number }; // for map layout
  connections: string[]; // IDs of nodes this connects to (next)
  status: NodeStatus;
  completedAt?: string;

  // What the user must do
  requirement: NodeRequirement;

  // What the user gets on completion
  rewards: NodeReward[];

  // Visual
  icon: string; // SVG path string or icon name
  color: 'teal' | 'purple' | 'amber' | 'coral' | 'blue';

  // Optional branching
  isBranch?: boolean;
  branchLabel?: string; // e.g. "Side quest: Flexibility"

  // Boss specific
  bossData?: BossChallenge;
}

export interface NodeRequirement {
  type: 'complete_sessions' | 'hit_distance' | 'hit_duration' | 'achieve_pace'
       | 'consecutive_days' | 'complete_specific_workout' | 'hit_steps' | 'custom';
  value: number;         // e.g. 3 (sessions), 5 (km), 30 (min)
  unit: string;          // e.g. "sessions", "km", "min", "days"
  timeWindowDays?: number; // must be done within N days (optional)
  description: string;   // human readable: "Run 3 times this week"
  progress: number;      // current progress toward requirement
}

export interface NodeReward {
  type: 'momentum_tokens' | 'pet_item' | 'chapter_unlock' | 'badge'
       | 'creature_evolution' | 'route_theme' | 'custom_title';
  value: number | string;
  label: string;          // display label: "+150 tokens", "Dragon Wings skin"
  iconUrl?: string;
}

export interface BossChallenge {
  name: string;            // e.g. "The Half Marathon Gate"
  backstory: string;       // flavour narrative copy
  completionCriteria: string;
  timeLimit?: number;      // days to complete once unlocked
  failureConsequence: string; // what happens if they don't finish in time (never punishing)
  bossReward: NodeReward[]; // extra rewards for beating the boss
}

export interface Chapter {
  id: string;
  theme: ChapterTheme;
  title: string;           // e.g. "The Endurance Arc"
  subtitle: string;        // e.g. "Build your base. Own the distance."
  description: string;
  nodes: string[];         // ordered array of node IDs
  bossNodeId: string;
  status: 'locked' | 'active' | 'completed';
  unlockedAt?: string;
  completedAt?: string;
  chapterNumber: number;
  backgroundColor: string; // Tailwind bg class for chapter header
  totalNodes: number;
  completedNodes: number;

  // Lore / narrative flavour
  loreText: string;        // Short story paragraph shown when chapter unlocks
  completionQuote: string; // Motivational quote shown when chapter finishes
}

export interface RoadmapState {
  chapters: Chapter[];
  nodes: Record<string, RoadmapNode>;
  activeNodeId: string | null;
  currentChapterId: string;
  totalNodesCompleted: number;
  roadmapVersion: number; // increment when new content is added
}
