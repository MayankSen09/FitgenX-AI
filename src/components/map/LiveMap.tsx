import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// San Francisco coordinates
const center: [number, number] = [37.7749, -122.4194];

// Simulated tracking route
const routeLine: [number, number][] = [
  [37.7749, -122.4194],
  [37.7755, -122.4180],
  [37.7760, -122.4170],
  [37.7770, -122.4150],
  [37.7780, -122.4130],
  [37.7795, -122.4100],
  [37.7810, -122.4080],
];

function MapController() {
  const map = useMap();
  useEffect(() => {
    // Hide standard attribution to keep the UI clean like the design
    const attribution = document.querySelector('.leaflet-control-attribution');
    if (attribution) {
      attribution.remove();
    }
    
    // Auto-fit to route
    map.fitBounds(routeLine, { padding: [50, 50] });
  }, [map]);
  return null;
}

export default function LiveMap() {
  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <MapContainer 
        center={center} 
        zoom={14} 
        zoomControl={false}
        className="w-full h-full"
        style={{ background: '#09090b' }}
      >
        {/* CartoDB Dark Matter tile layer for perfectly matching dark UI */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Polyline 
          positions={routeLine} 
          pathOptions={{ color: '#00D1FF', weight: 6, lineCap: 'round', lineJoin: 'round', opacity: 0.8 }} 
        />
        <MapController />
      </MapContainer>
    </div>
  );
}
