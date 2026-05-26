import { MoodLog, PrimeTimeResult } from '../types/behavioral';

export function analyzePrimeTime(logs: MoodLog[]): PrimeTimeResult | null {
  if (!logs || logs.length === 0) {
    return null;
  }

  // Morning 5-9, Midday 10-13, Afternoon 14-17, Evening 18-22
  const buckets: Record<string, { totalMood: number; count: number; label: string }> = {
    morning: { totalMood: 0, count: 0, label: 'Morning' },
    midday: { totalMood: 0, count: 0, label: 'Midday' },
    afternoon: { totalMood: 0, count: 0, label: 'Afternoon' },
    evening: { totalMood: 0, count: 0, label: 'Evening' },
  };

  let totalMood = 0;

  logs.forEach((log) => {
    totalMood += log.moodRating;
    const hour = log.hour;
    if (hour >= 5 && hour <= 9) {
      buckets.morning.totalMood += log.moodRating;
      buckets.morning.count++;
    } else if (hour >= 10 && hour <= 13) {
      buckets.midday.totalMood += log.moodRating;
      buckets.midday.count++;
    } else if (hour >= 14 && hour <= 17) {
      buckets.afternoon.totalMood += log.moodRating;
      buckets.afternoon.count++;
    } else if (hour >= 18 && hour <= 22) {
      buckets.evening.totalMood += log.moodRating;
      buckets.evening.count++;
    } else {
      // Midnight-4am can go to morning/evening or be counted generally
      buckets.evening.totalMood += log.moodRating;
      buckets.evening.count++;
    }
  });

  let bestTimeOfDay = 'evening';
  let bestAvg = 0;

  for (const k in buckets) {
    if (buckets[k].count > 0) {
      const avg = buckets[k].totalMood / buckets[k].count;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestTimeOfDay = buckets[k].label;
      }
    }
  }

  return {
    bestTimeOfDay,
    avgMood: Number((totalMood / logs.length).toFixed(1)),
    totalLogs: logs.length,
    bestHourBucket: `${bestTimeOfDay} hours`,
  };
}
