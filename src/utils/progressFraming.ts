import { ProgressEventType, ProgressMessage } from '../types/behavioral';

export function getProgressMessage(eventType: ProgressEventType): ProgressMessage {
  switch (eventType) {
    case 'STREAK_BROKEN':
      return {
        title: 'Ready for a fresh start',
        subtitle: 'Taking a breath is part of the process. We are right here with you.',
        petState: 'resting',
        tone: 'warm'
      };
    case 'GOAL_MISSED':
      return {
        title: 'Adjusting the sails',
        subtitle: 'Every little movement counts toward a healthy, active future.',
        petState: 'resting',
        tone: 'neutral'
      };
    case 'WORKOUT_SKIPPED':
      return {
        title: 'Resting today',
        subtitle: 'Active recovery is where the magic happens. Move when you feel inspired.',
        petState: 'recovering',
        tone: 'warm'
      };
    case 'CALORIES_UNDER':
      return {
        title: 'Energy preserved',
        subtitle: 'Your body knows its natural balance. Fuel up whenever you are ready.',
        petState: 'exploring',
        tone: 'neutral'
      };
    case 'STEPS_SHORT':
      return {
        title: 'Exploring slowly',
        subtitle: 'Taking things slow makes every step a deliberate movement forward.',
        petState: 'exploring',
        tone: 'warm'
      };
    default:
      return {
        title: 'Moving at your pace',
        subtitle: 'Every effort keeps you connected to your goals.',
        petState: 'exploring',
        tone: 'neutral'
      };
  }
}
