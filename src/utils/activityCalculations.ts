import type { ActivityType, KmSplit, RoutePoint } from '../types/activity';

/**
 * Calculates the great-circle distance between two geographic coordinates
 * on a spherical Earth using the Haversine formula.
 * Returns distance in meters.
 */
export function haversineDistance(
  [lat1, lon1]: [number, number],
  [lat2, lon2]: [number, number]
): number {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * MET (Metabolic Equivalent of Task) table & honest energy expenditure formula.
 *
 * References:
 * - 2011 Compendium of Physical Activities (Ainsworth BE et al., Medicine & Science in Sports & Exercise):
 *   - Walking, moderate effort (approx 4.5–5.0 km/h): code 17170 -> 3.5 METs
 *   - Bicycling, moderate effort (approx 19–22 km/h): code 01020 -> 7.0 METs
 *   - Resistance (weight) training / conditioning, vigorous: code 02054 -> 5.5 METs
 *   - Running / jogging:
 *       >= 6:00 min/km (8–9 km/h): code 12020 -> 8.5 METs
 *       5:00 min/km (12 km/h): code 12050 -> 10.0 METs
 *       <= 4:00 min/km (15+ km/h): code 12080 -> 11.5 METs
 *
 * Formula: Calories (kcal) = MET * weight (kg) * movingHours
 */
export function getMetForActivity(type: ActivityType, paceMinutesPerKm?: number | null): number {
  switch (type) {
    case 'walk':
      return 3.5;
    case 'cycle':
      return 7.0;
    case 'gym':
      return 5.5;
    case 'run': {
      if (!paceMinutesPerKm || paceMinutesPerKm <= 0 || !isFinite(paceMinutesPerKm)) {
        return 8.5; // Default moderate jog MET
      }
      if (paceMinutesPerKm >= 6.0) {
        return 8.5; // Jogging at or slower than 6:00/km
      }
      // Linearly scale from 8.5 at 6:00/km up to 11.5 at 4:00/km (max 11.5)
      const speedBonus = (6.0 - Math.max(paceMinutesPerKm, 4.0)) * 1.5;
      return 8.5 + speedBonus;
    }
  }
}

/**
 * Calculate honest calorie expenditure.
 * Uses weightKg (falling back to 70kg if unspecified).
 */
export function calculateHonestCalories(
  type: ActivityType,
  movingSeconds: number,
  weightKg = 70,
  paceMinutesPerKm?: number | null
): { calories: number; isEstimate: boolean } {
  const safeWeight = weightKg > 0 ? weightKg : 70;
  const isEstimate = !weightKg || weightKg <= 0;
  const movingHours = Math.max(0, movingSeconds) / 3600;
  const met = getMetForActivity(type, paceMinutesPerKm);
  const calories = Math.round(met * safeWeight * movingHours);
  return { calories, isEstimate };
}

/**
 * Format total seconds into mm:ss or hh:mm:ss.
 */
export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return hrs > 0
    ? `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Format pace given pace in minutes per km into m:ss.
 */
export function formatPace(paceMinutesPerKm: number | null): string {
  if (!paceMinutesPerKm || paceMinutesPerKm <= 0 || !isFinite(paceMinutesPerKm) || paceMinutesPerKm >= 60) {
    return '--:--';
  }
  const mins = Math.floor(paceMinutesPerKm);
  const secs = Math.round((paceMinutesPerKm % 1) * 60);
  if (secs === 60) {
    return `${mins + 1}:00`;
  }
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * Compute average pace in seconds per kilometer.
 */
export function computeAvgPaceSecPerKm(movingSeconds: number, distanceM: number): number | null {
  if (distanceM <= 0 || movingSeconds <= 0) return null;
  const km = distanceM / 1000;
  return Math.round(movingSeconds / km);
}

/**
 * Calculate rolling pace for the last N seconds (default 30 seconds).
 */
export function calculateRollingPace(
  points: RoutePoint[],
  windowMs = 30_000
): number | null {
  if (!points || points.length < 2) return null;
  const now = points[points.length - 1].t;
  const windowPoints = points.filter((p) => now - p.t <= windowMs);
  if (windowPoints.length < 2) return null;

  let windowDistM = 0;
  for (let i = 1; i < windowPoints.length; i++) {
    windowDistM += haversineDistance(
      [windowPoints[i - 1].lat, windowPoints[i - 1].lng],
      [windowPoints[i].lat, windowPoints[i].lng]
    );
  }

  const timeDeltaSec = (windowPoints[windowPoints.length - 1].t - windowPoints[0].t) / 1000;
  if (windowDistM < 10 || timeDeltaSec <= 0) return null; // Avoid division noise at standstill

  const paceSecPerKm = timeDeltaSec / (windowDistM / 1000);
  return paceSecPerKm / 60; // in minutes per km
}

/**
 * Check if the user completed a new kilometer and return updated per-km splits.
 * splits contain: [{ km: 1, seconds: 320, pace: "5:20" }, ...]
 */
export function evaluateSplits(
  distanceM: number,
  movingSeconds: number,
  existingSplits: KmSplit[]
): { updatedSplits: KmSplit[]; newKmCompleted: number | null } {
  const currentCompletedKm = Math.floor(distanceM / 1000);
  const previouslyCompletedKm = existingSplits.length;

  if (currentCompletedKm > previouslyCompletedKm) {
    const newKm = previouslyCompletedKm + 1;
    const totalPreviousSplitSeconds = existingSplits.reduce((acc, s) => acc + s.seconds, 0);
    const splitSeconds = Math.max(1, movingSeconds - totalPreviousSplitSeconds);
    const paceFormatted = formatPace(splitSeconds / 60);

    const newSplit: KmSplit = {
      km: newKm,
      seconds: splitSeconds,
      pace: paceFormatted,
    };

    return {
      updatedSplits: [...existingSplits, newSplit],
      newKmCompleted: newKm,
    };
  }

  return {
    updatedSplits: existingSplits,
    newKmCompleted: null,
  };
}

/**
 * Finds the best (fastest) split in seconds from the splits list.
 */
export function getBestSplit(splits: KmSplit[]): KmSplit | null {
  if (!splits || splits.length === 0) return null;
  return splits.reduce((best, curr) => (curr.seconds < best.seconds ? curr : best), splits[0]);
}

/**
 * Downsamples recorded GPS route:
 * - Keeps a point only if it is >5m from the last kept point.
 * - Caps maximum points at 2,000 so long endurance runs never exceed document thresholds.
 */
export function downsampleRoute(
  points: RoutePoint[],
  minDistanceM = 5,
  maxPoints = 2000
): RoutePoint[] {
  if (!points || points.length <= 1) return points || [];

  const kept: RoutePoint[] = [points[0]];

  for (let i = 1; i < points.length; i++) {
    const pt = points[i];
    const prev = kept[kept.length - 1];
    const d = haversineDistance([prev.lat, prev.lng], [pt.lat, pt.lng]);
    if (d >= minDistanceM) {
      kept.push(pt);
    }
  }

  // Ensure final point is preserved
  const lastPoint = points[points.length - 1];
  if (kept[kept.length - 1] !== lastPoint) {
    kept.push(lastPoint);
  }

  // If still above maxPoints cap, uniform subsample
  if (kept.length > maxPoints) {
    const step = (kept.length - 1) / (maxPoints - 1);
    const sampled: RoutePoint[] = [];
    for (let i = 0; i < maxPoints; i++) {
      sampled.push(kept[Math.round(i * step)]);
    }
    return sampled;
  }

  return kept;
}

/**
 * Creature XP Formula:
 * - Runs / Walks / Cycles: 50 XP base + 20 XP per full kilometer completed, capped at 200 XP.
 * - Gym Workouts: 50 XP base + 25 XP per completed exercise, capped at 200 XP.
 */
export function calculateActivityXP(
  type: ActivityType,
  distanceM: number,
  completedExercisesCount = 0
): number {
  if (type === 'gym') {
    return Math.min(200, 50 + completedExercisesCount * 25);
  }
  const fullKm = Math.floor(distanceM / 1000);
  return Math.min(200, 50 + fullKm * 20);
}

/**
 * Calculate moving vs paused elapsed time based on timestamps.
 */
export function calculateSessionTimestamps(
  startTime: number,
  pausedAt: number | null,
  totalPausedMs: number,
  now = Date.now()
): { movingSeconds: number; pausedSeconds: number } {
  if (!startTime) return { movingSeconds: 0, pausedSeconds: 0 };

  const isPaused = pausedAt !== null;
  const currentPausedAdditional = isPaused ? Math.max(0, now - pausedAt) : 0;
  const accumulatedPausedMs = totalPausedMs + currentPausedAdditional;

  const totalSessionMs = Math.max(0, (isPaused ? pausedAt : now) - startTime);
  const movingMs = Math.max(0, totalSessionMs - totalPausedMs);

  return {
    movingSeconds: Math.floor(movingMs / 1000),
    pausedSeconds: Math.floor(accumulatedPausedMs / 1000),
  };
}
