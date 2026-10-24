import { haversineDistance } from './activityCalculations';
import type { ActivityType, RoutePoint } from '../types/activity';

export interface GpsFixInput {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number | null;
  altitude: number | null;
  timestamp: number;
}

export interface GpsFilterState {
  recentSpeeds: number[]; // Rolling speed buffer (last 5 fixes)
  lastAltitude: number | null;
  cumulativeElevationGainM: number;
}

export function createInitialGpsFilterState(): GpsFilterState {
  return {
    recentSpeeds: [],
    lastAltitude: null,
    cumulativeElevationGainM: 0,
  };
}

export interface GpsFilterResult {
  accepted: boolean;
  rejectReason?: 'accuracy_too_poor' | 'teleport_speed_exceeded' | 'jitter_under_threshold';
  point?: RoutePoint;
  segmentDistanceM: number;
  smoothedSpeed: number;
  newCumulativeElevationGainM: number | null;
}

/**
 * Validates, filters, and smooths a raw GPS fix according to athletic telemetry criteria:
 * 1. Accuracy filter: Rejects fixes with accuracy > 50m.
 * 2. Teleport rejection: Rejects implied speeds > 12 m/s (run/walk) or > 20 m/s (cycle).
 * 3. Jitter filter: Ignores micro-movements < 2m from the last point.
 * 4. Speed smoothing: Computes a rolling average across the last 5 fixes.
 * 5. Honest altitude: Accumulates positive elevation gain only for sane altitudes (delta > 1.5m).
 */
export function processGpsFix(
  fix: GpsFixInput,
  lastPoint: RoutePoint | null,
  activityType: ActivityType,
  state: GpsFilterState
): { result: GpsFilterResult; nextState: GpsFilterState } {
  // 1. Accuracy Filter
  if (fix.accuracy > 50) {
    return {
      result: {
        accepted: false,
        rejectReason: 'accuracy_too_poor',
        segmentDistanceM: 0,
        smoothedSpeed: 0,
        newCumulativeElevationGainM: state.cumulativeElevationGainM > 0 ? state.cumulativeElevationGainM : null,
      },
      nextState: state,
    };
  }

  let segmentDistanceM = 0;

  // 2 & 3. Distance, Teleport, and Jitter Filters
  if (lastPoint) {
    const rawDist = haversineDistance([lastPoint.lat, lastPoint.lng], [fix.latitude, fix.longitude]);
    const dtSeconds = Math.max(0.1, (fix.timestamp - lastPoint.t) / 1000);
    const impliedSpeed = rawDist / dtSeconds;

    const maxAllowedSpeed = activityType === 'cycle' ? 20 : 12; // m/s (approx 43 km/h for run/walk, 72 km/h for cycle)

    // Check for impossible GPS jumps / teleports
    if (impliedSpeed > maxAllowedSpeed) {
      return {
        result: {
          accepted: false,
          rejectReason: 'teleport_speed_exceeded',
          segmentDistanceM: 0,
          smoothedSpeed: 0,
          newCumulativeElevationGainM: state.cumulativeElevationGainM > 0 ? state.cumulativeElevationGainM : null,
        },
        nextState: state,
      };
    }

    // 2m GPS jitter threshold
    if (rawDist < 2) {
      return {
        result: {
          accepted: false,
          rejectReason: 'jitter_under_threshold',
          segmentDistanceM: 0,
          smoothedSpeed: 0,
          newCumulativeElevationGainM: state.cumulativeElevationGainM > 0 ? state.cumulativeElevationGainM : null,
        },
        nextState: state,
      };
    }

    segmentDistanceM = rawDist;
  }

  // 4. Smooth speed with rolling average of last 5 fixes
  const rawSpeed = fix.speed !== null && fix.speed >= 0 ? fix.speed : 0;
  const nextSpeeds = [...state.recentSpeeds, rawSpeed].slice(-5);
  const smoothedSpeed = nextSpeeds.reduce((sum, s) => sum + s, 0) / nextSpeeds.length;

  // 5. Honest altitude gain
  let newElevationGain = state.cumulativeElevationGainM;
  let nextLastAlt = state.lastAltitude;

  if (
    typeof fix.altitude === 'number' &&
    !isNaN(fix.altitude) &&
    fix.altitude > -500 &&
    fix.altitude < 9000
  ) {
    if (state.lastAltitude !== null) {
      const altDelta = fix.altitude - state.lastAltitude;
      // Require > 1.5m delta to filter barometer/GPS altitude noise
      if (altDelta > 1.5) {
        newElevationGain += altDelta;
      }
    }
    nextLastAlt = fix.altitude;
  }

  const point: RoutePoint = {
    lat: fix.latitude,
    lng: fix.longitude,
    t: fix.timestamp,
    accuracy: fix.accuracy,
    speed: smoothedSpeed,
    altitude: nextLastAlt,
  };

  const nextState: GpsFilterState = {
    recentSpeeds: nextSpeeds,
    lastAltitude: nextLastAlt,
    cumulativeElevationGainM: newElevationGain,
  };

  return {
    result: {
      accepted: true,
      point,
      segmentDistanceM,
      smoothedSpeed,
      newCumulativeElevationGainM: newElevationGain > 0 ? Math.round(newElevationGain) : null,
    },
    nextState,
  };
}
