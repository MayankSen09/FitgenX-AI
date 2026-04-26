import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Default fallback center (user's approximate location or a neutral point)
const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629]; // India center

interface LiveMapProps {
  onLocationUpdate?: (data: {
    positions: [number, number][];
    totalDistance: number;
    currentSpeed: number;
  }) => void;
  isTracking?: boolean;
}

// Calculate distance between two lat/lng points using the Haversine formula (returns meters)
function haversineDistance(
  [lat1, lon1]: [number, number],
  [lat2, lon2]: [number, number]
): number {
  const R = 6371e3; // Earth's radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Hide attribution for clean UI
    const attribution = document.querySelector('.leaflet-control-attribution');
    if (attribution) {
      attribution.remove();
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      map.setView(center, 16);
      isFirstRender.current = false;
    } else {
      map.panTo(center, { animate: true, duration: 0.5 });
    }
  }, [map, center]);

  return null;
}

export default function LiveMap({ onLocationUpdate, isTracking = true }: LiveMapProps) {
  const [positions, setPositions] = useState<[number, number][]>([]);
  const [currentCenter, setCurrentCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const watchIdRef = useRef<number | null>(null);
  const totalDistanceRef = useRef(0);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    // First, get a quick initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const point: [number, number] = [latitude, longitude];
        setCurrentCenter(point);
        setPositions([point]);
        setLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Enable location access to use live tracking.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    // Then, start continuous tracking
    if (isTracking) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed } = position.coords;
          const newPoint: [number, number] = [latitude, longitude];

          setPositions((prev) => {
            const updated = [...prev, newPoint];

            // Calculate distance from the last point
            if (prev.length > 0) {
              const lastPoint = prev[prev.length - 1];
              const segmentDistance = haversineDistance(lastPoint, newPoint);
              // Only count if the movement is more than 2m (filter GPS jitter)
              if (segmentDistance > 2) {
                totalDistanceRef.current += segmentDistance;
              }
            }

            // Report back to parent
            if (onLocationUpdate) {
              onLocationUpdate({
                positions: updated,
                totalDistance: totalDistanceRef.current,
                currentSpeed: speed ?? 0,
              });
            }

            return updated;
          });

          setCurrentCenter(newPoint);
          setLocationError(null);
        },
        (error) => {
          console.error('Watch position error:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 3000,
          timeout: 10000,
        }
      );
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isTracking, onLocationUpdate]);

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-900">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-zinc-400 font-semibold">Acquiring GPS Signal...</p>
          </div>
        </div>
      )}

      {locationError && (
        <div className="absolute top-4 left-4 right-4 z-20 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-xl px-4 py-3">
          <p className="text-xs text-red-300 font-semibold text-center">{locationError}</p>
        </div>
      )}

      <MapContainer
        center={currentCenter}
        zoom={16}
        zoomControl={false}
        className="w-full h-full"
        style={{ background: '#09090b' }}
      >
        {/* CartoDB Dark Matter tile layer for perfectly matching dark UI */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Live route polyline */}
        {positions.length > 1 && (
          <Polyline
            positions={positions}
            pathOptions={{
              color: '#00D1FF',
              weight: 6,
              lineCap: 'round',
              lineJoin: 'round',
              opacity: 0.8,
            }}
          />
        )}

        {/* Current position marker (pulsing dot) */}
        {positions.length > 0 && (
          <>
            {/* Outer glow ring */}
            <CircleMarker
              center={positions[positions.length - 1]}
              radius={16}
              pathOptions={{
                color: '#007AFF',
                fillColor: '#007AFF',
                fillOpacity: 0.15,
                weight: 1,
                opacity: 0.3,
              }}
            />
            {/* Inner dot */}
            <CircleMarker
              center={positions[positions.length - 1]}
              radius={6}
              pathOptions={{
                color: '#ffffff',
                fillColor: '#007AFF',
                fillOpacity: 1,
                weight: 2,
              }}
            />
          </>
        )}

        <MapController center={currentCenter} />
      </MapContainer>
    </div>
  );
}
