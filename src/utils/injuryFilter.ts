import { Injury } from '../types/behavioral';

export function getSafeAlternatives(injury: Injury): { exercises: string[]; removed: string[] } {
  const removed: string[] = [];
  const exercises: string[] = [];

  if (injury.affectedMovements.includes('RUN') || injury.bodyPart === 'KNEE' || injury.bodyPart === 'ANKLE') {
    removed.push('High-impact sprints', 'Long-distance running');
    exercises.push('Elliptical session', 'Stationary cycle', 'Upper-body cardio');
  }

  if (injury.affectedMovements.includes('SQUAT') || injury.bodyPart === 'LOWER_BACK' || injury.bodyPart === 'HIP') {
    removed.push('Heavy back squats', 'Deadlifts');
    exercises.push('Glute bridges', 'Leg extensions', 'Core bracing');
  }

  if (injury.affectedMovements.includes('PUSH') || injury.bodyPart === 'SHOULDER' || injury.bodyPart === 'WRIST') {
    removed.push('Barbell bench press', 'Overhead dumbbell press');
    exercises.push('Resistance band chest pulls', 'Incline wall pushes', 'Core planks');
  }

  if (exercises.length === 0) {
    exercises.push('Core circuit', 'Mobility & flexibility routines');
  }

  return { exercises, removed };
}
