import { describe, it, expect } from 'vitest';
import {
  haversineDistance,
  computeAvgPaceSecPerKm,
  formatPace,
  formatTime,
  evaluateSplits,
  getBestSplit,
  calculateSessionTimestamps,
  getMetForActivity,
  calculateHonestCalories,
  downsampleRoute,
  calculateActivityXP,
} from '../src/utils/activityCalculations';
import {
  processGpsFix,
  createInitialGpsFilterState,
  type GpsFixInput,
} from '../src/utils/gpsFilter';
import type { RoutePoint } from '../src/types/activity';

describe('Activity Tracking Engine', () => {
  describe('1. Haversine Distance Calculation', () => {
    it('returns 0 for identical points', () => {
      const p1: [number, number] = [28.6139, 77.2090];
      expect(haversineDistance(p1, p1)).toBe(0);
    });

    it('calculates approximately 111.19 km for 1 degree latitude at equator', () => {
      const p1: [number, number] = [0, 0];
      const p2: [number, number] = [1, 0];
      const dist = haversineDistance(p1, p2);
      // 1 degree latitude is ~111,195m
      expect(dist).toBeGreaterThan(111000);
      expect(dist).toBeLessThan(111500);
    });

    it('calculates accurate short distance (100 meters)', () => {
      // ~0.0009 degrees latitude is ~100.07 meters
      const p1: [number, number] = [37.7749, -122.4194];
      const p2: [number, number] = [37.7758, -122.4194];
      const dist = haversineDistance(p1, p2);
      expect(dist).toBeCloseTo(100.07, 0);
    });
  });

  describe('2. Pace and Per-Km Split Calculation', () => {
    it('computes average pace in seconds per km correctly', () => {
      // 5km in 25 minutes (1500 seconds) -> 300 sec/km (5:00 /km)
      expect(computeAvgPaceSecPerKm(1500, 5000)).toBe(300);

      // 10km in 45 minutes (2700 seconds) -> 270 sec/km (4:30 /km)
      expect(computeAvgPaceSecPerKm(2700, 10000)).toBe(270);

      // 0 distance returns null (never Infinity or NaN)
      expect(computeAvgPaceSecPerKm(300, 0)).toBeNull();
      expect(computeAvgPaceSecPerKm(0, 0)).toBeNull();
    });

    it('formats pace correctly into mm:ss /km format', () => {
      expect(formatPace(5.0)).toBe('5:00');
      expect(formatPace(5.5)).toBe('5:30');
      expect(formatPace(4.25)).toBe('4:15');
      expect(formatPace(null)).toBe('--:--');
      expect(formatPace(0)).toBe('--:--');
    });

    it('creates accurate per-km splits as each kilometre completes', () => {
      let splits: any[] = [];

      // Pass 900m at 270s (no split yet)
      const res1 = evaluateSplits(900, 270, splits);
      splits = res1.updatedSplits;
      expect(splits).toHaveLength(0);
      expect(res1.newKmCompleted).toBeNull();

      // Cross 1000m mark at 305s -> split 1 completed in 305s (5:05/km)
      const res2 = evaluateSplits(1050, 305, splits);
      splits = res2.updatedSplits;
      expect(splits).toHaveLength(1);
      expect(res2.newKmCompleted).toBe(1);
      expect(splits[0].km).toBe(1);
      expect(splits[0].seconds).toBe(305);
      expect(splits[0].pace).toBe('5:05');

      // Cross 2000m mark at 600s -> split 2 completed in 295s (4:55/km)
      const res3 = evaluateSplits(2020, 600, splits);
      splits = res3.updatedSplits;
      expect(splits).toHaveLength(2);
      expect(res3.newKmCompleted).toBe(2);
      expect(splits[1].km).toBe(2);
      expect(splits[1].seconds).toBe(295);
      expect(splits[1].pace).toBe('4:55');
    });

    it('identifies best split so far', () => {
      const splits = [
        { km: 1, seconds: 320, pace: '5:20' },
        { km: 2, seconds: 290, pace: '4:50' }, // Best
        { km: 3, seconds: 310, pace: '5:10' },
      ];
      const best = getBestSplit(splits);
      expect(best?.km).toBe(2);
      expect(best?.seconds).toBe(290);
    });
  });

  describe('3. Moving vs Paused Time Calculation', () => {
    it('calculates elapsed moving time accurately using timestamps', () => {
      const startTime = 1000000;
      const now = startTime + 60000; // 60 seconds later
      const state = calculateSessionTimestamps(startTime, null, 0, now);

      expect(state.movingSeconds).toBe(60);
      expect(state.pausedSeconds).toBe(0);
    });

    it('freezes moving time while paused', () => {
      const startTime = 1000000;
      const pauseStartTime = startTime + 45000; // paused after 45s
      const now = startTime + 100000; // 55s spent in paused state
      const state = calculateSessionTimestamps(startTime, pauseStartTime, 0, now);

      expect(state.movingSeconds).toBe(45); // Must remain at 45 seconds
      expect(state.pausedSeconds).toBe(55); // 55 seconds paused
    });

    it('resumes moving time from paused value without skipping or resetting', () => {
      const startTime = 1000000;
      // Session ran 45s, was paused for 30s (totalPausedMs = 30000), now running at t + 120s
      const totalPausedMs = 30000;
      const now = startTime + 120000; // 120s total clock time
      const state = calculateSessionTimestamps(startTime, null, totalPausedMs, now);

      // Moving seconds = 120 - 30 = 90 seconds
      expect(state.movingSeconds).toBe(90);
      expect(state.pausedSeconds).toBe(30);
    });
  });

  describe('4. Calorie MET Formula & Weight Handling', () => {
    it('uses correct MET values with Ainsworth 2011 compendium scale', () => {
      expect(getMetForActivity('walk')).toBe(3.5);
      expect(getMetForActivity('cycle')).toBe(7.0);
      expect(getMetForActivity('gym')).toBe(5.5);

      // Run MET scales with pace:
      // Pace slower than 6:00/km (e.g. 7:00/km) -> 8.5
      expect(getMetForActivity('run', 7.0)).toBe(8.5);
      // Pace faster than 4:00/km (e.g. 3:30/km) -> 11.5
      expect(getMetForActivity('run', 3.5)).toBe(11.5);
      // Pace at 5:00/km (halfway between 6:00 and 4:00) -> 10.0
      expect(getMetForActivity('run', 5.0)).toBeCloseTo(10.0, 1);
    });

    it('calculates honest calories = MET * weightKg * hours', () => {
      // 1 hour walk at 70kg: 3.5 * 70 * 1 = 245 kcal
      const walk = calculateHonestCalories('walk', 3600, 70);
      expect(walk.calories).toBe(245);
      expect(walk.isEstimate).toBe(false);

      // 30 min cycle at 80kg: 7.0 * 80 * 0.5 = 280 kcal
      const cycle = calculateHonestCalories('cycle', 1800, 80);
      expect(cycle.calories).toBe(280);
      expect(cycle.isEstimate).toBe(false);
    });

    it('falls back to 70kg and marks isEstimate as true when user weight is absent', () => {
      const run = calculateHonestCalories('run', 3600, 0, 5.0);
      // 10.0 * 70 * 1 = 700 kcal
      expect(run.calories).toBe(700);
      expect(run.isEstimate).toBe(true);
    });
  });

  describe('5. GPS Filtering (Accuracy, Teleport, and Jitter Filters)', () => {
    it('rejects fixes with accuracy worse than 50 meters', () => {
      const filterState = createInitialGpsFilterState();
      const lastPoint: RoutePoint = {
        lat: 37.7749,
        lng: -122.4194,
        t: 1000000,
        accuracy: 10,
        speed: 3.0,
      };

      const poorFix: GpsFixInput = {
        latitude: 37.7750,
        longitude: -122.4194,
        accuracy: 55, // > 50m rejected
        speed: 3.0,
        altitude: 15,
        timestamp: 1001000,
      };

      const { result } = processGpsFix(poorFix, lastPoint, 'run', filterState);
      expect(result.accepted).toBe(false);
      expect(result.rejectReason).toBe('accuracy_too_poor');
    });

    it('rejects teleport segments exceeding max speed (12 m/s for run, 20 m/s for cycle)', () => {
      const filterState = createInitialGpsFilterState();
      const lastPoint: RoutePoint = {
        lat: 37.7749,
        lng: -122.4194,
        t: 1000000,
        accuracy: 10,
        speed: 3.0,
      };

      // 500 meters away in 2 seconds = 250 m/s teleport!
      const teleportFix: GpsFixInput = {
        latitude: 37.7794,
        longitude: -122.4194,
        accuracy: 10,
        speed: 3.0,
        altitude: 15,
        timestamp: 1002000, // 2s later
      };

      // Run max speed is 12 m/s
      const runTest = processGpsFix(teleportFix, lastPoint, 'run', filterState);
      expect(runTest.result.accepted).toBe(false);
      expect(runTest.result.rejectReason).toBe('teleport_speed_exceeded');

      // Cycle max speed is 20 m/s
      const cycleTest = processGpsFix(teleportFix, lastPoint, 'cycle', filterState);
      expect(cycleTest.result.accepted).toBe(false);
      expect(cycleTest.result.rejectReason).toBe('teleport_speed_exceeded');
    });

    it('filters jitter smaller than 2 meters', () => {
      const filterState = createInitialGpsFilterState();
      const lastPoint: RoutePoint = {
        lat: 37.774900,
        lng: -122.419400,
        t: 1000000,
        accuracy: 5,
        speed: 0.5,
      };

      // Extremely tiny step ~0.4m
      const jitterFix: GpsFixInput = {
        latitude: 37.774903,
        longitude: -122.419400,
        accuracy: 5,
        speed: 0.5,
        altitude: 10,
        timestamp: 1001000,
      };

      const { result } = processGpsFix(jitterFix, lastPoint, 'run', filterState);
      expect(result.accepted).toBe(false);
      expect(result.rejectReason).toBe('jitter_under_threshold');
    });

    it('accepts legitimate running fix and smooths speed with rolling average', () => {
      const filterState = createInitialGpsFilterState();
      const lastPoint: RoutePoint = {
        lat: 37.7749,
        lng: -122.4194,
        t: 1000000,
        accuracy: 8,
        speed: 3.2,
      };

      // 10 meters in 3 seconds = 3.33 m/s (~12 km/h running pace)
      const validFix: GpsFixInput = {
        latitude: 37.77499,
        longitude: -122.4194,
        accuracy: 8,
        speed: 3.3,
        altitude: 20,
        timestamp: 1003000,
      };

      const { result, nextState } = processGpsFix(validFix, lastPoint, 'run', filterState);
      expect(result.accepted).toBe(true);
      expect(result.segmentDistanceM).toBeGreaterThan(2);
      expect(result.point).toBeDefined();
      expect(nextState.recentSpeeds.length).toBeGreaterThan(0);
    });
  });

  describe('6. Route Downsampling', () => {
    it('downsamples route by keeping only points >5m from last kept point', () => {
      const startPoint: RoutePoint = { lat: 37.7749, lng: -122.4194, t: 1000, accuracy: 5, speed: 3 };
      // 0.9m away (should be dropped)
      const closePoint1: RoutePoint = { lat: 37.774908, lng: -122.4194, t: 2000, accuracy: 5, speed: 3 };
      // 1.8m away (should be dropped)
      const closePoint2: RoutePoint = { lat: 37.774916, lng: -122.4194, t: 3000, accuracy: 5, speed: 3 };
      // 16m away (should be kept)
      const farPoint: RoutePoint = { lat: 37.77505, lng: -122.4194, t: 4000, accuracy: 5, speed: 3 };

      const downsampled = downsampleRoute([startPoint, closePoint1, closePoint2, farPoint]);
      expect(downsampled).toHaveLength(2);
      expect(downsampled[0]).toEqual(startPoint);
      expect(downsampled[1]).toEqual(farPoint);
    });

    it('strictly caps route at 2000 points to prevent document bloat', () => {
      const manyPoints: RoutePoint[] = [];
      for (let i = 0; i < 3000; i++) {
        // Step 10m each time so they pass the 5m threshold
        manyPoints.push({
          lat: 37.7749 + i * 0.0001,
          lng: -122.4194,
          t: 1000 + i * 1000,
          accuracy: 5,
          speed: 3,
        });
      }

      const downsampled = downsampleRoute(manyPoints, 5, 2000);
      expect(downsampled.length).toBeLessThanOrEqual(2000);
    });
  });

  describe('7. Creature XP Basis Consistency', () => {
    it('awards 50 XP base + 20 XP per full kilometre capped at 200 XP', () => {
      // 0 km: 50 XP
      expect(calculateActivityXP('run', 400)).toBe(50);
      // 1 km: 50 + 20 = 70 XP
      expect(calculateActivityXP('run', 1200)).toBe(70);
      // 5 km: 50 + 5 * 20 = 150 XP
      expect(calculateActivityXP('run', 5050)).toBe(150);
      // 10 km (exceeds cap): 50 + 200 = 250 -> capped at 200 XP
      expect(calculateActivityXP('run', 10000)).toBe(200);
    });
  });
});
