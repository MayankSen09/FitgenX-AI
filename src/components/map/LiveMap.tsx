import { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ActivityType, KmSplit, RoutePoint } from '../../types/activity';
import { processGpsFix, createInitialGpsFilterState, type GpsFilterState } from '../../utils/gpsFilter';

// Default center (India center if no geolocation yet)
const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];

export interface LiveMapProps {
  activityType?: ActivityType;
  isTracking?: boolean;
  hasStarted?: boolean;
  onLocationUpdate?: (data: {
    point: RoutePoint;
    positions: [number, number][];
    totalDistanceM: number;
    smoothedSpeed: number;
    elevationGainM: number | null;
  }) => void;
  onAutoPauseChange?: (shouldPause: boolean) => void;
  onRequestManualEntry?: () => void;
  initialPositions?: [number, number][];
  isReadOnly?: boolean;
  splits?: KmSplit[];
}

function MapController({
  center,
  bounds,
}: {
  center: [number, number];
  bounds?: L.LatLngBoundsExpression | null;
}) {
  const map = useMap();
  const [userInteracting, setUserInteracting] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const handleInteraction = () => setUserInteracting(true);
    map.on('dragstart', handleInteraction);
    map.on('zoomstart', handleInteraction);

    return () => {
      map.off('dragstart', handleInteraction);
      map.off('zoomstart', handleInteraction);
    };
  }, [map]);

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
      return;
    }

    if (isFirstRender.current) {
      map.setView(center, 16);
      isFirstRender.current = false;
    } else if (!userInteracting) {
      map.panTo(center, { animate: true, duration: 0.5 });
    }
  }, [map, center, bounds, userInteracting]);

  if (userInteracting && !bounds) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setUserInteracting(false);
          map.setView(center, 16);
        }}
        className="absolute top-24 right-4 z-[400] bg-zinc-900/90 backdrop-blur-md text-white border border-white/10 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xl transition-all hover:bg-zinc-800"
      >
        <span className="material-symbols-outlined text-sm text-emerald-400">my_location</span>
        Recenter
      </button>
    );
  }

  return null;
}

// Custom DivIcon for Kilometer Milestones
function createKmIcon(km: number) {
  return L.divIcon({
    className: 'custom-km-marker',
    html: `<div style="
      background: #18181b;
      color: #34d399;
      border: 2px solid #34d399;
      border-radius: 9999px;
      font-weight: 800;
      font-size: 10px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    ">${km}k</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

// Custom Start / Finish Marker
function createEndpointIcon(label: 'START' | 'FINISH', color: string) {
  return L.divIcon({
    className: 'custom-endpoint-marker',
    html: `<div style="
      background: ${color};
      color: #ffffff;
      border-radius: 8px;
      font-weight: 900;
      font-size: 9px;
      padding: 2px 6px;
      letter-spacing: 0.05em;
      box-shadow: 0 4px 12px rgba(0,0,0,0.6);
      border: 1px solid rgba(255,255,255,0.4);
    ">${label}</div>`,
    iconSize: [44, 20],
    iconAnchor: [22, 10],
  });
}

export default function LiveMap({
  activityType = 'run',
  isTracking = false,
  hasStarted = false,
  onLocationUpdate,
  onAutoPauseChange,
  onRequestManualEntry,
  initialPositions,
  isReadOnly = false,
  splits = [],
}: LiveMapProps) {
  const [positions, setPositions] = useState<[number, number][]>(initialPositions || []);
  const [currentCenter, setCurrentCenter] = useState<[number, number]>(
    initialPositions && initialPositions.length > 0 ? initialPositions[0] : DEFAULT_CENTER
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [loading, setLoading] = useState(!initialPositions || initialPositions.length === 0);
  const [isGpsSignalLost, setIsGpsSignalLost] = useState(false);

  // Kilometer milestone coordinates
  const [kmMarkers, setKmMarkers] = useState<Array<{ km: number; position: [number, number] }>>([]);

  const watchIdRef = useRef<number | null>(null);
  const totalDistanceRef = useRef(0);
  const lastPointRef = useRef<RoutePoint | null>(null);
  const filterStateRef = useRef<GpsFilterState>(createInitialGpsFilterState());
  const lastFixTimeRef = useRef<number>(Date.now());
  const autoPausedForLossRef = useRef(false);

  // Request initial GPS position
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setLocationError(null);
    setIsPermissionDenied(false);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const pt: [number, number] = [latitude, longitude];
        setCurrentCenter(pt);
        if (!hasStarted) {
          setPositions([pt]);
        }
        setLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLoading(false);
        if (err.code === 1) {
          setIsPermissionDenied(true);
          setLocationError('Location access was denied. Please allow location permissions in your browser.');
        } else {
          setLocationError('Unable to acquire GPS signal. Check your connection or retry.');
        }
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  useEffect(() => {
    if (!isReadOnly && (!initialPositions || initialPositions.length === 0)) {
      requestLocation();
    }
  }, [isReadOnly]);

  // GPS Watchdog: Check for signal loss (10s banner, 30s auto-pause)
  useEffect(() => {
    if (!hasStarted || !isTracking || isReadOnly) {
      setIsGpsSignalLost(false);
      return;
    }

    const watchdog = setInterval(() => {
      const elapsedSinceFix = Date.now() - lastFixTimeRef.current;

      if (elapsedSinceFix >= 10000 && !isGpsSignalLost) {
        setIsGpsSignalLost(true);
      }

      if (elapsedSinceFix >= 30000 && !autoPausedForLossRef.current) {
        autoPausedForLossRef.current = true;
        onAutoPauseChange?.(true);
      }
    }, 1000);

    return () => clearInterval(watchdog);
  }, [hasStarted, isTracking, isReadOnly, isGpsSignalLost, onAutoPauseChange]);

  // Continuous tracking handler (Only records when hasStarted && isTracking)
  useEffect(() => {
    if (isReadOnly || !navigator.geolocation) return;

    if (hasStarted && isTracking) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          lastFixTimeRef.current = Date.now();

          // Recover from GPS signal lost state
          if (isGpsSignalLost) {
            setIsGpsSignalLost(false);
          }
          if (autoPausedForLossRef.current) {
            autoPausedForLossRef.current = false;
            onAutoPauseChange?.(false);
          }

          const { latitude, longitude, accuracy, speed, altitude } = position.coords;

          const { result, nextState } = processGpsFix(
            {
              latitude,
              longitude,
              accuracy: accuracy ?? 100,
              speed: speed ?? null,
              altitude: altitude ?? null,
              timestamp: position.timestamp || Date.now(),
            },
            lastPointRef.current,
            activityType,
            filterStateRef.current
          );

          filterStateRef.current = nextState;

          if (!result.accepted || !result.point) {
            return;
          }

          // Movement accepted: update state
          const newPoint = result.point;
          lastPointRef.current = newPoint;
          const newCoord: [number, number] = [newPoint.lat, newPoint.lng];

          // Check for kilometer milestone
          const prevKm = Math.floor(totalDistanceRef.current / 1000);
          totalDistanceRef.current += result.segmentDistanceM;
          const currKm = Math.floor(totalDistanceRef.current / 1000);

          if (currKm > prevKm) {
            setKmMarkers((prev) => [...prev, { km: currKm, position: newCoord }]);
          }

          setPositions((prev) => {
            const updated = [...prev, newCoord];
            setCurrentCenter(newCoord);

            onLocationUpdate?.({
              point: newPoint,
              positions: updated,
              totalDistanceM: totalDistanceRef.current,
              smoothedSpeed: result.smoothedSpeed,
              elevationGainM: result.newCumulativeElevationGainM,
            });

            return updated;
          });

          setLocationError(null);
        },
        (error) => {
          console.warn('WatchPosition warning:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 2000,
          timeout: 10000,
        }
      );
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [hasStarted, isTracking, isReadOnly, activityType, isGpsSignalLost, onAutoPauseChange, onLocationUpdate]);

  // Read-only bounds calculation for replaying completed route
  const readOnlyBounds = useMemo(() => {
    if (isReadOnly && positions.length > 1) {
      return L.latLngBounds(positions);
    }
    return null;
  }, [isReadOnly, positions]);

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      {/* Loading GPS Overlay */}
      {loading && !isReadOnly && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/90 backdrop-blur-md">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-zinc-300 font-bold uppercase tracking-wider">Acquiring GPS Signal...</p>
          </div>
        </div>
      )}

      {/* GPS Signal Lost Warning Banner */}
      {isGpsSignalLost && hasStarted && (
        <div className="absolute top-20 inset-x-4 z-40 bg-amber-500/90 backdrop-blur-md text-zinc-950 px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-xl animate-bounce">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">signal_cellular_connected_no_internet_0_bar</span>
            <span className="text-xs font-bold">GPS Signal Lost. Searching for satellite lock...</span>
          </div>
        </div>
      )}

      {/* Geolocation Error / Permission Denied State */}
      {locationError && !isReadOnly && (
        <div className="absolute top-20 inset-x-4 z-40 bg-zinc-900/95 border border-rose-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-3">
          <div className="flex items-center gap-2.5 text-rose-400">
            <span className="material-symbols-outlined text-xl">location_off</span>
            <h4 className="text-xs font-bold uppercase tracking-wider">
              {isPermissionDenied ? 'GPS Permission Denied' : 'Location Error'}
            </h4>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">{locationError}</p>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={requestLocation}
              className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Retry GPS
            </button>
            {onRequestManualEntry && (
              <button
                type="button"
                onClick={onRequestManualEntry}
                className="flex-1 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">edit_note</span>
                Manual Entry
              </button>
            )}
          </div>
        </div>
      )}

      <MapContainer
        center={currentCenter}
        zoom={16}
        zoomControl={false}
        attributionControl={true}
        className="w-full h-full"
        style={{ background: '#09090b' }}
      >
        {/* CartoDB Dark Matter tile layer for dark athletic UI */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Live / Replayed Route Polyline */}
        {positions.length > 1 && (
          <Polyline
            positions={positions}
            pathOptions={{
              color: '#10b981',
              weight: 5,
              lineCap: 'round',
              lineJoin: 'round',
              opacity: 0.9,
            }}
          />
        )}

        {/* Start Marker */}
        {positions.length > 0 && (
          <Marker position={positions[0]} icon={createEndpointIcon('START', '#10b981')}>
            <Tooltip direction="top" offset={[0, -10]}>Start Location</Tooltip>
          </Marker>
        )}

        {/* Kilometer Milestone Pins */}
        {kmMarkers.map((marker) => (
          <Marker
            key={`km-${marker.km}`}
            position={marker.position}
            icon={createKmIcon(marker.km)}
          >
            <Tooltip direction="top" offset={[0, -12]}>
              {marker.km} km split: {splits[marker.km - 1]?.pace || 'Split recorded'}
            </Tooltip>
          </Marker>
        ))}

        {/* Finish Marker (if read-only replay) */}
        {isReadOnly && positions.length > 1 && (
          <Marker position={positions[positions.length - 1]} icon={createEndpointIcon('FINISH', '#ef4444')}>
            <Tooltip direction="top" offset={[0, -10]}>Finish Location</Tooltip>
          </Marker>
        )}

        {/* Live Current Position Marker (Pulsing Halo) */}
        {!isReadOnly && positions.length > 0 && (
          <>
            <CircleMarker
              center={positions[positions.length - 1]}
              radius={16}
              pathOptions={{
                color: '#10b981',
                fillColor: '#10b981',
                fillOpacity: 0.2,
                weight: 1,
                opacity: 0.4,
              }}
            />
            <CircleMarker
              center={positions[positions.length - 1]}
              radius={7}
              pathOptions={{
                color: '#ffffff',
                fillColor: '#10b981',
                fillOpacity: 1,
                weight: 2,
              }}
            />
          </>
        )}

        <MapController center={currentCenter} bounds={readOnlyBounds} />
      </MapContainer>
    </div>
  );
}
