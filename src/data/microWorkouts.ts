export interface MicroWorkout {
  id: string;
  name: string;
  duration: number; // in seconds
  space: 'standing' | 'seated' | 'floor';
  intensity: 'low' | 'medium';
  exercises: string[];
}

export const microWorkouts: MicroWorkout[] = [
  {
    id: 'mw-01',
    name: '5-Minute Desk Reset',
    duration: 300,
    space: 'seated',
    intensity: 'low',
    exercises: [
      '1 min Seated spinal twists',
      '1 min Wrist & forearm stretches',
      '1 min Shoulder blade pinches',
      '2 min Deep neck releases & diaphragmatic breathing'
    ]
  },
  {
    id: 'mw-02',
    name: '10-Minute Energy Burst',
    duration: 600,
    space: 'standing',
    intensity: 'medium',
    exercises: [
      '2 min Dynamic jumping jacks',
      '3 min Standing alternating lunges',
      '3 min Continuous mountain climbers',
      '2 min Shadowboxing in place'
    ]
  }
];
